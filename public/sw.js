// Service Worker for Dutt QR Menu - Offline & Basement resilience
const CACHE_NAME = "dutt-qr-cache-v1";

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

  // Do NOT cache admin routes or mutations
  if (
    url.pathname.startsWith("/api/admin") ||
    url.pathname.startsWith("/management-portal-secure") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Network-first with cache fallback for customer views and APIs
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
        return new Response(JSON.stringify({ offline: true, message: "Çevrimdışı Mod" }), {
          headers: { "Content-Type": "application/json" },
        });
      })
  );
});
