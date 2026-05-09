const CACHE_NAME = 'toko-pwa-v8';
const API_CACHE_NAME = 'toko-api-cache-v4';

// File statis yang di-cache saat install
// Path relatif terhadap lokasi sw.js (app-toko/)
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './manifest.php',
  './icon-192x192.png',
  './icon-512x512.png'
];

// URL API yang ingin di-cache responsnya
const API_URL = '../api-toko/get-barang.php';

// 1. TAHAP INSTALL: Simpan file-file statis ke Cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache statis...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. TAHAP ACTIVATE: Hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== API_CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. TAHAP FETCH: Strategi berbeda untuk API vs file statis
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Strategi NETWORK FIRST untuk API data barang
  if (url.pathname.includes('get-barang.php')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(API_CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          console.log('Offline! Menggunakan cache data barang...');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategi CACHE FIRST untuk file statis
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});
