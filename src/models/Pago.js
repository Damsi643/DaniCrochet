const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ESTADOS_PAGO = ['Pendiente', 'Confirmado', 'Rechazado'];

const Pago = sequelize.define(
  'Pago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El monto no puede ser negativo' },
      },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Pendiente',
      validate: {
        isIn: {
          args: [ESTADOS_PAGO],
          msg: 'Estado de pago no válido',
        },
      },
    },
    metodo: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'Contra entrega',
    },
  },
  {
    tableName: 'pagos',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = { Pago, ESTADOS_PAGO };
