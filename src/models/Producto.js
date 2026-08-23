const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío' },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El precio no puede ser negativo' },
      },
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '/img/placeholder.svg',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El stock no puede ser negativo' },
        isInt: { msg: 'El stock debe ser un número entero' },
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'productos',
    timestamps: true,
  }
);

module.exports = Producto;
