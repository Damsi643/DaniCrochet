const productoRepository = require('../repositories/producto.repository');

const UMBRAL_BAJO_STOCK = 3;

function calcularEstado(stock) {
  if (stock <= 0) return 'Agotado';
  if (stock <= UMBRAL_BAJO_STOCK) return 'Bajo stock';
  return 'Disponible';
}

const inventarioService = {
  async listarInventario() {
    const productos = await productoRepository.findAllAdmin();
    return productos
      .filter((p) => p.activo)
      .map((producto) => {
        const datos = producto.toJSON();
        return {
          id: datos.id,
          nombre: datos.nombre,
          imagen: datos.imagen,
          stock: datos.stock,
          estado: calcularEstado(datos.stock),
        };
      });
  },

  contarBajoStock() {
    return productoRepository.countActivosConStockBajo(UMBRAL_BAJO_STOCK);
  },
};

module.exports = { inventarioService, UMBRAL_BAJO_STOCK };
