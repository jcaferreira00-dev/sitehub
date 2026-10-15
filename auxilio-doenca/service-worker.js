var ARQUIVOS = [
  "/auxilio-doenca/index.html",
  "/auxilio-doenca/styles.css",
  "/auxilio-doenca/app.js",
  "/auxilio-doenca/manifest.json",
  "/auxilio-doenca/icons/icon-192.png",
  "/auxilio-doenca/icons/icon-512.png"
];

var CACHE = "auxilio-doenca-v2";

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ARQUIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k.indexOf("auxilio-doenca-v") === 0 && k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // rede primeiro: o conteúdo atualizado aparece na hora; o cache só é usado offline
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function(resp) {
      if (resp && resp.ok && new URL(e.request.url).origin === location.origin) {
        var copia = resp.clone();
        caches.open(CACHE).then(function(cache) { cache.put(e.request, copia); });
      }
      return resp;
    }).catch(function() { return caches.match(e.request); })
  );
});
