const clienteRepository = require('../repositories/cliente.repository');

const clienteService = {
  listarClientes() {
    return clienteRepository.listarConConteo();
  },

  contarClientes() {
    return clienteRepository.count();
  },
};

module.exports = { clienteService };
