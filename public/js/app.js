const API_BASE = '/api';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js').catch(() => {});
  });
}

function formatearPrecio(valor) {
  const numero = Number(valor) || 0;
  return '$' + numero.toLocaleString('es-CO', { minimumFractionDigits: 0 });
}

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('dani-carrito')) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem('dani-carrito', JSON.stringify(items));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(producto, cantidad = 1) {
  const items = obtenerCarrito();
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      imagen: producto.imagen,
      cantidad,
    });
  }
  guardarCarrito(items);
}

function eliminarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter((i) => i.id !== id));
}

function actualizarCantidad(id, cantidad) {
  const items = obtenerCarrito();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.cantidad = Math.max(1, Number(cantidad) || 1);
  guardarCarrito(items);
}

function vaciarCarrito() {
  localStorage.removeItem('dani-carrito');
  actualizarBadgeCarrito();
}

function totalCarrito() {
  return obtenerCarrito().reduce(
    (suma, i) => suma + i.precio * i.cantidad,
    0
  );
}

function actualizarBadgeCarrito() {
  const badge = document.querySelector('[data-badge-carrito]');
  if (!badge) return;
  const unidades = obtenerCarrito().reduce((s, i) => s + i.cantidad, 0);
  badge.textContent = unidades;
  badge.style.display = unidades > 0 ? 'inline' : 'none';
}

async function fetchJSON(url, opciones = {}) {
  const headers = opciones.body instanceof FormData
    ? {}
    : { 'Content-Type': 'application/json' };
  const res = await fetch(url, {
    headers,
    ...opciones,
  });
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(datos.error || `Error ${res.status}`);
  }
  return datos;
}

document.addEventListener('DOMContentLoaded', actualizarBadgeCarrito);
