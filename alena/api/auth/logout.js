import { currentUser, destroySession, clearSessionCookie, methodNotAllowed } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const user = await currentUser(req);
  if (user) await destroySession(user.sessionToken);
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
