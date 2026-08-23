const { sequelize, Cliente, Pedido } = require('../models');

const clienteRepository = {
  listarConConteo() {
    return (async () => {
      const clientes = await Cliente.findAll({
        order: [['createdAt', 'DESC']],
      });

      const conteos = await Pedido.findAll({
        attributes: [
          'clienteId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        ],
        group: ['clienteId'],
        raw: true,
      });

      const mapa = new Map(
        conteos.map((c) => [c.clienteId, Number(c.total)])
      );

      return clientes.map((cliente) => ({
        ...cliente.toJSON(),
        totalPedidos: mapa.get(cliente.id) || 0,
      }));
    })();
  },

  count() {
    return Cliente.count();
  },
};

module.exports = clienteRepository;
