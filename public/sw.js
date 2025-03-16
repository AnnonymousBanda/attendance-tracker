const staticCacheName = 'site-static-v1'
const dynamicCacheName = 'site-dynamic-v1'
const assets = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/favicon.ico',
    '/images/logo-16x16.png',
    '/images/logo-32x32.png',
    '/images/logo-48x48.png',
    '/images/logo-64x64.png',
    '/images/logo-120x120.png',
    '/images/logo-152x152.png',
    '/images/logo-167x167.png',
    '/images/logo-180x180.png',
    '/images/logo-192x192.png',
    '/images/logo-256x256.png',
    '/images/logo-384x384.png',
    '/images/logo-512x512.png',
    '/images/logo-1024x1024.png',
    '/images/screenshot-desktop.png',
    '/images/screenshot-mobile.png',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter(
                        (key) =>
                            key !== staticCacheName && key !== dynamicCacheName
                    )
                    .map((key) => caches.delete(key))
            )
        })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheRes) => {
            return (
                cacheRes ||
                fetch(event.request).then((fetchRes) => {
                    return caches.open(dynamicCacheName).then((cache) => {
                        cache.put(event.request.url, fetchRes.clone())
                        return fetchRes
                    })
                })
            )
        })
    )
})
