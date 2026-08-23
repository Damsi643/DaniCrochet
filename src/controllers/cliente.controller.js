const { clienteService } = require('../services/cliente.service');

const clienteController = {
  async listar(req, res) {
    try {
      const clientes = await clienteService.listarClientes();
      res.json(clientes);
    } catch (err) {
      console.error('Error al obtener los clientes:', err.message);
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  },
};

module.exports = clienteController;
