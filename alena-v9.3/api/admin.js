import { api } from './_lib/handler.js';
import {
  requireHost, hashPassword, passwordProblem, getUser, saveUser, publicUser,
  cleanUsername, destroyAllSessions, methodNotAllowed,
} from './_lib/auth.js';
import { redis, K, MODULES, normaliseModules, DEFAULT_MODULES } from './_lib/redis.js';
import { pushProblem, schluesselKurz, vapidSubject, sendToUser } from './_lib/push.js';
import crypto from 'node:crypto';
import webpush from 'web-push';

/* ==================================================================== Nutzer */
async function listUsers() {
  const names = (await redis.smembers(K.users)) || [];
  names.sort();
  const users = [];
  for (const name of names) {
    const u = await getUser(name);
    if (u) {
      const subs = await redis.hlen(K.subs(name));
      users.push({ ...publicUser(u), pushDevices: Number(subs || 0) });
    }
  }
  return users;
}

async function nutzer(req, res, host) {
  if (req.method === 'GET') {
    return res.status(200).json({ users: await listUsers(), modules: MODULES });
  }

  if (req.method === 'POST') {
    const username = cleanUsername(req.body?.username);
    const name = String(req.body?.name || '').trim().slice(0, 80);
    const password = String(req.body?.password || '');
    const role = req.body?.role === 'host' ? 'host' : 'user';

    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Benutzername: mindestens 3 Zeichen (a–z, 0–9, . _ -).' });
    }
    if (await getUser(username)) {
      return res.status(409).json({ error: 'Diesen Benutzernamen gibt es bereits.' });
    }
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });

    const user = {
      username,
      name: name || username,
      role,
      active: true,
      alleApps: req.body?.alleApps === true,
      modules: req.body?.modules ? normaliseModules(req.body.modules) : { ...DEFAULT_MODULES },
      passwordHash: hashPassword(password),
      mustChangePassword: req.body?.mustChangePassword !== false,
      createdAt: new Date().toISOString(),
      createdBy: host.username,
    };
    await saveUser(user);
    return res.status(201).json({ user: publicUser(user) });
  }

  if (req.method === 'PATCH') {
    const username = cleanUsername(req.body?.username);
    const action = String(req.body?.action || '');
    const user = await getUser(username);
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden.' });

    switch (action) {
      case 'lock':
        if (username === host.username) {
          return res.status(400).json({ error: 'Das eigene Konto kann nicht gesperrt werden.' });
        }
        user.active = false;
        await destroyAllSessions(username);
        break;

      case 'unlock':
        user.active = true;
        break;

      case 'modules':
        user.alleApps = false;
        user.modules = normaliseModules(req.body?.modules);
        break;

      case 'alleApps':
        user.alleApps = Boolean(req.body?.enabled);
        if (user.alleApps) user.modules = { ...DEFAULT_MODULES };
        break;

      case 'module': {
        const id = String(req.body?.module || '');
        if (!MODULES.some((m) => m.id === id)) {
          return res.status(400).json({ error: 'Unbekanntes Modul.' });
        }
        if (user.alleApps) {
          user.modules = { ...DEFAULT_MODULES };
          user.alleApps = false;
        }
        user.modules = normaliseModules(user.modules);
        user.modules[id] = Boolean(req.body?.enabled);
        break;
      }

      case 'password': {
        const problem = passwordProblem(String(req.body?.password || ''));
        if (problem) return res.status(400).json({ error: problem });
        user.passwordHash = hashPassword(String(req.body.password));
        user.mustChangePassword = req.body?.mustChangePassword !== false;
        await destroyAllSessions(username);
        break;
      }

      case 'role':
        if (username === host.username) {
          return res.status(400).json({ error: 'Die eigene Rolle kann nicht geändert werden.' });
        }
        user.role = req.body?.role === 'host' ? 'host' : 'user';
        break;

      case 'name':
        user.name = String(req.body?.name || '').trim().slice(0, 80) || user.username;
        break;

      case 'signout':
        await destroyAllSessions(username);
        break;

      default:
        return res.status(400).json({ error: 'Unbekannte Aktion.' });
    }

    user.updatedAt = new Date().toISOString();
    await saveUser(user);
    return res.status(200).json({ user: publicUser(user) });
  }

  if (req.method === 'DELETE') {
    const username = cleanUsername(req.query?.username || req.body?.username);
    if (!username) return res.status(400).json({ error: 'Benutzername fehlt.' });
    if (username === host.username) {
      return res.status(400).json({ error: 'Das eigene Konto kann nicht gelöscht werden.' });
    }
    const hosts = (await listUsers()).filter((u) => u.role === 'host');
    if (hosts.length <= 1 && hosts[0]?.username === username) {
      return res.status(400).json({ error: 'Es muss mindestens ein Host-Konto bestehen bleiben.' });
    }
    await destroyAllSessions(username);
    await redis.del(K.user(username), K.subs(username), K.cycle(username));
    await redis.srem(K.users, username);
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE']);
}

