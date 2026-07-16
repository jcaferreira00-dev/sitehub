var ARQUIVOS = [
  "/tarifa-social-energia/index.html",
  "/tarifa-social-energia/styles.css",
  "/tarifa-social-energia/app.js",
  "/tarifa-social-energia/manifest.json",
  "/tarifa-social-energia/icons/icon-192.png",
  "/tarifa-social-energia/icons/icon-512.png"
];

var CACHE = "tarifa-social-energia-v1";

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
