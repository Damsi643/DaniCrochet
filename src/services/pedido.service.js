const { ESTADOS_PEDIDO } = require('../models');
const pedidoRepository = require('../repositories/pedido.repository');
const productoRepository = require('../repositories/producto.repository');
const { ValidacionError } = require('./producto.service');

class PedidoNoEncontradoError extends Error {
  constructor(mensaje = 'Pedido no encontrado') {
    super(mensaje);
    this.name = 'PedidoNoEncontradoError';
  }
}

class StockInsuficienteError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'StockInsuficienteError';
  }
}

function validarDatosCliente(cliente) {
  if (!cliente || !cliente.nombre || !String(cliente.nombre).trim()) {
    throw new ValidacionError('El nombre del cliente es obligatorio');
  }
  const correo = String(cliente.correo || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new ValidacionError('El correo del cliente no es válido');
  }
  return {
    nombre: String(cliente.nombre).trim(),
    correo,
    telefono: cliente.telefono ? String(cliente.telefono).trim() : null,
  };
}

function normalizarItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidacionError('El pedido debe incluir al menos un producto');
  }

  const cantidades = new Map();

  for (const item of items) {
    const productoId = Number(item && item.productoId);
    const cantidad = Number(item && item.cantidad);

    if (!Number.isInteger(productoId) || productoId <= 0) {
      throw new ValidacionError('Hay un producto inválido en el pedido');
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new ValidacionError('Las cantidades deben ser enteras mayores a 0');
    }

    cantidades.set(
      productoId,
      (cantidades.get(productoId) || 0) + cantidad
    );
  }

  return [...cantidades.entries()].map(([productoId, cantidad]) => ({
    productoId,
    cantidad,
  }));
}

const pedidoService = {
  ESTADOS: ESTADOS_PEDIDO,

  listarPedidos() {
    return pedidoRepository.listar();
  },

  async obtenerPedidoPorId(id) {
    const idNumerico = Number(id);
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      throw new PedidoNoEncontradoError();
    }
    const pedido = await pedidoRepository.buscarPorId(idNumerico);
    if (!pedido) {
      throw new PedidoNoEncontradoError();
    }
    return pedido;
  },

  async crearPedido(datos) {
    const datosCliente = validarDatosCliente(datos && datos.cliente);
    const items = normalizarItems(datos && datos.items);

    let pedidoId;

    await pedidoRepository.transaccion(async (t) => {
      let total = 0;
      const lineas = [];

      for (const item of items) {
        const producto = await productoRepository.findById(
          item.productoId,
          { transaction: t }
        );

        if (!producto || !producto.activo) {
          throw new ValidacionError(
            'Uno de los productos del pedido ya no está disponible'
          );
        }
        if (producto.stock < item.cantidad) {
          throw new StockInsuficienteError(
            `Stock insuficiente de "${producto.nombre}" (disponible: ${producto.stock}, solicitado: ${item.cantidad})`
          );
        }

        const subtotal =
          Number(producto.precio) * item.cantidad;

        lineas.push({ producto, cantidad: item.cantidad, subtotal });
        total += subtotal;
      }

      const cliente = await pedidoRepository.buscarOCrearCliente(
        datosCliente,
        t
      );

      const pedido = await pedidoRepository.crear(
        { clienteId: cliente.id, total, estado: 'Pendiente' },
        t
      );

      for (const linea of lineas) {
        await pedidoRepository.crearDetalle(
          {
            pedidoId: pedido.id,
            productoId: linea.producto.id,
            nombreProducto: linea.producto.nombre,
            precioUnitario: linea.producto.precio,
            cantidad: linea.cantidad,
            subtotal: linea.subtotal,
          },
          t
        );
      }

      await pedidoRepository.crearPago(
        { pedidoId: pedido.id, monto: total, estado: 'Pendiente' },
        t
      );

      pedidoId = pedido.id;
    });

    return pedidoRepository.buscarPorId(pedidoId);
  },

  async cambiarEstado(id, nuevoEstado) {
    const idNumerico = Number(id);
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      throw new PedidoNoEncontradoError();
    }
    if (!ESTADOS_PEDIDO.includes(nuevoEstado)) {
      throw new ValidacionError(
        `Estado no válido. Use uno de: ${ESTADOS_PEDIDO.join(', ')}`
      );
    }

    await pedidoRepository.transaccion(async (t) => {
      const pedido = await pedidoRepository.buscarPorIdConDetalles(
        idNumerico,
        t
      );

      if (!pedido) {
        throw new PedidoNoEncontradoError();
      }

      const actual = pedido.estado;
      if (actual === nuevoEstado) return;

      if (nuevoEstado === 'Confirmado') {
        if (actual !== 'Pendiente') {
          throw new ValidacionError(
            actual === 'Cancelado'
              ? 'No se puede confirmar un pedido cancelado'
              : 'Este pedido ya tiene el stock descontado'
          );
        }

        for (const detalle of pedido.detalles) {
          const producto = await productoRepository.findById(
            detalle.productoId,
            { transaction: t }
          );

          if (!producto || !producto.activo) {
            throw new ValidacionError(
              `El producto "${detalle.nombreProducto}" ya no está disponible`
            );
          }
          if (producto.stock < detalle.cantidad) {
            throw new StockInsuficienteError(
              `Stock insuficiente de "${detalle.nombreProducto}" (disponible: ${producto.stock}, requerido: ${detalle.cantidad}). Reabastezca antes de confirmar`
            );
          }

          await producto.update(
            { stock: producto.stock - detalle.cantidad },
            { transaction: t }
          );
        }
      }

      if (nuevoEstado === 'Cancelado') {
        if (actual === 'Entregado') {
          throw new ValidacionError(
            'No se puede cancelar un pedido que ya fue entregado'
          );
        }
        if (actual === 'Confirmado' || actual === 'En preparación') {
          for (const detalle of pedido.detalles) {
            const producto = await productoRepository.findById(
              detalle.productoId,
              { transaction: t }
            );
            if (producto) {
              await producto.update(
                { stock: producto.stock + detalle.cantidad },
                { transaction: t }
              );
            }
          }
        }
      }

      await pedido.update({ estado: nuevoEstado }, { transaction: t });
    });

    return pedidoRepository.buscarPorId(idNumerico);
  },
};

module.exports = {
  pedidoService,
  PedidoNoEncontradoError,
  StockInsuficienteError,
};
