import { api } from '../_lib/handler.js';
import webpush from 'web-push';
import { currentUser, cleanUsername, methodNotAllowed } from '../_lib/auth.js';
import { redis, K } from '../_lib/redis.js';

function configured() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:amplifyxswiss@gmail.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  return true;
}

/** Nachricht an alle Geräte eines Benutzers senden. Entfernt abgelaufene Abos. */
export async function sendToUser(username, payload) {
  if (!configured()) throw new Error('VAPID-Schlüssel fehlen.');
  const map = (await redis.hgetall(K.subs(username))) || {};
  const body = JSON.stringify(payload);
  let sent = 0;
  const dead = [];

  await Promise.all(
    Object.entries(map).map(async ([id, sub]) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          body,
          { TTL: 3600, urgency: 'high' }
        );
        sent += 1;
      } catch (err) {
        if (err?.statusCode === 404 || err?.statusCode === 410) dead.push(id);
      }
    })
  );

  if (dead.length) await redis.hdel(K.subs(username), ...dead);
  return { sent, removed: dead.length };
}

export default api(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const secret = process.env.CRON_SECRET;
  const authed = secret && req.headers.authorization === `Bearer ${secret}`;
  const user = authed ? null : await currentUser(req);

  if (!authed && !user) return res.status(401).json({ error: 'Nicht angemeldet.' });

  // Ohne Host-Rolle darf nur an das eigene Konto gesendet werden.
  let target = cleanUsername(req.body?.username) || user?.username;
  if (!authed && user.role !== 'host') target = user.username;
  if (!target) return res.status(400).json({ error: 'Empfänger fehlt.' });

  const payload = {
    title: String(req.body?.title || 'Alena').slice(0, 100),
    body: String(req.body?.body || '').slice(0, 400),
    url: String(req.body?.url || '/app'),
    tag: String(req.body?.tag || 'alena'),
  };

  try {
    const result = await sendToUser(target, payload);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Senden fehlgeschlagen.' });
  }
});
