// Service worker simples: cacheia o essencial pra funcionar offline
// e pra passar no requisito de "instalável" do Play Store (TWA).
var CACHE_NAME = "abono2026-v1";
var ARQUIVOS = [
  "/abono/index.html",
  "/abono/styles.css",
  "/abono/app.js",
  "/abono/manifest.json",
  "/abono/icons/icon-192.png",
  "/abono/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes
          .filter(function (nome) { return nome !== CACHE_NAME; })
          .map(function (nome) { return caches.delete(nome); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
