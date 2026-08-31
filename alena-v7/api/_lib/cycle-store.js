import { redis, K } from './redis.js';
import {
  emptyCycleData, normalisePeriods, DEFAULTS, SYMPTOMS, MOODS, FLOW_LEVELS, PILL_TYPES,
} from '../../public/cycle-core.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const SYMPTOM_IDS = new Set(SYMPTOMS.map((s) => s.id));
const MOOD_IDS = new Set(MOODS.map((m) => m.id));
const FLOW_IDS = new Set(FLOW_LEVELS.map((f) => f.id));

const between = (n, lo, hi, fallback) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;
};

/** Lässt nur durch, was auch wirklich hineingehört. */
export function sanitise(input) {
  const out = emptyCycleData();
  const s = input?.settings || {};

  out.settings.cycleLength = between(s.cycleLength, 20, 45, DEFAULTS.cycleLength);
  out.settings.periodLength = between(s.periodLength, 1, 10, DEFAULTS.periodLength);
  out.settings.lutealPhase = between(s.lutealPhase, 10, 17, DEFAULTS.lutealPhase);

  out.settings.reminders = {
    periodAhead: between(s.reminders?.periodAhead, 0, 7, 2),
    pill: s.reminders?.pill !== false,
    period: s.reminders?.period !== false,
    checkinTime: /^\d{2}:\d{2}$/.test(s.reminders?.checkinTime || '') ? s.reminders.checkinTime : '09:00',
  };

  out.settings.pill = {
    enabled: Boolean(s.pill?.enabled),
    type: PILL_TYPES[s.pill?.type] ? s.pill.type : '21-7',
    packStart: ISO.test(s.pill?.packStart || '') ? s.pill.packStart : null,
    time: /^\d{2}:\d{2}$/.test(s.pill?.time || '') ? s.pill.time : '08:00',
    lastTaken: ISO.test(s.pill?.lastTaken || '') ? s.pill.lastTaken : null,
  };

  out.periods = normalisePeriods(input?.periods).slice(-120);

  const days = input?.days && typeof input.days === 'object' ? input.days : {};
  let count = 0;
  for (const [iso, raw] of Object.entries(days)) {
    if (!ISO.test(iso) || count++ > 1500) continue;
    const entry = {};
    if (FLOW_IDS.has(raw?.flow)) entry.flow = raw.flow;
    if (MOOD_IDS.has(raw?.mood)) entry.mood = raw.mood;
    if (Array.isArray(raw?.symptoms)) {
      const list = raw.symptoms.filter((x) => SYMPTOM_IDS.has(x)).slice(0, 20);
      if (list.length) entry.symptoms = list;
    }
    if (typeof raw?.note === 'string' && raw.note.trim()) entry.note = raw.note.trim().slice(0, 400);
    if (raw?.sex === true) entry.sex = true;
    if (raw?.pill === true) entry.pill = true;
    if (raw?.noPeriod === true) entry.noPeriod = true;
    if (Object.keys(entry).length) out.days[iso] = entry;
  }

  out.updatedAt = new Date().toISOString();
  return out;
}

export async function loadCycle(username) {
  return (await redis.get(K.cycle(username))) || emptyCycleData();
}

export async function saveCycle(username, data) {
  const clean = sanitise(data);
  await redis.set(K.cycle(username), clean);
  return clean;
}

export async function dropCycle(username) {
  await redis.del(K.cycle(username));
  return emptyCycleData();
}
