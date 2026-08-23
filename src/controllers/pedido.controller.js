const {
  pedidoService,
  PedidoNoEncontradoError,
  StockInsuficienteError,
} = require('../services/pedido.service');
const { ValidacionError } = require('../services/producto.service');

function responderError(res, err, mensajeGenerico) {
  if (err instanceof ValidacionError) {
    return res.status(400).json({ error: err.detalles || err.message });
  }
  if (err instanceof StockInsuficienteError) {
    return res.status(409).json({ error: err.message });
  }
  if (err instanceof PedidoNoEncontradoError) {
    return res.status(404).json({ error: err.message });
  }
  console.error(`${mensajeGenerico}:`, err.message);
  return res.status(500).json({ error: mensajeGenerico });
}

const pedidoController = {
  async crear(req, res) {
    try {
      const pedido = await pedidoService.crearPedido(req.body, req.session.usuario);
      res.status(201).json({
        mensaje: 'Pedido registrado correctamente',
        pedido,
      });
    } catch (err) {
      responderError(res, err, 'Error al registrar el pedido');
    }
  },

  async listar(req, res) {
    try {
      const pedidos = await pedidoService.listarPedidos();
      res.json(pedidos);
    } catch (err) {
      responderError(res, err, 'Error al obtener los pedidos');
    }
  },

  async obtenerPorId(req, res) {
    try {
      const pedido = await pedidoService.obtenerPedidoPorId(req.params.id);
      res.json(pedido);
    } catch (err) {
      responderError(res, err, 'Error al obtener el pedido');
    }
  },

  async cambiarEstado(req, res) {
    try {
      const pedido = await pedidoService.cambiarEstado(
        req.params.id,
        req.body ? req.body.estado : undefined
      );
      res.json({ mensaje: 'Estado actualizado', pedido });
    } catch (err) {
      responderError(res, err, 'Error al actualizar el estado del pedido');
    }
  },
};

module.exports = pedidoController;
