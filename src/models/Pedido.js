const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ESTADOS_PEDIDO = [
  'Pendiente',
  'Confirmado',
  'En preparación',
  'Entregado',
  'Cancelado',
];

const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El total no puede ser negativo' },
      },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Pendiente',
      validate: {
        isIn: {
          args: [ESTADOS_PEDIDO],
          msg: 'Estado de pedido no válido',
        },
      },
    },
  },
  {
    tableName: 'pedidos',
    timestamps: true,
  }
);

module.exports = { Pedido, ESTADOS_PEDIDO };
