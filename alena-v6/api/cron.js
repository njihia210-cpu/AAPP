import { api } from './_lib/handler.js';
import { redis, K, hatModul } from './_lib/redis.js';
import { getUser, methodNotAllowed } from './_lib/auth.js';
import { sendToUser } from './_lib/push.js';
import { dueReminders } from '../public/cycle-core.js';

const ZONE = 'Europe/Zurich';

/** Datum und Uhrzeit in der Zeitzone der Nutzerinnen und Nutzer. */
function localNow(zone = ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date()).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return {
    iso: `${parts.year}-${parts.month}-${parts.day}`,
    hhmm: `${parts.hour === '24' ? '00' : parts.hour}:${parts.minute}`,
  };
}

/**
 * Läuft im Takt des Zeitplans und verschickt fällige Erinnerungen.
 * Zugriff nur mit CRON_SECRET – als Bearer-Token oder als ?secret=.
 */
export default api(async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST']);

  const secret = process.env.CRON_SECRET;
  const header = req.headers.authorization || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : String(req.query?.secret || '');
  if (!secret || given !== secret) {
    return res.status(401).json({ error: 'Nicht berechtigt.' });
  }

  const windowMin = Math.min(180, Math.max(5, Number(req.query?.window) || 15));
  const { iso, hhmm } = localNow();

  const names = (await redis.smembers(K.users)) || [];
  let verschickt = 0, geprueft = 0;

  for (const name of names) {
    const user = await getUser(name);
    if (!user || user.active === false || !hatModul(user, 'periode')) continue;

    const data = await redis.get(K.cycle(name));
    if (!data) continue;
    geprueft++;

    for (const note of dueReminders(data, iso, hhmm, windowMin)) {
      // Pro Tag und Art nur einmal senden.
      const guard = `alena:sent:${name}:${note.tag}:${iso}`;
      const first = await redis.set(guard, '1', { nx: true, ex: 90000 });
      if (!first) continue;
      try {
        const result = await sendToUser(name, note);
        verschickt += result.sent;
      } catch { /* fehlende Schlüssel oder totes Abo – überspringen */ }
    }
  }

  return res.status(200).json({ zeit: `${iso} ${hhmm}`, geprueft, verschickt });
});
