require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  Producto,
  Usuario,
  Cliente,
  Pedido,
  PedidoDetalle,
  Pago,
} = require('../src/models');

const productos = [
  {
    nombre: 'Amigurumi conejo',
    descripcion:
      'Conejo tejido a crochet con hilo algodón, relleno de fibra antialérgica. Aproximadamente 20 cm.',
    precio: 45000,
    imagen: '/img/placeholder.svg',
    stock: 5,
  },
  {
    nombre: 'Amigurumi osito',
    descripcion:
      'Osito de peluche tejido a mano, ideal para regalo. Colores personalizables.',
    precio: 42000,
    imagen: '/img/placeholder.svg',
    stock: 8,
  },
  {
    nombre: 'Bolso bandolera tejido',
    descripcion:
      'Bolso artesanal en hilo grueso, con correa ajustable y forro interior.',
    precio: 85000,
    imagen: '/img/placeholder.svg',
    stock: 3,
  },
  {
    nombre: 'Gorrito con orejitas',
    descripcion:
      'Gorro tejido a crochet con orejas de gatito. Tallas para bebé y adulto.',
    precio: 30000,
    imagen: '/img/placeholder.svg',
    stock: 10,
  },
  {
    nombre: 'Canasta organizadora',
    descripcion:
      'Canasta rígida tejida con hilo camiseta, perfecta para organizar.',
    precio: 38000,
    imagen: '/img/placeholder.svg',
    stock: 6,
  },
  {
    nombre: 'Llavero corazón',
    descripcion:
      'Llavero pequeño tejido en forma de corazón, ideal para regalos.',
    precio: 12000,
    imagen: '/img/placeholder.svg',
    stock: 15,
  },
];

const clientesDemo = [
  { nombre: 'María Gómez', correo: 'maria.gomez@example.com', telefono: '3001112233' },
  { nombre: 'Laura Restrepo', correo: 'laura.restrepo@example.com', telefono: '3012223344' },
  { nombre: 'Carolina Ruiz', correo: 'carolina.ruiz@example.com', telefono: '3023334455' },
];

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    if ((await Usuario.count()) === 0) {
      await Usuario.create({
        nombre: 'Daniela',
        correo: 'dani@danicrochet.com',
        passwordHash: bcrypt.hashSync('crochet123', 10),
      });
      console.log('Administradora creada: dani@danicrochet.com / crochet123');
    }

    if ((await Producto.count()) === 0) {
      await Producto.bulkCreate(productos);
      console.log(`${productos.length} productos insertados correctamente.`);
    } else {
      console.log(`La tabla productos ya tiene ${await Producto.count()} registros. No se insertó nada.`);
    }

    if ((await Cliente.count()) === 0) {
      const clientes = await Cliente.bulkCreate(clientesDemo);

      const lista = await Producto.findAll({ order: [['id', 'ASC']] });
      if (lista.length >= 3) {
        const [conejo, osito, bolso, gorrito] = lista;

        await crearPedidoDemo(clientes[0], [ { producto: conejo, cantidad: 2 }, { producto: gorrito, cantidad: 1 } ], 'Pendiente', 'Pendiente');
        await crearPedidoDemo(clientes[1], [ { producto: bolso, cantidad: 1 } ], 'Confirmado', 'Pendiente');
        await crearPedidoDemo(clientes[2], [ { producto: osito, cantidad: 2 }, { producto: gorrito, cantidad: 3 } ], 'Entregado', 'Confirmado');

        console.log('Clientes y pedidos de demostración creados.');
      }
    }

    console.log('Seed finalizado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error ejecutando el seed:', err.message);
    process.exit(1);
  }
})();

async function crearPedidoDemo(cliente, lineas, estadoPedido, estadoPago) {
  let total = 0;

  for (const linea of lineas) {
    total += Number(linea.producto.precio) * linea.cantidad;
  }

  const pedido = await Pedido.create({
    clienteId: cliente.id,
    total,
    estado: estadoPedido,
  });

  for (const linea of lineas) {
    await PedidoDetalle.create({
      pedidoId: pedido.id,
      productoId: linea.producto.id,
      nombreProducto: linea.producto.nombre,
      precioUnitario: linea.producto.precio,
      cantidad: linea.cantidad,
      subtotal: Number(linea.producto.precio) * linea.cantidad,
    });
  }

  await Pago.create({
    pedidoId: pedido.id,
    monto: total,
    estado: estadoPago,
  });

  const descuentaStock = ['Confirmado', 'En preparación', 'Entregado'].includes(
    estadoPedido
  );
  if (descuentaStock) {
    for (const linea of lineas) {
      await linea.producto.update({
        stock: linea.producto.stock - linea.cantidad,
      });
    }
  }

  return pedido;
}
