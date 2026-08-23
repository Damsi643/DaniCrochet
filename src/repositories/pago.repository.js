const { Pago, ESTADOS_PAGO, Cliente, Pedido } = require('../models');
const pedidoRepository = require('../repositories/pedido.repository');

const pagoRepository = {
  listar() {
    return Pago.findAll({
      include: [
        {
          model: Pedido,
          as: 'pedido',
          include: [{ model: Cliente, as: 'cliente' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  },

  async buscarPorId(id) {
    return Pago.findByPk(id);
  },

  actualizarEstado(pago, estado) {
    return pago.update({ estado });
  },

  ESTADOS: ESTADOS_PAGO,
};

module.exports = pagoRepository;
