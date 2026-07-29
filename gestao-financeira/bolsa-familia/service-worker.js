var ARQUIVOS = [
  "/bolsa-familia/index.html",
  "/bolsa-familia/styles.css",
  "/bolsa-familia/app.js",
  "/bolsa-familia/manifest.json",
  "/bolsa-familia/icons/icon-192.png",
  "/bolsa-familia/icons/icon-512.png"
];

var CACHE = "bolsa-familia-v1";

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ARQUIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) { return cached || fetch(e.request); })
  );
});
