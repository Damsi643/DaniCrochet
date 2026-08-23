const express = require('express');
const productoController = require('../controllers/producto.controller');
const { requiereAdminApi } = require('../middleware/auth.middleware');
const guardarImagen = require('../middleware/upload.middleware');

const router = express.Router();

router.use('/auth', require('./auth.routes'));

router.get('/productos', productoController.listar);
router.get('/productos/:id', productoController.obtenerPorId);
router.post('/productos', requiereAdminApi, guardarImagen, productoController.crear);
router.put('/productos/:id', requiereAdminApi, guardarImagen, productoController.actualizar);
router.delete('/productos/:id', requiereAdminApi, productoController.eliminar);

router.use('/pedidos', require('./pedido.routes'));
router.use('/clientes', require('./cliente.routes'));
router.use('/inventario', require('./inventario.routes'));
router.use('/pagos', require('./pago.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
