const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define(
  'Usuario',
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
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
  }
);

module.exports = Usuario;
