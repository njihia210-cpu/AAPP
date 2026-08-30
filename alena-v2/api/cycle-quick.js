import { api } from './_lib/handler.js';
import { requireUser, methodNotAllowed } from './_lib/auth.js';
import { loadCycle, saveCycle } from './_lib/cycle-store.js';
import { todayISO } from '../public/cycle-core.js';

/**
 * Beantwortet die tägliche Nachfrage in einem Schritt – aus der Mitteilung
 * heraus oder über die Karte in der App.
 *
 *   { frage: 'pille',   antwort: 'ja' | 'spaeter' }
 *   { frage: 'periode', antwort: 'ja' | 'nein' }
 */
export default api(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const user = await requireUser(req, res);
  if (!user) return;
  if (user.modules?.periode !== true) {
    return res.status(403).json({ error: 'Der Periodentracker ist für dieses Konto nicht freigeschaltet.' });
  }

  const frage = String(req.body?.frage || '');
  const antwort = String(req.body?.antwort || '');
  const heute = String(req.body?.datum || '').match(/^\d{4}-\d{2}-\d{2}$/)
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
      if (!data.periods.some((p) => p.start === heute)) {
        data.periods.push({ start: heute, end: null });
      }
    } else {
      tag.noPeriod = true;
    }
  } else {
    return res.status(400).json({ error: 'Unbekannte Frage.' });
  }

  if (!Object.keys(tag).length) delete data.days[heute];

  return res.status(200).json({ data: await saveCycle(user.username, data) });
});
