const express = require('express');
const pedidoController = require('../controllers/pedido.controller');
const { requiereAdminApi, requiereClienteApi } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', requiereClienteApi, pedidoController.crear);
router.get('/', requiereAdminApi, pedidoController.listar);
router.get('/:id', requiereAdminApi, pedidoController.obtenerPorId);
router.patch('/:id/estado', requiereAdminApi, pedidoController.cambiarEstado);

module.exports = router;
