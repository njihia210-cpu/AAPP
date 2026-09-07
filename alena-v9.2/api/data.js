import { api } from './_lib/handler.js';
import { requireUser, methodNotAllowed } from './_lib/auth.js';
import { hatModul } from './_lib/redis.js';
import { APPS, kenntApp, ladeApp, speichereApp, loescheApp } from './_lib/appdata.js';

/**
 * Daten der einfachen Apps – eine Function für alle.
 *
 *   GET    /api/data?app=ziele
 *   PUT    /api/data?app=ziele   { data }
 *   DELETE /api/data?app=ziele
 */
export default api(async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  const app = String(req.query?.app || '');
  if (!kenntApp(app)) return res.status(400).json({ error: 'Unbekannte App.' });

  if (!hatModul(user, APPS[app].modul)) {
    return res.status(403).json({ error: 'Diese App ist für dein Konto nicht freigeschaltet.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ data: await ladeApp(app, user.username) });
  }
  if (req.method === 'PUT') {
    return res.status(200).json({ data: await speichereApp(app, user.username, req.body?.data) });
  }
  if (req.method === 'DELETE') {
    return res.status(200).json({ data: await loescheApp(app, user.username) });
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
});
