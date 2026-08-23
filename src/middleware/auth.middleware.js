function requiereAdminApi(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.rol === 'admin') {
    return next();
  }
  return res
    .status(401)
    .json({ error: 'No autenticado. Debe iniciar sesión como administradora.' });
}

function requiereAdminPagina(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.rol === 'admin') {
    return next();
  }
  return res.redirect('/login');
}

function requiereClienteApi(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.rol === 'cliente') {
    return next();
  }
  return res.status(401).json({ error: 'Debes iniciar sesión para realizar un pedido.' });
}

module.exports = { requiereAdminApi, requiereAdminPagina, requiereClienteApi };
