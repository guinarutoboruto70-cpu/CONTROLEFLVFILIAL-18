const CACHE_NAME = "controle-flv-v2";

const APP_FILES = [
  "/CONTROLEFLVFILIAL-18/",
  "/CONTROLEFLVFILIAL-18/index.html",
  "/CONTROLEFLVFILIAL-18/manifest.json",
  "/CONTROLEFLVFILIAL-18/icons/icon-192.png",
  "/CONTROLEFLVFILIAL-18/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
