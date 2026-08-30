import { api } from '../_lib/handler.js';
import { currentUser, publicUser, methodNotAllowed } from '../_lib/auth.js';
import { MODULES } from '../_lib/redis.js';

export default api(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const user = await currentUser(req);
  return res.status(200).json({
    user: publicUser(user),
    modules: MODULES,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY || null,
  });
});
