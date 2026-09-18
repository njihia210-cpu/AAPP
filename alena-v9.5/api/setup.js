import { api } from './_lib/handler.js';
import {
  hashPassword, passwordProblem, saveUser, getUser, cleanUsername,
  destroyAllSessions, clientKey, methodNotAllowed,
} from './_lib/auth.js';
import { redis, K, DEFAULT_MODULES } from './_lib/redis.js';

/**
 * Ersteinrichtung und Notausgang – beides nur mit SETUP_TOKEN.
 *
 *   GET  /api/setup              besteht schon ein Konto?
 *   POST /api/setup              erstes Host-Konto anlegen (nur wenn keines besteht)
 *   POST /api/setup?do=reset     Passwort eines Kontos zurücksetzen
 */
export default api(async function handler(req, res) {
  if (req.method === 'GET') {
    const count = await redis.scard(K.users);
    return res.status(200).json({ initialised: Number(count || 0) > 0 });
  }
  if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const expected = process.env.SETUP_TOKEN;
  if (!expected) {
    return res.status(403).json({
      error: 'SETUP_TOKEN ist nicht gesetzt. In Vercel eintragen und neu deployen.',
    });
  }

  /* Höchstens zehn Versuche pro Stunde und IP-Adresse. */
  const bremse = `alena:setupfails:${clientKey(req)}`;
  const versuche = Number((await redis.get(bremse)) || 0);
  if (versuche >= 10) {
    return res.status(429).json({ error: 'Zu viele Versuche. Bitte in einer Stunde erneut.' });
  }

  if (String(req.body?.token || '') !== expected) {
    const n = await redis.incr(bremse);
    if (n === 1) await redis.expire(bremse, 3600);
    return res.status(403).json({ error: 'Ungültiges Setup-Token.' });
  }
  await redis.del(bremse);

  const username = cleanUsername(req.body?.username) || 'host';
  const password = String(req.body?.password || '');
  const problem = passwordProblem(password);
  if (problem) return res.status(400).json({ error: problem });

  /* ------------------------------------------------------------ Notausgang */
  if (String(req.query?.do || '') === 'reset') {
    const user = await getUser(username);
    if (!user) {
      const alle = (await redis.smembers(K.users)) || [];
      return res.status(404).json({
        error: alle.length
          ? `Kein Konto „${username}“. Vorhanden: ${alle.join(', ')}.`
          : 'Es besteht noch kein Konto. Bitte zuerst die Ersteinrichtung durchlaufen.',
      });
    }
    user.passwordHash = hashPassword(password);
    user.role = 'host';
    user.active = true;
    user.mustChangePassword = false;
    user.updatedAt = new Date().toISOString();
    await saveUser(user);
    await destroyAllSessions(username);
    return res.status(200).json({ ok: true, username });
  }

  /* -------------------------------------------------------- Ersteinrichtung */
  const count = await redis.scard(K.users);
  if (Number(count || 0) > 0) {
    return res.status(409).json({
      error: 'Es existiert bereits ein Konto. Zum Zurücksetzen des Passworts „Zugang zurücksetzen“ verwenden.',
    });
  }

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
});
