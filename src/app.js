const path = require('path');
const express = require('express');
const session = require('express-session');
const apiRoutes = require('./routes/api.routes');
const { requiereAdminPagina } = require('./middleware/auth.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dani-crochet-sesion-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));

const VIEWS_DIR = path.join(__dirname, '..', 'views');
const pages = {
  '/': 'index.html',
  '/catalogo': 'catalogo.html',
  '/producto': 'producto.html',
  '/carrito': 'carrito.html',
  '/login': 'login.html',
};

for (const [route, file] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, file));
  });
}

const ADMIN_VIEWS_DIR = path.join(VIEWS_DIR, 'admin');
const adminPages = {
  '/admin': 'dashboard.html',
  '/admin/productos': 'productos.html',
  '/admin/pedidos': 'pedidos.html',
  '/admin/clientes': 'clientes.html',
  '/admin/inventario': 'inventario.html',
  '/admin/pagos': 'pagos.html',
};

for (const [route, file] of Object.entries(adminPages)) {
  app.get(route, requiereAdminPagina, (req, res) => {
    res.sendFile(path.join(ADMIN_VIEWS_DIR, file));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
