import { api } from '../_lib/handler.js';
import { requireHost, methodNotAllowed } from '../_lib/auth.js';

const QSTASH = 'https://qstash.upstash.io/v2/schedules';
const CRON = '*/15 * * * *';
const WINDOW = 15;

/** Öffentliche Adresse dieser Installation. */
function basisAdresse(req) {
  const fest = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.ALENA_URL;
  if (fest) return fest.startsWith('http') ? fest : `https://${fest}`;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${proto}://${host}` : null;
}

const ziel = (req) => {
  const basis = basisAdresse(req);
  return basis ? `${basis}/api/cron/reminders?window=${WINDOW}` : null;
};

async function qstash(pfad, options = {}) {
  const token = process.env.QSTASH_TOKEN;
  const res = await fetch(`${QSTASH}${pfad}`, {
    ...options,
    headers: { authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const text = await res.text();
  let daten = null;
  try { daten = text ? JSON.parse(text) : null; } catch { daten = { text }; }
  if (!res.ok) {
    const grund = daten?.error || daten?.text || `HTTP ${res.status}`;
    throw new Error(`QStash: ${grund}`);
  }
  return daten;
}

/**
 * Richtet den Taktgeber für die Erinnerungen ein – über die QStash-Integration,
 * die in Vercel mit dem Projekt verbunden wurde.
 */
export default api(async function handler(req, res) {
  const host = await requireHost(req, res);
  if (!host) return;

  const token = process.env.QSTASH_TOKEN;
  const secret = process.env.CRON_SECRET;
  const url = ziel(req);

  /* --------------------------------------------------------- Zustand */
  if (req.method === 'GET') {
    if (!token) {
      return res.status(200).json({
        qstash: false, secret: Boolean(secret), url, plaene: [],
        hinweis: 'QSTASH_TOKEN fehlt. In Vercel unter Integrations „Upstash QStash/Workflow“ '
               + 'mit dem Projekt verbinden und einmal neu deployen.',
      });
    }
    let plaene = [];
    try {
      const alle = await qstash('');
      plaene = (Array.isArray(alle) ? alle : [])
        .filter((p) => String(p.destination || '').includes('/api/cron/reminders'))
        .map((p) => ({ id: p.scheduleId, cron: p.cron, ziel: p.destination }));
    } catch (err) {
      return res.status(200).json({ qstash: true, secret: Boolean(secret), url, plaene: [], hinweis: err.message });
    }
    return res.status(200).json({
      qstash: true, secret: Boolean(secret), url, plaene,
      hinweis: secret ? null : 'CRON_SECRET fehlt – ohne dieses Geheimnis weist der Endpunkt jeden Aufruf ab.',
    });
  }

  /* ------------------------------------------------------- Einrichten */
  if (req.method === 'POST') {
    if (!token) return res.status(400).json({ error: 'QSTASH_TOKEN fehlt. Zuerst die QStash-Integration mit dem Projekt verbinden.' });
    if (!secret) return res.status(400).json({ error: 'CRON_SECRET fehlt. Bitte in Vercel setzen und neu deployen.' });
    if (!url) return res.status(400).json({ error: 'Die öffentliche Adresse liess sich nicht bestimmen.' });

    // Bestehende Zeitpläne für denselben Endpunkt zuerst entfernen.
    try {
      const alle = await qstash('');
      for (const p of Array.isArray(alle) ? alle : []) {
        if (String(p.destination || '').includes('/api/cron/reminders')) {
          await qstash(`/${p.scheduleId}`, { method: 'DELETE' });
        }
      }
    } catch { /* Liste nicht lesbar – dann eben nur anlegen */ }

    const angelegt = await qstash(`/${url}`, {
      method: 'POST',
      headers: {
        'Upstash-Cron': CRON,
        // Das Geheimnis reist als Kopfzeile mit, nicht in der Adresse.
        'Upstash-Forward-Authorization': `Bearer ${secret}`,
      },
    });

    return res.status(201).json({ id: angelegt?.scheduleId || null, cron: CRON, ziel: url });
  }

  /* ---------------------------------------------------------- Löschen */
  if (req.method === 'DELETE') {
    if (!token) return res.status(400).json({ error: 'QSTASH_TOKEN fehlt.' });
    const id = String(req.query?.id || req.body?.id || '');
    if (!id) return res.status(400).json({ error: 'Kennung fehlt.' });
    await qstash(`/${id}`, { method: 'DELETE' });
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
});
