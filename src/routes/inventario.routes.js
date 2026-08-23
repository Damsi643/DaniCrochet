const express = require('express');
const inventarioController = require('../controllers/inventario.controller');
const { requiereAdminApi } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requiereAdminApi, inventarioController.listar);

module.exports = router;
