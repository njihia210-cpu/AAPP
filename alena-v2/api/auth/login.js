import { api } from '../_lib/handler.js';
import {
  getUser, verifyPassword, createSession, setSessionCookie, publicUser,
  cleanUsername, tooManyAttempts, noteFailure, clearFailures, clientKey, methodNotAllowed,
} from '../_lib/auth.js';
import { redis, K } from '../_lib/redis.js';

export default api(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const username = cleanUsername(req.body?.username);
  const password = String(req.body?.password || '');
  const key = `${clientKey(req)}:${username}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort werden benötigt.' });
  }

  if (await tooManyAttempts(key)) {
    return res.status(429).json({
      error: 'Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.',
    });
  }

  const user = await getUser(username);
  const ok = user && verifyPassword(password, user.passwordHash);

  if (!ok) {
    await noteFailure(key);
    return res.status(401).json({ error: 'Benutzername oder Passwort ist falsch.' });
  }

  if (user.active === false) {
    return res.status(403).json({ error: 'Dieses Konto ist gesperrt. Bitte beim Host melden.' });
  }

  await clearFailures(key);
  const token = await createSession(username);
  setSessionCookie(res, token);

  user.lastLogin = new Date().toISOString();
  await redis.set(K.user(username), user);

  return res.status(200).json({ user: publicUser(user) });
});
