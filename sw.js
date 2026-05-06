const CACHE_NAME = 'toko-pwa-v5';
const API_CACHE_NAME = 'toko-api-cache-v2';

// File statis yang di-cache saat install
// Path disesuaikan dengan struktur folder di hosting (root-relative)
const urlsToCache = [
  '/app-toko/',
  '/app-toko/index.html',
  '/app-toko/script.js',
  '/app-toko/manifest.json',
  '/app-toko/icon-192x192.png',
  '/app-toko/icon-512x512.png'
];

// URL API yang ingin di-cache responsnya
const API_URL = '/api-toko/get-barang.php';

// 1. TAHAP INSTALL: Simpan file-file statis ke Cache
self.addEventListener('install', event => {
  self.skipWaiting(); // Langsung aktif tanpa menunggu tab lain tertutup
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
  // => Coba ambil data terbaru dari server, jika gagal (offline) pakai cache
  if (url.pathname.includes('get-barang.php')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Berhasil online: simpan respons ke cache API, lalu kembalikan
          const responseClone = networkResponse.clone();
          caches.open(API_CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Gagal (offline): ambil dari cache API terakhir
          console.log('Offline! Menggunakan cache data barang...');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategi CACHE FIRST untuk file statis (HTML, JS, gambar, dll)
  // => Ambil dari cache dulu agar cepat, jika tidak ada baru ke network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});