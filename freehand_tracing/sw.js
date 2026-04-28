const CACHE_PREFIX = "letterpaths-freehand-tracing-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const APP_SHELL_PATHS = [
  "./",
  "./manifest.webmanifest",
  "./pwa-192x192.png",
  "./pwa-512x512.png",
  "./apple-touch-icon.png"
];

const toAbsoluteUrl = (relativePath) => new URL(relativePath, self.registration.scope).toString();

const cacheResponse = async (request, response) => {
  if (!response.ok || response.type === "opaque") {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_PATHS.map(toAbsoluteUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  if (
    request.method !== "GET" ||
    requestUrl.origin !== scopeUrl.origin ||
    !requestUrl.pathname.startsWith(scopeUrl.pathname)
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(toAbsoluteUrl("./"));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => cachedResponse);

      return cachedResponse ?? networkResponse;
    })
  );
});
