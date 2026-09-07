/* Alena – Service Worker
   Aufgaben: App-Verhalten (Offline-Fallback) und Push-Mitteilungen. */

const CACHE = 'alena-v5';
const SHELL = [
  '/', '/app', '/styles.css', '/theme.js', '/ambient.js', '/push-client.js',
  '/icons/logo.png', '/icons/icon-192.png', '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Netz zuerst, Cache als Rückfall. API-Aufrufe nie aus dem Cache. */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request).then((hit) => hit || caches.match('/')))
  );
});

/* ------------------------------------------------- Abo erneuern lassen */
const b64ToUint8 = (base64) => {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

/**
 * Browser tauschen Push-Abos von sich aus aus – abgelaufen, erneuert, gewechselt.
 * Ohne diese Behandlung bleibt beim Server das alte Abo stehen und es kommt
 * still nichts mehr an. Also: neu abonnieren und dem Server Bescheid geben.
 */
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    try {
      let key = event.oldSubscription?.options?.applicationServerKey;
      if (!key) {
        const res = await fetch('/api/status', { credentials: 'include' });
        const daten = await res.json();
        if (!daten?.vapidPublicKey) return;
        key = b64ToUint8(daten.vapidPublicKey);
      }
      const sub = event.newSubscription || await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      });
      await fetch('/api/push?do=subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), label: 'erneuert' }),
      });
    } catch { /* beim nächsten Öffnen der App wird ohnehin aufgefrischt */ }
  })());
});

/* -------------------------------------------------------------- Push */
self.addEventListener('push', (event) => {
  let data = { title: 'Alena', body: '', url: '/app', tag: 'alena' };
  try { if (event.data) data = { ...data, ...event.data.json() }; }
  catch { if (event.data) data.body = event.data.text(); }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag,
      renotify: true,
      requireInteraction: Boolean(data.question),
      // Knöpfe in der Mitteilung. iOS zeigt sie nicht – dort führt der Tipp
      // in die App, wo dieselbe Frage als Karte erscheint.
      actions: Array.isArray(data.actions) ? data.actions.slice(0, 2) : [],
      data: { url: data.url, question: data.question || null },
    })
  );
});

/** Antwort aus der Mitteilung heraus speichern. */
async function beantworte(frage, antwort) {
  try {
    const res = await fetch('/api/cycle?do=quick', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ frage, antwort }),
    });
    if (!res.ok) throw new Error('abgelehnt');
    // Offene Fenster auffrischen, damit die Karte verschwindet.
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of clients) c.postMessage({ typ: 'zyklus-aktualisiert' });
    return true;
  } catch {
    return false;
  }
}

self.addEventListener('notificationclick', (event) => {
  const { url = '/app', question } = event.notification.data || {};
  const aktion = event.action;
  event.notification.close();

  event.waitUntil((async () => {
    if (question && (aktion === 'ja' || aktion === 'nein' || aktion === 'spaeter')) {
      const ok = await beantworte(question, aktion === 'ja' ? 'ja' : aktion);
      if (ok) {
        if (aktion !== 'spaeter') {
          await self.registration.showNotification('Alena', {
            body: aktion === 'ja' ? 'Notiert – danke.' : 'Alles klar, ich frage morgen nochmals.',
            icon: '/icons/icon-192.png',
            tag: 'alena-quittung',
          });
        }
        return;
      }
      // Klappt es nicht (etwa weil die Anmeldung abgelaufen ist), Seite öffnen.
    }

    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of list) {
      if (client.url.startsWith(self.location.origin) && 'focus' in client) {
        if ('navigate' in client) await client.navigate(url);
        return client.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
