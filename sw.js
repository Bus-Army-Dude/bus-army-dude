const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = 'no-internet.html';
const CACHE_FILES = [
    OFFLINE_URL,
    'no-internet.css',
    'no-internet.js'
];

// Install Service Worker and cache offline page
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FILES);
            })
    );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Show offline page when there's no internet
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.open(CACHE_NAME)
                        .then((cache) => cache.match(OFFLINE_URL));
                })
        );
    }
});
