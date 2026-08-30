import { api } from './_lib/handler.js';
import {
  getUser, verifyPassword, hashPassword, passwordProblem,
  createSession, destroySession, destroyAllSessions,
  setSessionCookie, clearSessionCookie,
  currentUser, requireUser, publicUser, saveUser, cleanUsername,
  tooManyAttempts, noteFailure, clearFailures, clientKey, methodNotAllowed,
} from './_lib/auth.js';
import { redis, K, MODULES } from './_lib/redis.js';

/**
 * Alles rund um die Anmeldung – in einer Funktion, weil der Hobby-Tarif
 * höchstens zwölf davon je Deployment zulässt.
 *
 *   GET  /api/auth?do=me
 *   POST /api/auth?do=login     { username, password }
 *   POST /api/auth?do=logout
 *   POST /api/auth?do=password  { current, next }
 */
export default api(async function handler(req, res) {
  const wunsch = String(req.query?.do || 'me');

  /* ------------------------------------------------------------ Wer bin ich */
  if (wunsch === 'me') {
    if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
    const user = await currentUser(req);
    return res.status(200).json({
      user: publicUser(user),
      modules: MODULES,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY || null,
    });
  }

  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  /* ---------------------------------------------------------------- Anmelden */
  if (wunsch === 'login') {
    const username = cleanUsername(req.body?.username);
    const password = String(req.body?.password || '');
    const key = `${clientKey(req)}:${username}`;

    if (!username || !password) {
      return res.status(400).json({ error: 'Benutzername und Passwort werden benötigt.' });
    }
    if (await tooManyAttempts(key)) {
      return res.status(429).json({ error: 'Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.' });
    }

    const user = await getUser(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      await noteFailure(key);
      return res.status(401).json({ error: 'Benutzername oder Passwort ist falsch.' });
    }
    if (user.active === false) {
      return res.status(403).json({ error: 'Dieses Konto ist gesperrt. Bitte beim Host melden.' });
    }

    await clearFailures(key);
    setSessionCookie(res, await createSession(username));
    user.lastLogin = new Date().toISOString();
    await redis.set(K.user(username), user);
    return res.status(200).json({ user: publicUser(user) });
  }

  /* --------------------------------------------------------------- Abmelden */
  if (wunsch === 'logout') {
    const user = await currentUser(req);
    if (user) await destroySession(user.sessionToken);
    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  /* -------------------------------------------------------- Passwort ändern */
  if (wunsch === 'password') {
    const user = await requireUser(req, res);
    if (!user) return;

    if (!verifyPassword(String(req.body?.current || ''), user.passwordHash)) {
      return res.status(401).json({ error: 'Das aktuelle Passwort ist falsch.' });
    }
    const next = String(req.body?.next || '');
    const problem = passwordProblem(next);
    if (problem) return res.status(400).json({ error: problem });

    const { sessionToken, ...record } = user;
    record.passwordHash = hashPassword(next);
    record.mustChangePassword = false;
    record.updatedAt = new Date().toISOString();
    await saveUser(record);

    await destroyAllSessions(record.username);
    setSessionCookie(res, await createSession(record.username));
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: 'Unbekannte Aktion.' });
});
