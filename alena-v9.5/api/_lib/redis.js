import { Redis } from '@upstash/redis';

/**
 * Upstash Redis.
 * Die Vercel-Integration "Upstash for Redis" setzt KV_REST_API_URL / KV_REST_API_TOKEN.
 * Ein direkt bei Upstash angelegter Store setzt UPSTASH_REDIS_REST_URL / _TOKEN.
 * Beides wird hier unterstützt.
 */
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisReady = Boolean(url && token);

if (!redisReady) {
  console.warn('[alena] Redis-Umgebungsvariablen fehlen. Siehe .env.example.');
}

export const redis = new Redis({ url: url || 'https://nicht-konfiguriert', token: token || 'none' });

/* ---------------------------------------------------------------- Keys */
export const K = {
  user: (username) => `alena:user:${username}`,
  users: 'alena:users',
  session: (token) => `alena:sess:${token}`,
  userSessions: (username) => `alena:usersess:${username}`,
  subs: (username) => `alena:push:${username}`,
  loginFails: (key) => `alena:fails:${key}`,
  cycle: (username) => `alena:cycle:${username}`,
  seeded: 'alena:seeded',
  requests: 'alena:requests',
  requestLimit: (ip) => `alena:reqlimit:${ip}`,
  audit: 'alena:audit',
  cronLast: 'alena:cron:last',
};

/* -------------------------------------------------------------- Module */
export const MODULES = [
  { id: 'todo', name: 'To-Dos', icon: '✓', desc: 'Aufgaben sortieren, Favoriten sichern – und Alena merkt sich, was du oft brauchst.', status: 'live', href: '/todo' },
  { id: 'kalender', name: 'Kalender', icon: '📅', desc: 'Termine und Fristen – direkt mit den To-Dos verbunden.', status: 'soon' },
  { id: 'medikamente', name: 'Medikamente und Supplements', icon: '💊', desc: 'Medikamente und Nahrungsergänzung festhalten – mit Einnahmezeiten und pünktlicher Erinnerung.', status: 'soon' },
  { id: 'periode', name: 'Periodentracker', icon: '🌙', desc: 'Zyklus, Symptome und Pille – mit Vorhersage und Erinnerungen.', status: 'live', href: '/cycle' },
  { id: 'lernatelier', name: 'Lernatelier', icon: '📚', desc: 'Französisch und Versicherungen üben – Karteikarten, Satzbau, Vorsorgegrafiken.', status: 'live', href: '/lernen' },
  { id: 'ziele', name: 'Ziele', icon: '◎', desc: 'Vorhaben in Schritte teilen, Status setzen und den Fortschritt sehen.', status: 'live', href: '/ziele' },
  { id: 'rezepte', name: 'Rezeptbuch', icon: '🍲', desc: 'Eigene Rezepte mit Zutaten, Foto und Kochmodus Schritt für Schritt.', status: 'live', href: '/rezepte' },
  { id: 'arbeit', name: 'Arbeit', icon: '💼', desc: 'Dein Arbeitsbereich – Kunden auf Boards, eigene Status, Updates und Aufgaben.', status: 'live', href: '/arbeit' },
];

export const MODULE_IDS = MODULES.map((m) => m.id);

export function normaliseModules(input) {
  const out = {};
  for (const id of MODULE_IDS) out[id] = Boolean(input?.[id]);
  return out;
}

export const DEFAULT_MODULES = normaliseModules(
  Object.fromEntries(MODULE_IDS.map((id) => [id, true]))
);

/**
 * Welche Apps sind für dieses Konto offen?
 * Bei `alleApps` gilt der Vollzugang – dann kommen auch später ergänzte
 * Apps automatisch dazu, ohne dass der Host das Login anfassen muss.
 */
export function effectiveModules(user) {
  if (user?.alleApps) return { ...DEFAULT_MODULES };
  return normaliseModules(user?.modules);
}

/** Ist diese eine App für das Konto offen? */
export function hatModul(user, id) {
  return effectiveModules(user)[id] === true;
}
