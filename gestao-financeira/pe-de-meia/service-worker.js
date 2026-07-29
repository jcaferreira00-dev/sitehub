var ARQUIVOS = [
  "/pe-de-meia/index.html",
  "/pe-de-meia/styles.css",
  "/pe-de-meia/app.js",
  "/pe-de-meia/manifest.json",
  "/pe-de-meia/icons/icon-192.png",
  "/pe-de-meia/icons/icon-512.png"
];

var CACHE = "pe-de-meia-v1";

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
