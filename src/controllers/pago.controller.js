const { pagoService, PagoNoEncontradoError } = require('../services/pago.service');
const { ValidacionError } = require('../services/producto.service');

const pagoController = {
  async listar(req, res) {
    try {
      const pagos = await pagoService.listarPagos();
      res.json(pagos);
    } catch (err) {
      console.error('Error al obtener los pagos:', err.message);
      res.status(500).json({ error: 'Error al obtener los pagos' });
    }
  },

  async cambiarEstado(req, res) {
    try {
      await pagoService.cambiarEstado(
        req.params.id,
        req.body ? req.body.estado : undefined
      );
      const pagos = await pagoService.listarPagos();
      res.json({ mensaje: 'Estado del pago actualizado', pagos });
    } catch (err) {
      if (err instanceof ValidacionError) {
        return res.status(400).json({ error: err.detalles || err.message });
      }
      if (err instanceof PagoNoEncontradoError) {
        return res.status(404).json({ error: err.message });
      }
      console.error('Error al actualizar el pago:', err.message);
      res.status(500).json({ error: 'Error al actualizar el estado del pago' });
    }
  },
};

module.exports = pagoController;
