const { inventarioService } = require('../services/inventario.service');

const inventarioController = {
  async listar(req, res) {
    try {
      const inventario = await inventarioService.listarInventario();
      res.json(inventario);
    } catch (err) {
      console.error('Error al obtener el inventario:', err.message);
      res.status(500).json({ error: 'Error al obtener el inventario' });
    }
  },
};

module.exports = inventarioController;
