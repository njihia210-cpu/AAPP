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
  requests: 'alena:requests',
  requestLimit: (ip) => `alena:reqlimit:${ip}`,
  audit: 'alena:audit',
};

/* -------------------------------------------------------------- Module */
export const MODULES = [
  { id: 'todo', name: 'To-Dos', icon: '✓', desc: 'Aufgaben, Projekte und Fälligkeiten an einem Ort.', status: 'soon' },
  { id: 'kalender', name: 'Kalender', icon: '📅', desc: 'Termine und Fristen – direkt mit den To-Dos verbunden.', status: 'soon' },
  { id: 'medikamente', name: 'Medikamententracker', icon: '💊', desc: 'Einnahmezeiten festhalten und pünktlich erinnert werden.', status: 'soon' },
  { id: 'periode', name: 'Periodentracker', icon: '🌙', desc: 'Zyklus, Symptome und Pille – mit Vorhersage und Erinnerungen.', status: 'live', href: '/cycle' },
  { id: 'lernatelier', name: 'Lernatelier', icon: '📚', desc: 'Karteikarten, Lernpläne und Prüfungsvorbereitung.', status: 'soon' },
  { id: 'ziele', name: 'Ziele', icon: '◎', desc: 'Grosse Vorhaben in kleine Schritte teilen und dranbleiben.', status: 'soon' },
  { id: 'rezepte', name: 'Rezeptbuch', icon: '🍲', desc: 'Eigene Rezepte erfassen – mit Zutaten und Schritt-für-Schritt-Anleitung.', status: 'soon' },
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
