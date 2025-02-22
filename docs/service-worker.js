/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-e1c7a91';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./brute-neighbors.html","./colophon.html","./baker-farm.html","./economy.html","./conclusion.html","./favicon.png","./former-inhabitants-and-winter-visitors.html","./higher-laws.html","./house-warming.html","./index.html","./manifest.json","./reading.html","./solitude.html","./sounds.html","./spring.html","./the-bean-field.html","./the-pond-in-winter.html","./the-village.html","./the-ponds.html","./visitors.html","./where-i-lived-and-what-i-lived-for.html","./winter-animals.html","./fonts/PT Free Font License_eng_1.2.txt","./fonts/PTSerif-BoldItalic.woff2","./fonts/PTSerif-Bold.woff2","./fonts/PTSerif-Italic.woff2","./fonts/PTSerif-Regular.woff2","./fonts/leaguespartan-bold.woff2","./images/cover.jpg","./images/logo.svg","./images/paper.png","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