/* ================================================================= Anfragen */
async function anfragen(req, res, host) {
  if (req.method === 'GET') {
    const map = (await redis.hgetall(K.requests)) || {};
    const requests = Object.values(map)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return res.status(200).json({ requests });
  }

  if (req.method === 'PATCH') {
    const id = String(req.body?.id || '');
    const map = (await redis.hgetall(K.requests)) || {};
    const item = map[id];
    if (!item) return res.status(404).json({ error: 'Antrag nicht gefunden.' });
    item.status = req.body?.status === 'neu' ? 'neu' : 'erledigt';
    item.handledAt = new Date().toISOString();
    item.handledBy = host.username;
    await redis.hset(K.requests, { [id]: item });
    return res.status(200).json({ request: item });
  }

  if (req.method === 'DELETE') {
    const id = String(req.query?.id || req.body?.id || '');
    if (!id) return res.status(400).json({ error: 'Kennung fehlt.' });
    await redis.hdel(K.requests, id);
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE']);
}

/* ================================================================= Zeitplan */
const QSTASH = 'https://qstash.upstash.io/v2/schedules';
const CRON = '*/15 * * * *';
const WINDOW = 15;
const PFAD = '/api/cron';

function basisAdresse(req) {
  const fest = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.ALENA_URL;
  if (fest) return fest.startsWith('http') ? fest : `https://${fest}`;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${proto}://${host}` : null;
}

async function qstash(pfad, options = {}) {
  const res = await fetch(`${QSTASH}${pfad}`, {
    ...options,
    headers: { authorization: `Bearer ${process.env.QSTASH_TOKEN}`, ...(options.headers || {}) },
  });
  const text = await res.text();
  let daten = null;
  try { daten = text ? JSON.parse(text) : null; } catch { daten = { text }; }
  if (!res.ok) throw new Error(`QStash: ${daten?.error || daten?.text || `HTTP ${res.status}`}`);
  return daten;
}

async function zeitplan(req, res) {
  const token = process.env.QSTASH_TOKEN;
  const secret = process.env.CRON_SECRET;
  const basis = basisAdresse(req);
  const url = basis ? `${basis}${PFAD}?window=${WINDOW}` : null;

  if (req.method === 'GET') {
    if (!token) {
      return res.status(200).json({
        qstash: false, secret: Boolean(secret), url, plaene: [],
        hinweis: 'QSTASH_TOKEN fehlt. In Vercel unter Integrations „Upstash QStash/Workflow“ '
               + 'mit dem Projekt verbinden und einmal neu deployen.',
      });
    }
    try {
      const alle = await qstash('');
      const plaene = (Array.isArray(alle) ? alle : [])
        .filter((p) => String(p.destination || '').includes(PFAD))
        .map((p) => ({ id: p.scheduleId, cron: p.cron, ziel: p.destination }));
      return res.status(200).json({
        qstash: true, secret: Boolean(secret), url, plaene,
        hinweis: secret ? null : 'CRON_SECRET fehlt – ohne dieses Geheimnis weist der Endpunkt jeden Aufruf ab.',
      });
    } catch (err) {
      return res.status(200).json({ qstash: true, secret: Boolean(secret), url, plaene: [], hinweis: err.message });
    }
  }

  if (req.method === 'POST') {
    if (!token) return res.status(400).json({ error: 'QSTASH_TOKEN fehlt. Zuerst die QStash-Integration mit dem Projekt verbinden.' });
    if (!secret) return res.status(400).json({ error: 'CRON_SECRET fehlt. Bitte in Vercel setzen und neu deployen.' });
    if (!url) return res.status(400).json({ error: 'Die öffentliche Adresse liess sich nicht bestimmen.' });

    try {
      const alle = await qstash('');
      for (const p of Array.isArray(alle) ? alle : []) {
        if (String(p.destination || '').includes(PFAD)) await qstash(`/${p.scheduleId}`, { method: 'DELETE' });
      }
    } catch { /* Liste nicht lesbar – dann eben nur anlegen */ }

    const angelegt = await qstash(`/${url}`, {
      method: 'POST',
      headers: {
        'Upstash-Cron': CRON,
        'Upstash-Forward-Authorization': `Bearer ${secret}`,
      },
    });
    return res.status(201).json({ id: angelegt?.scheduleId || null, cron: CRON, ziel: url });
  }

  if (req.method === 'DELETE') {
    if (!token) return res.status(400).json({ error: 'QSTASH_TOKEN fehlt.' });
    const id = String(req.query?.id || req.body?.id || '');
    if (!id) return res.status(400).json({ error: 'Kennung fehlt.' });
    await qstash(`/${id}`, { method: 'DELETE' });
    return res.status(200).json({ ok: true });
  }

  return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
}

/* ============================================================== Mitteilungen */
/**
 * Alles, was für Push nötig ist – an einem Ort.
 * Vercel-Variablen lassen sich von hier aus nicht setzen; deshalb erzeugt
 * dieser Bereich die Werte und zeigt sie zum Kopieren an.
 */
async function mitteilungen(req, res, host) {
  if (req.method === 'GET') {
    const problem = pushProblem();
    const kurz = schluesselKurz();

    /* Wie viele Geräte sind angemeldet – und wie viele noch mit altem Schlüssel? */
    const namen = (await redis.smembers(K.users)) || [];
    let geraete = 0, veraltet = 0;
    const konten = [];
    for (const name of namen) {
      const map = (await redis.hgetall(K.subs(name))) || {};
      const liste = Object.values(map);
      if (!liste.length) continue;
      const alt = liste.filter((s) => kurz && s?.vapid && s.vapid !== kurz).length;
      geraete += liste.length;
      veraltet += alt;
      konten.push({ username: name, geraete: liste.length, veraltet: alt });
    }

    const letzter = (await redis.get(K.cronLast)) || null;

    return res.status(200).json({
      bereit: !problem,
      problem,
      subject: vapidSubject(),
      oeffentlich: process.env.VAPID_PUBLIC_KEY ? `${(process.env.VAPID_PUBLIC_KEY || '').trim().slice(0, 12)}…` : null,
      cronSecret: Boolean(process.env.CRON_SECRET),
      qstash: Boolean(process.env.QSTASH_TOKEN),
      geraete, veraltet, konten,
      letzterLauf: letzter,
    });
  }

  if (req.method === 'POST') {
    const aktion = String(req.body?.aktion || '');

    /* Neue Schlüssel erzeugen – nur anzeigen, nirgends speichern. */
    if (aktion === 'schluessel') {
      const paar = webpush.generateVAPIDKeys();
      return res.status(200).json({
        werte: [
          { name: 'VAPID_PUBLIC_KEY',  wert: paar.publicKey },
          { name: 'VAPID_PRIVATE_KEY', wert: paar.privateKey, geheim: true },
          { name: 'VAPID_SUBJECT',     wert: vapidSubject() },
          { name: 'CRON_SECRET',       wert: crypto.randomBytes(24).toString('base64url'), geheim: true },
        ],
        hinweis: 'Diese Werte erscheinen nur dieses eine Mal. In Vercel unter '
               + 'Settings → Environment Variables eintragen, danach einmal neu deployen. '
               + 'Bestehende Geräte müssen die Mitteilungen anschliessend neu erlauben.',
      });
    }

    /* Probemitteilung an ein beliebiges Konto. */
    if (aktion === 'test') {
      const ziel = cleanUsername(req.body?.username) || host.username;
      if (!(await getUser(ziel))) return res.status(404).json({ error: 'Konto nicht gefunden.' });
      try {
        const out = await sendToUser(ziel, {
          title: 'Alena',
          body: 'Probemitteilung aus dem Host-Bereich – der Versand läuft.',
          url: '/app',
          tag: 'alena-probe',
        });
        return res.status(200).json(out);
      } catch (err) {
        return res.status(503).json({ error: err.message });
      }
    }

    /* Abos wegräumen, die noch am alten Schlüssel hängen. */
    if (aktion === 'aufraeumen') {
      const kurz = schluesselKurz();
      if (!kurz) return res.status(400).json({ error: 'Ohne gesetzten Schlüssel lässt sich nichts vergleichen.' });
      const namen = (await redis.smembers(K.users)) || [];
      let weg = 0;
      for (const name of namen) {
        const map = (await redis.hgetall(K.subs(name))) || {};
        const alt = Object.entries(map).filter(([, s]) => s?.vapid && s.vapid !== kurz).map(([id]) => id);
        if (alt.length) { await redis.hdel(K.subs(name), ...alt); weg += alt.length; }
      }
      return res.status(200).json({ entfernt: weg });
    }

    return res.status(400).json({ error: 'Unbekannte Aktion.' });
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}

/* =============================================================== Systemlage */
async function system(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const dienste = [];

  /* Redis – wirklich anfragen, nicht nur die Variablen prüfen. */
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const t0 = Date.now();
  try {
    const konten = Number((await redis.scard(K.users)) || 0);
    dienste.push({
      id: 'redis',
      name: 'Upstash for Redis',
      zustand: 'ok',
      text: `verbunden · ${konten} ${konten === 1 ? 'Konto' : 'Konten'} · ${Date.now() - t0} ms`,
      quelle: process.env.KV_REST_API_URL ? 'Vercel-Integration' : 'eigene Variablen',
    });
  } catch (err) {
    dienste.push({
      id: 'redis',
      name: 'Upstash for Redis',
      zustand: 'fehler',
      text: redisUrl ? `Antwortet nicht: ${err.message}` : 'Nicht verbunden – Store in Vercel unter Storage anlegen.',
    });
  }

  /* QStash – Token vorhanden und Liste abrufbar? */
  if (!process.env.QSTASH_TOKEN) {
    dienste.push({
      id: 'qstash',
      name: 'Upstash QStash',
      zustand: 'fehlt',
      text: 'Nicht verbunden. In Vercel unter Integrations hinzufügen – ohne QStash keine täglichen Fragen.',
    });
  } else {
    try {
      const alle = await qstash('');
      const eigene = (Array.isArray(alle) ? alle : []).filter((p) => String(p.destination || '').includes(PFAD));
      dienste.push({
        id: 'qstash',
        name: 'Upstash QStash',
        zustand: eigene.length ? 'ok' : 'warnung',
        text: eigene.length
          ? `verbunden · ${eigene.length} Zeitplan${eigene.length === 1 ? '' : 'e'} aktiv`
          : 'verbunden, aber kein Zeitplan angelegt.',
      });
    } catch (err) {
      dienste.push({ id: 'qstash', name: 'Upstash QStash', zustand: 'fehler', text: err.message });
    }
  }

  /* Push-Schlüssel – nicht nur vorhanden, sondern auch brauchbar? */
  const vapidProblem = pushProblem();
  dienste.push({
    id: 'vapid',
    name: 'Push-Schlüssel (VAPID)',
    zustand: vapidProblem ? 'fehlt' : 'ok',
    text: vapidProblem
      ? `${vapidProblem} Im Bereich „Mitteilungen“ lassen sie sich erzeugen.`
      : 'gesetzt und brauchbar',
  });

  /* Geheimnisse */
  dienste.push({
    id: 'cron',
    name: 'CRON_SECRET',
    zustand: process.env.CRON_SECRET ? 'ok' : 'fehlt',
    text: process.env.CRON_SECRET ? 'gesetzt' : 'fehlt – der Erinnerungsdienst weist jeden Aufruf ab.',
  });
  dienste.push({
    id: 'setup',
    name: 'SETUP_TOKEN',
    zustand: process.env.SETUP_TOKEN ? 'warnung' : 'ok',
    text: process.env.SETUP_TOKEN
      ? 'gesetzt – nach der Einrichtung besser löschen, damit niemand Passwörter zurücksetzen kann.'
      : 'nicht gesetzt (so soll es im laufenden Betrieb sein).',
  });

  const schlimmstes = dienste.some((d) => d.zustand === 'fehler') ? 'fehler'
    : dienste.some((d) => d.zustand === 'fehlt') ? 'fehlt'
    : dienste.some((d) => d.zustand === 'warnung') ? 'warnung' : 'ok';

  return res.status(200).json({ gesamt: schlimmstes, dienste, adresse: basisAdresse(req) });
}

/* ==================================================================== Weiche */
export default api(async function handler(req, res) {
  const host = await requireHost(req, res);
  if (!host) return;

  const bereich = String(req.query?.bereich || 'users');
  if (bereich === 'users') return nutzer(req, res, host);
  if (bereich === 'requests') return anfragen(req, res, host);
  if (bereich === 'schedule') return zeitplan(req, res);
  if (bereich === 'push') return mitteilungen(req, res, host);
  if (bereich === 'system') return system(req, res);

  return res.status(400).json({ error: 'Unbekannter Bereich.' });
});
