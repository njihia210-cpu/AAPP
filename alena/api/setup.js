import { hashPassword, passwordProblem, saveUser, cleanUsername, methodNotAllowed } from './_lib/auth.js';
import { redis, K, DEFAULT_MODULES } from './_lib/redis.js';

/**
 * Einmaliges Anlegen des ersten Host-Kontos.
 * Funktioniert nur, solange noch kein Benutzer existiert, und nur mit SETUP_TOKEN.
 *
 *   curl -X POST https://<domain>/api/setup \
 *     -H "content-type: application/json" \
 *     -d '{"token":"<SETUP_TOKEN>","username":"host","password":"<langes-passwort>"}'
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const count = await redis.scard(K.users);
    return res.status(200).json({ initialised: Number(count || 0) > 0 });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const expected = process.env.SETUP_TOKEN;
  if (!expected) return res.status(403).json({ error: 'SETUP_TOKEN ist nicht gesetzt.' });
  if (String(req.body?.token || '') !== expected) {
    return res.status(403).json({ error: 'Ungültiges Setup-Token.' });
  }

  const count = await redis.scard(K.users);
  if (Number(count || 0) > 0) {
    return res.status(409).json({ error: 'Es existiert bereits ein Konto. Setup ist abgeschlossen.' });
  }

  const username = cleanUsername(req.body?.username) || 'host';
  const password = String(req.body?.password || '');
  const problem = passwordProblem(password);
  if (problem) return res.status(400).json({ error: problem });

  await saveUser({
    username,
    name: String(req.body?.name || 'Host').slice(0, 80),
    role: 'host',
    active: true,
    modules: { ...DEFAULT_MODULES },
    passwordHash: hashPassword(password),
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    createdBy: 'setup',
  });

  return res.status(201).json({ ok: true, username });
}
