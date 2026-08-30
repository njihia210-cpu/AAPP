import { api } from './_lib/handler.js';
import { requireUser, methodNotAllowed } from './_lib/auth.js';
import { loadCycle, saveCycle, dropCycle } from './_lib/cycle-store.js';
import { todayISO } from '../public/cycle-core.js';

/**
 *   GET    /api/cycle             ganze Zyklusdaten
 *   PUT    /api/cycle             { data }
 *   DELETE /api/cycle             alles löschen
 *   POST   /api/cycle?do=quick    { frage, antwort }  – tägliche Nachfrage
 */
export default api(async function handler(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (user.modules?.periode !== true) {
    return res.status(403).json({ error: 'Der Periodentracker ist für dieses Konto nicht freigeschaltet.' });
  }

  /* -------------------------------------------------- Tägliche Nachfrage */
  if (String(req.query?.do || '') === 'quick') {
    if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

    const frage = String(req.body?.frage || '');
    const antwort = String(req.body?.antwort || '');
    const heute = /^\d{4}-\d{2}-\d{2}$/.test(String(req.body?.datum || ''))
      ? req.body.datum
      : todayISO();

    const data = await loadCycle(user.username);
    data.days ||= {};
    const tag = (data.days[heute] ||= {});

    if (frage === 'pille') {
      if (antwort === 'ja') tag.pill = true;
      else delete tag.pill;
    } else if (frage === 'periode') {
      if (antwort === 'ja') {
        delete tag.noPeriod;
        tag.flow ||= 'mittel';
        data.periods = Array.isArray(data.periods) ? data.periods : [];
        if (!data.periods.some((p) => p.start === heute)) data.periods.push({ start: heute, end: null });
      } else {
        tag.noPeriod = true;
      }
    } else {
      return res.status(400).json({ error: 'Unbekannte Frage.' });
    }

    if (!Object.keys(tag).length) delete data.days[heute];
    return res.status(200).json({ data: await saveCycle(user.username, data) });
  }

  /* ------------------------------------------------------------- Normalfall */
  if (req.method === 'GET') {
    return res.status(200).json({ data: await loadCycle(user.username) });
  }
  if (req.method === 'PUT') {
    return res.status(200).json({ data: await saveCycle(user.username, req.body?.data) });
  }
  if (req.method === 'DELETE') {
    return res.status(200).json({ data: await dropCycle(user.username) });
  }

  return methodNotAllowed(res, ['GET', 'PUT', 'DELETE', 'POST']);
});
