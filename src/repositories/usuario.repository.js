const { Usuario } = require('../models');

const usuarioRepository = {
  findByCorreo(correo) {
    return Usuario.findOne({
      where: { correo: String(correo).toLowerCase().trim() },
      include: [{ association: 'cliente' }],
    });
  },

  count() {
    return Usuario.count();
  },

  create(datos, opciones) {
    return Usuario.create(datos, opciones);
  },
};

module.exports = usuarioRepository;
