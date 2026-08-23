const { sequelize, Pedido, Cliente, PedidoDetalle, Pago } = require('../models');

const pedidoRepository = {
  listar() {
    return Pedido.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Pago, as: 'pago' },
      ],
      order: [['createdAt', 'DESC']],
    });
  },

  buscarPorId(id) {
    return Pedido.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Pago, as: 'pago' },
        { model: PedidoDetalle, as: 'detalles' },
      ],
    });
  },

  buscarPorIdConDetalles(id, t) {
    return Pedido.findByPk(id, {
      include: [{ model: PedidoDetalle, as: 'detalles' }],
      transaction: t,
    });
  },

  transaccion(fn) {
    return sequelize.transaction(fn);
  },

  async buscarOCrearCliente(datosCliente, t) {
    let cliente = await Cliente.findOne({
      where: { correo: datosCliente.correo },
      transaction: t,
    });

    if (!cliente) {
      cliente = await Cliente.create(datosCliente, { transaction: t });
    } else if (
      (datosCliente.nombre && datosCliente.nombre !== cliente.nombre) ||
      (datosCliente.telefono && datosCliente.telefono !== cliente.telefono)
    ) {
      await cliente.update(
        {
          nombre: datosCliente.nombre || cliente.nombre,
          telefono: datosCliente.telefono || cliente.telefono,
        },
        { transaction: t }
      );
    }

    return cliente;
  },

  crear(datos, t) {
    return Pedido.create(datos, { transaction: t });
  },

  crearDetalle(datos, t) {
    return PedidoDetalle.create(datos, { transaction: t });
  },

  crearPago(datos, t) {
    return Pago.create(datos, { transaction: t });
  },
};

module.exports = pedidoRepository;
