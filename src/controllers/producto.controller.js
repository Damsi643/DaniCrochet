const productoService = require('../services/producto.service');
const {
  ValidacionError,
  ProductoNoEncontradoError,
} = require('../services/producto.service');

function responderError(res, err, mensajeGenerico) {
  if (err instanceof ValidacionError) {
    return res.status(400).json({ error: err.detalles });
  }
  if (err instanceof ProductoNoEncontradoError) {
    return res.status(404).json({ error: err.message });
  }
  console.error(`${mensajeGenerico}:`, err.message);
  return res.status(500).json({ error: mensajeGenerico });
}

const productoController = {
  async listar(req, res) {
    try {
      const productos = await productoService.listarProductos();
      res.json(productos);
    } catch (err) {
      responderError(res, err, 'Error al obtener los productos');
    }
  },

  async listarTodos(req, res) {
    try {
      const productos = await productoService.listarTodosLosProductos();
      res.json(productos);
    } catch (err) {
      responderError(res, err, 'Error al obtener los productos');
    }
  },

  async obtenerPorId(req, res) {
    try {
      const producto = await productoService.obtenerProductoPorId(
        req.params.id
      );
      res.json(producto);
    } catch (err) {
      responderError(res, err, 'Error al obtener el producto');
    }
  },

  async crear(req, res) {
    try {
      const producto = await productoService.crearProducto(req.body);
      res.status(201).json(producto);
    } catch (err) {
      responderError(res, err, 'Error al crear el producto');
    }
  },

  async actualizar(req, res) {
    try {
      const producto = await productoService.actualizarProducto(
        req.params.id,
        req.body
      );
      res.json(producto);
    } catch (err) {
      responderError(res, err, 'Error al actualizar el producto');
    }
  },

  async eliminar(req, res) {
    try {
      const { desactivado } = await productoService.eliminarProducto(
        req.params.id
      );
      const mensaje = desactivado
        ? 'El producto tiene pedidos asociados, por lo que fue desactivado y ya no aparece en el catálogo'
        : 'Producto eliminado correctamente';
      res.json({ mensaje, desactivado });
    } catch (err) {
      responderError(res, err, 'Error al eliminar el producto');
    }
  },
};

module.exports = productoController;
