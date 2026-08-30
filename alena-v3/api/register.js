import { api } from './_lib/handler.js';
import crypto from 'node:crypto';
import { clientKey, methodNotAllowed } from './_lib/auth.js';
import { redis, K } from './_lib/redis.js';

const MAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Öffentliches Registrierungsformular. Der Antrag landet im Host-Bereich. */
export default api(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const name = String(req.body?.name || '').trim().slice(0, 120);
  const email = String(req.body?.email || '').trim().slice(0, 160);
  const note = String(req.body?.note || '').trim().slice(0, 600);

  if (name.length < 3) return res.status(400).json({ error: 'Bitte den vollständigen Namen angeben.' });
  if (!MAIL.test(email)) return res.status(400).json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' });

  // Höchstens 3 Anträge pro Stunde und IP.
  const ip = clientKey(req);
  const n = await redis.incr(K.requestLimit(ip));
  if (n === 1) await redis.expire(K.requestLimit(ip), 3600);
  if (n > 3) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
  }

  const id = crypto.randomBytes(8).toString('hex');
  await redis.hset(K.requests, {
    [id]: { id, name, email, note, status: 'neu', createdAt: new Date().toISOString() },
  });

  return res.status(201).json({ ok: true });
});
