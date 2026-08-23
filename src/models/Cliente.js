const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cliente = sequelize.define(
  'Cliente',
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
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'El correo no es válido' },
      },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: 'clientes',
    timestamps: true,
  }
);

module.exports = Cliente;
