import webpush from 'web-push';
import { redis, K } from './redis.js';

/** Sind die VAPID-Schlüssel gesetzt? Richtet die Bibliothek gleich mit ein. */
export function pushBereit() {
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
  if (!pushBereit()) throw new Error('VAPID-Schlüssel fehlen.');
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
