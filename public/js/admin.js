const CLASES_ESTADO = {
  Pendiente: 'amarillo',
  Confirmado: 'verde',
  'En preparación': 'rosa',
  Entregado: 'lila',
  Cancelado: 'rojo',
  Rechazado: 'rojo',
  Disponible: 'verde',
  'Bajo stock': 'amarillo',
  Agotado: 'rojo',
};

function badgeEstado(estado) {
  const clase = CLASES_ESTADO[estado] || 'gris';
  return `<span class="badge badge-${clase}">${estado}</span>`;
}

function formatearFecha(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function abrirModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

async function cerrarSesion() {
  try {
    await fetchJSON('/api/auth/logout', { method: 'POST' });
  } catch {}
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  fetchJSON('/api/auth/session').catch(() => {
    window.location.href = '/login';
  });

  const btnSalir = document.getElementById('btn-salir');
  if (btnSalir) {
    btnSalir.addEventListener('click', cerrarSesion);
  }

  document.querySelectorAll('[data-cerrar-modal]').forEach((icono) => {
    icono.addEventListener('click', () => {
      cerrarModal(icono.dataset.cerrarModal);
    });
  });
});
