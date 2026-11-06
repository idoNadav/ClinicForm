var CACHE_NAME = 'bikoret-v3'
var ASSETS = [
  './',
  './ביקורת-מרפאה.html',
  './logo.png',
  'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js',
  'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js'
]

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME })
          .map(function (n) { return caches.delete(n) })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (res) {
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, res.clone())
          return res
        })
      })
    }).catch(function () {
      return caches.match('./ביקורת-מרפאה.html')
    })
  )
})
