const { SequelizeValidationError } = require('sequelize');
const productoRepository = require('../repositories/producto.repository');

class ValidacionError extends Error {
  constructor(detalles) {
    super(Array.isArray(detalles) ? detalles.join(' | ') : detalles);
    this.name = 'ValidacionError';
    this.detalles = detalles;
  }
}

class ProductoNoEncontradoError extends Error {
  constructor(message = 'Producto no encontrado') {
    super(message);
    this.name = 'ProductoNoEncontradoError';
  }
}

const CAMPOS_PERMITIDOS = ['nombre', 'descripcion', 'precio', 'imagen', 'stock'];

function filtrarCampos(datos) {
  const datosFiltrados = {};
  for (const campo of CAMPOS_PERMITIDOS) {
    if (datos[campo] !== undefined) {
      datosFiltrados[campo] = datos[campo];
    }
  }
  return datosFiltrados;
}

function validarCamposObligatorios(datos) {
  if (!datos.nombre || datos.precio === undefined || datos.precio === null) {
    throw new ValidacionError(
      'Los campos nombre y precio son obligatorios'
    );
  }
}

function validarId(id) {
  const idNumerico = Number(id);
  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    throw new ProductoNoEncontradoError();
  }
}

function traducirErrorValidacion(err) {
  if (err instanceof SequelizeValidationError) {
    throw new ValidacionError(err.errors.map((e) => e.message));
  }
  throw err;
}

const productoService = {
  listarProductos() {
    return productoRepository.findAll();
  },

  listarTodosLosProductos() {
    return productoRepository.findAllAdmin();
  },

  async obtenerProductoPorId(id) {
    validarId(id);
    const producto = await productoRepository.findById(id);
    if (!producto) {
      throw new ProductoNoEncontradoError();
    }
    return producto;
  },

  async crearProducto(datos) {
    validarCamposObligatorios(datos);
    try {
      return await productoRepository.create(filtrarCampos(datos));
    } catch (err) {
      traducirErrorValidacion(err);
    }
  },

  async actualizarProducto(id, datos) {
    validarId(id);
    try {
      const producto = await productoRepository.update(id, filtrarCampos(datos));
      if (!producto) {
        throw new ProductoNoEncontradoError();
      }
      return producto;
    } catch (err) {
      traducirErrorValidacion(err);
    }
  },

  async eliminarProducto(id) {
    validarId(id);
    const resultado = await productoRepository.remove(id);
    if (!resultado) {
      throw new ProductoNoEncontradoError();
    }
    return resultado;
  },
};

productoService.ValidacionError = ValidacionError;
productoService.ProductoNoEncontradoError = ProductoNoEncontradoError;

module.exports = productoService;
