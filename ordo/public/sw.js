/* Ordo service worker — offline shell cache.
 * Navigation & JS chunks are network-first so deploys never leave users on old code. */
const CACHE = "ordo-shell-v20260810";
const ASSETS = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const sameOrigin = req.url.startsWith(self.location.origin);
  // HTML and JS/CSS routes always ask the server first so deploys are instant.
  if (req.mode === "navigate" || req.destination === "script" || req.destination === "style") {
    event.respondWith(fetch(req).then((res) => {
      if (sameOrigin && res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match("/"))));
    return;
  }
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    if (sameOrigin && res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
    return res;
  })));
});
