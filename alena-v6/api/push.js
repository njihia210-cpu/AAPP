import crypto from 'node:crypto';
import { api } from './_lib/handler.js';
import { requireUser, currentUser, cleanUsername, methodNotAllowed } from './_lib/auth.js';
import { redis, K } from './_lib/redis.js';
import { sendToUser } from './_lib/push.js';

const idOf = (endpoint) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 24);

/**
 *   POST   /api/push?do=subscribe  { subscription, label }
 *   DELETE /api/push?do=subscribe  { endpoint }
 *   POST   /api/push?do=send       { title, body, url, username? }
 */
export default api(async function handler(req, res) {
  const wunsch = String(req.query?.do || 'subscribe');

  /* ------------------------------------------------------------- Anmelden */
  if (wunsch === 'subscribe') {
    const user = await requireUser(req, res);
    if (!user) return;

    if (req.method === 'POST') {
      const sub = req.body?.subscription;
      if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
        return res.status(400).json({ error: 'Ungültiges Push-Abonnement.' });
      }
      await redis.hset(K.subs(user.username), {
        [idOf(sub.endpoint)]: {
          endpoint: sub.endpoint,
          keys: sub.keys,
          label: String(req.body?.label || 'Gerät').slice(0, 60),
          addedAt: new Date().toISOString(),
        },
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const endpoint = String(req.body?.endpoint || req.query?.endpoint || '');
      if (!endpoint) return res.status(400).json({ error: 'Endpoint fehlt.' });
      await redis.hdel(K.subs(user.username), idOf(endpoint));
      return res.status(200).json({ ok: true });
    }

    return methodNotAllowed(res, ['POST', 'DELETE']);
  }

  /* --------------------------------------------------------------- Senden */
  if (wunsch === 'send') {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

    const secret = process.env.CRON_SECRET;
    const authed = secret && req.headers.authorization === `Bearer ${secret}`;
    const user = authed ? null : await currentUser(req);
    if (!authed && !user) return res.status(401).json({ error: 'Nicht angemeldet.' });

    // Ohne Host-Rolle darf nur an das eigene Konto gesendet werden.
    let target = cleanUsername(req.body?.username) || user?.username;
    if (!authed && user.role !== 'host') target = user.username;
    if (!target) return res.status(400).json({ error: 'Empfänger fehlt.' });

    try {
      const result = await sendToUser(target, {
        title: String(req.body?.title || 'Alena').slice(0, 100),
        body: String(req.body?.body || '').slice(0, 400),
        url: String(req.body?.url || '/app'),
        tag: String(req.body?.tag || 'alena'),
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Senden fehlgeschlagen.' });
    }
  }

  return res.status(400).json({ error: 'Unbekannte Aktion.' });
});
