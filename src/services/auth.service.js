const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuario.repository');
const { sequelize, Cliente } = require('../models');

class CredencialesInvalidasError extends Error {
  constructor(
    mensaje = 'Correo o contraseña incorrectos'
  ) {
    super(mensaje);
    this.name = 'CredencialesInvalidasError';
  }
}

async function login(correo, password) {
  if (!correo || !password) {
    throw new CredencialesInvalidasError(
      'El correo y la contraseña son obligatorios'
    );
  }

  const usuario = await usuarioRepository.findByCorreo(correo);
  if (!usuario) {
    throw new CredencialesInvalidasError();
  }

  const coincide = await bcrypt.compare(password, usuario.passwordHash);
  if (!coincide) {
    throw new CredencialesInvalidasError();
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    clienteId: usuario.cliente ? usuario.cliente.id : null,
  };
}

async function registrar(nombre, correo, password) {
  nombre = String(nombre || '').trim();
  correo = String(correo || '').toLowerCase().trim();
  password = String(password || '');

  if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new CredencialesInvalidasError('El nombre y un correo válido son obligatorios');
  }
  if (password.length < 8) {
    throw new CredencialesInvalidasError('La contraseña debe tener al menos 8 caracteres');
  }
  if (await usuarioRepository.findByCorreo(correo)) {
    throw new CredencialesInvalidasError('Ya existe una cuenta con ese correo');
  }

  return sequelize.transaction(async (transaction) => {
    const usuario = await usuarioRepository.create({
      nombre,
      correo,
      passwordHash: await bcrypt.hash(password, 10),
      rol: 'cliente',
    }, { transaction });
    const cliente = await Cliente.create({
      usuarioId: usuario.id,
      nombre,
      correo,
    }, { transaction });
    return { id: usuario.id, nombre, correo, rol: 'cliente', clienteId: cliente.id };
  });
}

module.exports = { login, registrar, CredencialesInvalidasError };
