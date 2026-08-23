const express = require('express');
const { requiereAdminApi } = require('../middleware/auth.middleware');
const { Pedido, Cliente, Pago } = require('../models');
const productoController = require('../controllers/producto.controller');
const productoRepository = require('../repositories/producto.repository');
const { inventarioService, UMBRAL_BAJO_STOCK } = require('../services/inventario.service');
const { clienteService } = require('../services/cliente.service');

const router = express.Router();

router.get('/resumen', requiereAdminApi, async (req, res) => {
  try {
    const [totalProductos, pedidosPendientes, totalClientes, productosBajoStock, pedidosRecientes] =
      await Promise.all([
        productoRepository.contarActivos(),
        Pedido.count({ where: { estado: 'Pendiente' } }),
        clienteService.contarClientes(),
        productoRepository.contarActivosConStockBajo(UMBRAL_BAJO_STOCK),
        Pedido.findAll({
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Pago, as: 'pago' },
          ],
          order: [['createdAt', 'DESC']],
          limit: 5,
        }),
      ]);

    res.json({
      totalProductos,
      pedidosPendientes,
      totalClientes,
      productosBajoStock,
      umbralBajoStock: UMBRAL_BAJO_STOCK,
      pedidosRecientes,
    });
  } catch (err) {
    console.error('Error al obtener el resumen:', err.message);
    res.status(500).json({ error: 'Error al obtener el resumen del panel' });
  }
});

router.get('/productos', requiereAdminApi, productoController.listarTodos);

module.exports = router;
