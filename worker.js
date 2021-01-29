'use strict';

var cacheVersion = 1;
var currentCache = {
    offline: 'offline-cache' + cacheVersion
};

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(currentCache.offline).then(function(cache) {
            return cache.addAll([
                "index.html",
                "assets/css/main.css",
                "assets/js/main.js",
                "favicons/android-chrome-192x192.png",
                "favicons/android-chrome-512x512.png",
                "favicons/apple-touch-icon.png",
                "favicons/favicon-16x16.png",
                "favicons/favicon-32x32.png",
                "favicons/favicon-194x194.png",
                "favicons/favicon.ico",
                "favicons/mstile-150x150.png",
                "favicons/safari-pinned-tab.svg",
                "site.webmanifest",
                "browserconfig.xml",
            ]);
        })
    );
});

this.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                return caches.match("offline.html");
            })
        );
    } else {
        event.respondWith(caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});