const CACHE_NAME = 'energetic-stocktake-final';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});