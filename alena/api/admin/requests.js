import { requireHost, methodNotAllowed } from '../_lib/auth.js';
import { redis, K } from '../_lib/redis.js';

/** Registrierungsanträge lesen, als erledigt markieren oder löschen. */
export default async function handler(req, res) {
  const host = await requireHost(req, res);
  if (!host) return;

  if (req.method === 'GET') {
    const map = (await redis.hgetall(K.requests)) || {};
    const requests = Object.values(map).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return res.status(200).json({ requests });
  }

  if (req.method === 'PATCH') {
    const id = String(req.body?.id || '');
    const map = (await redis.hgetall(K.requests)) || {};
    const item = map[id];
    if (!item) return res.status(404).json({ error: 'Antrag nicht gefunden.' });
    item.status = req.body?.status === 'neu' ? 'neu' : 'erledigt';
    item.handledAt = new Date().toISOString();
    item.handledBy = host.username;
    await redis.hset(K.requests, { [id]: item });
    return res.status(200).json({ request: item });
  }

  if (req.method === 'DELETE') {
    const id = String(req.query?.id || req.body?.id || '');
    if (!id) return res.status(400).json({ error: 'Kennung fehlt.' });
    await redis.hdel(K.requests, id);
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
}
