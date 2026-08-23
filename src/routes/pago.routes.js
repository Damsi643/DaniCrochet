const express = require('express');
const pagoController = require('../controllers/pago.controller');
const { requiereAdminApi } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requiereAdminApi, pagoController.listar);
router.patch('/:id/estado', requiereAdminApi, pagoController.cambiarEstado);

module.exports = router;
