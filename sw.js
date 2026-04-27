const CACHE_NAME = 'trataflv-v1.2';
const ASSETS = [
  'index.html',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Força a ativação imediata
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim(); // Assume o controle das páginas abertas imediatamente
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Estratégia Stale-While-Revalidate: serve do cache e atualiza em background
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {});

      return response || fetchPromise;
    })
  );
});
