const CACHE_NAME = 'ida-cours-shell-v4';
const DOCUMENT_CACHE = 'ida-cours-documents-v1';
const STATIC_ASSETS = [
  '/manifest.json',
  '/sdbsnx-logo.png',
  '/unchk-uvs-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];
const MAX_OFFLINE_DOCUMENT_SIZE = 15 * 1024 * 1024;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const response = await fetch('/', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Impossible de charger l’application (${response.status}).`);

    const html = await response.clone().text();
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/', response.clone());
    await cache.put('/index.html', response.clone());
    await cache.addAll(STATIC_ASSETS);

    const appAssets = Array.from(
      html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))(?:\?[^"']*)?["']/g),
      (match) => new URL(match[1], self.location.origin)
    ).filter((url) => url.origin === self.location.origin);
    await cache.addAll(appAssets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith('ida-cours-') && key !== CACHE_NAME && key !== DOCUMENT_CACHE)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('/', response.clone());
          await cache.put('/index.html', response.clone());
        }
        return response;
      } catch {
        const cachedShell = await caches.match('/');
        return cachedShell || new Response('Application indisponible hors connexion.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    const response = await fetch(request);
    if (!response.ok || response.type !== 'basic') return response;

    if (url.pathname.endsWith('.pdf')) {
      const contentLength = Number(response.headers.get('content-length') || 0);
      if (contentLength > 0 && contentLength <= MAX_OFFLINE_DOCUMENT_SIZE) {
        const cache = await caches.open(DOCUMENT_CACHE);
        await cache.put(request, response.clone());
      }
    }

    return response;
  })());
});
