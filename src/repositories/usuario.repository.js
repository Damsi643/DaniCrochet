const { Usuario } = require('../models');

const usuarioRepository = {
  findByCorreo(correo) {
    return Usuario.findOne({
      where: { correo: String(correo).toLowerCase().trim() },
    });
  },

  count() {
    return Usuario.count();
  },

  create(datos) {
    return Usuario.create(datos);
  },
};

module.exports = usuarioRepository;
