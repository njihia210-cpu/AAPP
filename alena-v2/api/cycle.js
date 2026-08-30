import { api } from './_lib/handler.js';
import { requireUser, methodNotAllowed } from './_lib/auth.js';
import { loadCycle, saveCycle, dropCycle } from './_lib/cycle-store.js';

export default api(async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (user.modules?.periode !== true) {
    return res.status(403).json({ error: 'Der Periodentracker ist für dieses Konto nicht freigeschaltet.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ data: await loadCycle(user.username) });
  }

  if (req.method === 'PUT') {
    return res.status(200).json({ data: await saveCycle(user.username, req.body?.data) });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ data: await dropCycle(user.username) });
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
});
