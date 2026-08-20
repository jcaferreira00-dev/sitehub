var ARQUIVOS = [
  "/pensao-por-morte/index.html",
  "/pensao-por-morte/styles.css",
  "/pensao-por-morte/app.js",
  "/pensao-por-morte/manifest.json",
  "/pensao-por-morte/icons/icon-192.png",
  "/pensao-por-morte/icons/icon-512.png"
];

var CACHE = "pensao-por-morte-v1";

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
