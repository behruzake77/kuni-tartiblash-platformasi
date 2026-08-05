/* Ordo service worker — offline shell cache.
 * Navigation is network-first so deploys never leave users on an old app shell. */
const CACHE = "ordo-shell-v20260805";
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
  // HTML/app routes must always ask the server first so fresh translations and UI deploy immediately.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then((res) => res).catch(() => caches.match(req).then((cached) => cached || caches.match("/"))));
    return;
  }
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    if (sameOrigin && res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
    return res;
  })));
});
