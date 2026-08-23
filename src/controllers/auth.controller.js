const authService = require('../services/auth.service');
const { CredencialesInvalidasError } = require('../services/auth.service');

const authController = {
  async login(req, res) {
    try {
      const { correo, password } = req.body || {};
      const usuario = await authService.login(correo, password);
      req.session.usuario = usuario;
      res.json({ mensaje: 'Sesión iniciada', usuario });
    } catch (err) {
      if (err instanceof CredencialesInvalidasError) {
        return res.status(401).json({ error: err.message });
      }
      console.error('Error en login:', err.message);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  async registrar(req, res) {
    try {
      const { nombre, correo, password } = req.body || {};
      const usuario = await authService.registrar(nombre, correo, password);
      req.session.usuario = usuario;
      res.status(201).json({ mensaje: 'Cuenta creada', usuario });
    } catch (err) {
      if (err instanceof CredencialesInvalidasError) {
        return res.status(400).json({ error: err.message });
      }
      console.error('Error en registro:', err.message);
      res.status(500).json({ error: 'Error al crear la cuenta' });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ mensaje: 'Sesión cerrada' });
    });
  },

  session(req, res) {
    if (req.session && req.session.usuario) {
      return res.json({ usuario: req.session.usuario });
    }
    return res.status(401).json({ error: 'No autenticado' });
  },
};

module.exports = authController;
