const pagoRepository = require('../repositories/pago.repository');
const { ValidacionError } = require('./producto.service');

class PagoNoEncontradoError extends Error {
  constructor(mensaje = 'Pago no encontrado') {
    super(mensaje);
    this.name = 'PagoNoEncontradoError';
  }
}

const pagoService = {
  ESTADOS: pagoRepository.ESTADOS,

  listarPagos() {
    return pagoRepository.listar();
  },

  async cambiarEstado(id, nuevoEstado) {
    const idNumerico = Number(id);
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      throw new PagoNoEncontradoError();
    }
    if (!pagoRepository.ESTADOS.includes(nuevoEstado)) {
      throw new ValidacionError(
        `Estado de pago no válido. Use uno de: ${pagoRepository.ESTADOS.join(', ')}`
      );
    }

    const pago = await pagoRepository.buscarPorId(idNumerico);
    if (!pago) {
      throw new PagoNoEncontradoError();
    }

    await pagoRepository.actualizarEstado(pago, nuevoEstado);
    return pagoRepository.listar();
  },
};

module.exports = { pagoService, PagoNoEncontradoError };
