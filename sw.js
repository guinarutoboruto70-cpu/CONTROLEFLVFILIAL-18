const CACHE_NAME = 'trataflv-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]).catch(err => console.log("Erro de cache inicial:", err));
    })
  );
  self.skipWaiting(); // Força o novo Service Worker a assumir o controle na hora
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Assume o controle das páginas abertas imediatamente
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
