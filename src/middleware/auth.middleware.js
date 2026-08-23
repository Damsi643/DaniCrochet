function requiereAdminApi(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res
    .status(401)
    .json({ error: 'No autenticado. Debe iniciar sesión como administradora.' });
}

function requiereAdminPagina(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.redirect('/login');
}

module.exports = { requiereAdminApi, requiereAdminPagina };
