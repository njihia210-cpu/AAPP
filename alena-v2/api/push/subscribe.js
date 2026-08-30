import { api } from '../_lib/handler.js';
import crypto from 'node:crypto';
import { requireUser, methodNotAllowed } from '../_lib/auth.js';
import { redis, K } from '../_lib/redis.js';

const idOf = (endpoint) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 24);

export default api(async function handler(req, res) {
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
    const endpoint = String(req.body?.endpoint || '');
    if (!endpoint) return res.status(400).json({ error: 'Endpoint fehlt.' });
    await redis.hdel(K.subs(user.username), idOf(endpoint));
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['POST', 'DELETE']);
});
