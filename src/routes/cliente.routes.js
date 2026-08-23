const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const { requiereAdminApi } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requiereAdminApi, clienteController.listar);

module.exports = router;
