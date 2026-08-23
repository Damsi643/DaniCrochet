const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PedidoDetalle = sequelize.define(
  'PedidoDetalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreProducto: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'La cantidad debe ser un número entero' },
        min: { args: [1], msg: 'La cantidad debe ser al menos 1' },
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'pedido_detalles',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = PedidoDetalle;
