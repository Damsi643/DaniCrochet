const CACHE_NAME = 'dani-crochet-v2';
const ASSETS_INICIALES = [
  '/',
  '/catalogo',
  '/css/styles.css',
  '/js/app.js',
  '/img/placeholder.svg',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/manifest.json',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_INICIALES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves
            .filter((clave) => clave !== CACHE_NAME)
            .map((clave) => caches.delete(clave))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/admin')) return;

  evento.respondWith(
    caches.match(request).then((cacheado) => {
      if (cacheado) return cacheado;
      return fetch(request)
        .then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
        .catch(() => caches.match('/'));
    })
  );
});
