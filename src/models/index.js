const sequelize = require('../config/db');
const Producto = require('./Producto');
const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const { Pedido, ESTADOS_PEDIDO } = require('./Pedido');
const PedidoDetalle = require('./PedidoDetalle');
const { Pago, ESTADOS_PAGO } = require('./Pago');

Cliente.hasMany(Pedido, { foreignKey: 'clienteId', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Pedido.hasMany(PedidoDetalle, {
  foreignKey: 'pedidoId',
  as: 'detalles',
  onDelete: 'CASCADE',
});
PedidoDetalle.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Producto.hasMany(PedidoDetalle, { foreignKey: 'productoId' });
PedidoDetalle.belongsTo(Producto, { foreignKey: 'productoId' });

Pedido.hasOne(Pago, { foreignKey: 'pedidoId', as: 'pago', onDelete: 'CASCADE' });
Pago.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

module.exports = {
  sequelize,
  Producto,
  Usuario,
  Cliente,
  Pedido,
  ESTADOS_PEDIDO,
  PedidoDetalle,
  Pago,
  ESTADOS_PAGO,
};
