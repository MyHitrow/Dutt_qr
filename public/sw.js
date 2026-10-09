// Service Worker for Dutt QR Menu - Offline & Basement resilience
const CACHE_NAME = "dutt-qr-cache-v2";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // [UX-002 / PERF-002] Do NOT intercept or cache API endpoints, admin routes, or non-GET requests.
  // Data caching is handled reliably by client-side LocalStorage in MenuContext.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/management-portal-secure") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Network-first with cache fallback for static customer views/assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback to cache when offline / no internet connection in basements
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If navigating to root, return cached root
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
        return new Response("Çevrimdışı Mod", { status: 503 });
      })
  );
});
