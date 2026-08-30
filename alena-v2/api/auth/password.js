import { api } from '../_lib/handler.js';
import {
  requireUser, verifyPassword, hashPassword, passwordProblem,
  saveUser, destroyAllSessions, createSession, setSessionCookie, methodNotAllowed,
} from '../_lib/auth.js';

/** Eigenes Passwort ändern. */
export default api(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const user = await requireUser(req, res);
  if (!user) return;

  const current = String(req.body?.current || '');
  const next = String(req.body?.next || '');

  if (!verifyPassword(current, user.passwordHash)) {
    return res.status(401).json({ error: 'Das aktuelle Passwort ist falsch.' });
  }
  const problem = passwordProblem(next);
  if (problem) return res.status(400).json({ error: problem });

  const { sessionToken, ...record } = user;
  record.passwordHash = hashPassword(next);
  record.mustChangePassword = false;
  record.updatedAt = new Date().toISOString();
  await saveUser(record);

  // Alle bisherigen Sitzungen beenden, danach diese neu ausstellen.
  await destroyAllSessions(record.username);
  const token = await createSession(record.username);
  setSessionCookie(res, token);

  return res.status(200).json({ ok: true });
});
