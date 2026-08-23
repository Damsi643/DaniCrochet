const { Op } = require('sequelize');
const { Producto, PedidoDetalle } = require('../models');

const productoRepository = {
  contarActivos() {
    return Producto.count({ where: { activo: true } });
  },

  contarActivosConStockBajo(umbral) {
    return Producto.count({
      where: { activo: true, stock: { [Op.lte]: umbral } },
    });
  },
  findAll() {
    return Producto.findAll({
      where: { activo: true },
      order: [['createdAt', 'DESC']],
    });
  },

  findAllAdmin() {
    return Producto.findAll({
      order: [['createdAt', 'DESC']],
    });
  },

  findById(id, opciones = {}) {
    return Producto.findByPk(id, opciones);
  },

  create(datos) {
    return Producto.create(datos);
  },

  async update(id, datos) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    await producto.update(datos);
    return producto;
  },

  async remove(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;

    const enPedidos = await PedidoDetalle.count({
      where: { productoId: id },
    });

    if (enPedidos > 0) {
      await producto.update({ activo: false });
      return { desactivado: true };
    }

    await producto.destroy();
    return { desactivado: false };
  },
};

module.exports = productoRepository;
