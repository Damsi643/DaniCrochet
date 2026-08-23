const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuario.repository');

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
  };
}

module.exports = { login, CredencialesInvalidasError };
