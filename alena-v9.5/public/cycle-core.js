/* ==========================================================================
   Alena – Zyklusrechnung
   Reine Logik ohne Browser- oder Server-Abhängigkeiten, damit Oberfläche
   und Erinnerungsdienst exakt dasselbe rechnen.

   Wichtig: Vorhersagen sind Schätzungen aus vergangenen Zyklen. Sie taugen
   nicht zur Verhütung und ersetzen keine ärztliche Beratung.
   ========================================================================== */

export const DAY = 86400000;

export const todayISO = () => toISO(new Date());

export function toISO(value) {
  const d = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

export function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

export const addDays = (iso, n) => new Date(parseISO(iso).getTime() + n * DAY).toISOString().slice(0, 10);

/** Ganze Tage von a nach b (b − a). */
export const diffDays = (a, b) => Math.round((parseISO(b) - parseISO(a)) / DAY);

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/* ----------------------------------------------------------- Voreinstellung */
export const DEFAULTS = {
  cycleLength: 28,
  periodLength: 5,
  lutealPhase: 14,
  reminders: {
    periodAhead: 2,      // ab wie vielen Tagen vor dem Termin gefragt wird
    pill: true,          // tägliche Frage nach der Pille
    period: true,        // tägliche Frage nach der Periode
    checkinTime: '09:00',
  },
  pill: {
    enabled: false,
    type: '21-7',        // 21-7 | 24-4 | continuous | minipille
    packStart: null,     // ISO-Datum der ersten Tablette der aktuellen Packung
    time: '08:00',
    lastTaken: null,
  },
};

export const PILL_TYPES = {
  '21-7':      { label: 'Kombipille 21 + 7', active: 21, total: 28, pauseLabel: 'Pause' },
  '24-4':      { label: 'Kombipille 24 + 4', active: 24, total: 28, pauseLabel: 'Placebo' },
  'continuous':{ label: 'Langzyklus (ohne Pause)', active: 28, total: 28, pauseLabel: null },
  'minipille': { label: 'Minipille (durchgehend)', active: 28, total: 28, pauseLabel: null },
};

export const FLOW_LEVELS = [
  { id: 'spotting', label: 'Schmierblutung', dots: 1 },
  { id: 'leicht', label: 'Leicht', dots: 2 },
  { id: 'mittel', label: 'Mittel', dots: 3 },
  { id: 'stark', label: 'Stark', dots: 4 },
];

export const SYMPTOMS = [
  { id: 'kraempfe', label: 'Krämpfe' },
  { id: 'kopfweh', label: 'Kopfschmerzen' },
  { id: 'ruecken', label: 'Rückenschmerzen' },
  { id: 'brustspannen', label: 'Brustspannen' },
  { id: 'blaehungen', label: 'Blähbauch' },
  { id: 'uebelkeit', label: 'Übelkeit' },
  { id: 'muedigkeit', label: 'Müdigkeit' },
  { id: 'haut', label: 'Haut / Pickel' },
  { id: 'heisshunger', label: 'Heisshunger' },
  { id: 'schlaflos', label: 'Schlaflos' },
];

export const MOODS = [
  { id: 'gut', label: 'Gut' },
  { id: 'ruhig', label: 'Ruhig' },
  { id: 'reizbar', label: 'Reizbar' },
  { id: 'traurig', label: 'Niedergeschlagen' },
  { id: 'aengstlich', label: 'Angespannt' },
  { id: 'energiegeladen', label: 'Voller Energie' },
];

/* --------------------------------------------------------- Leeres Dokument */
export function emptyCycleData() {
  return {
    version: 1,
    settings: JSON.parse(JSON.stringify(DEFAULTS)),
    periods: [],   // [{ start: ISO, end: ISO|null }]
    days: {},      // { ISO: { flow, symptoms: [], mood, note, sex } }
    updatedAt: null,
  };
}

/** Sortiert die Perioden und wirft Unsinniges weg. */
export function normalisePeriods(periods) {
  return (Array.isArray(periods) ? periods : [])
    .filter((p) => p && /^\d{4}-\d{2}-\d{2}$/.test(p.start))
    .map((p) => ({
      start: p.start,
      end: /^\d{4}-\d{2}-\d{2}$/.test(p.end || '') && diffDays(p.start, p.end) >= 0 ? p.end : null,
    }))
    .sort((a, b) => a.start.localeCompare(b.start))
    .filter((p, i, arr) => i === 0 || p.start !== arr[i - 1].start);
}

/* ------------------------------------------------------------- Pillenlogik */
export function pillState(settings, iso) {
  const pill = settings?.pill;
  if (!pill?.enabled || !pill.packStart) return null;
  const type = PILL_TYPES[pill.type] || PILL_TYPES['21-7'];
  const passed = diffDays(pill.packStart, iso);
  if (passed < 0) return null;

  const dayInPack = (passed % type.total) + 1;
  const packNumber = Math.floor(passed / type.total) + 1;
  const isBreak = dayInPack > type.active && Boolean(type.pauseLabel);

  return {
    type: pill.type,
    label: type.label,
    dayInPack,
    total: type.total,
    packNumber,
    isBreak,
    breakLabel: type.pauseLabel,
    daysUntilBreak: isBreak ? 0 : type.active - dayInPack + 1,
    packEndsIn: type.total - dayInPack + 1,
  };
}

/* --------------------------------------------------------------- Auswertung */
export function analyse(data, refISO = todayISO()) {
  const settings = { ...DEFAULTS, ...(data?.settings || {}) };
  settings.pill = { ...DEFAULTS.pill, ...(data?.settings?.pill || {}) };
  settings.reminders = { ...DEFAULTS.reminders, ...(data?.settings?.reminders || {}) };

  const periods = normalisePeriods(data?.periods);
  const onPill = Boolean(settings.pill.enabled);

  /* Zykluslängen aus den Abständen der Periodenstarts */
  const gaps = [];
  for (let i = 1; i < periods.length; i++) {
    const g = diffDays(periods[i - 1].start, periods[i].start);
    if (g >= 15 && g <= 60) gaps.push(g);
  }
  const recent = gaps.slice(-6);
  const avgCycle = recent.length
    ? Math.round(mean(recent))
    : clamp(Number(settings.cycleLength) || 28, 20, 45);

  const lengths = periods
    .filter((p) => p.end)
    .map((p) => diffDays(p.start, p.end) + 1)
    .filter((n) => n >= 1 && n <= 12)
    .slice(-6);
  const avgPeriod = lengths.length
    ? Math.round(mean(lengths))
    : clamp(Number(settings.periodLength) || 5, 1, 10);

  const variability = recent.length >= 2
    ? Math.round(Math.max(...recent) - Math.min(...recent))
    : null;

  const last = periods[periods.length - 1] || null;
  const lastStart = last?.start || null;

  /* Der rechnerisch erwartete Termin bleibt stehen, auch wenn er verstreicht –
     so lässt sich eine Verspätung benennen. Erst wenn er weiter als einen
     halben Zyklus zurückliegt, ist vermutlich eine Periode nicht erfasst
     worden, und es wird fortgeschrieben. */
  const grace = Math.round(avgCycle / 2);
  const expected = lastStart ? addDays(lastStart, avgCycle) : null;
  const upcoming = [];
  if (expected) {
    let first = expected;
    let guard = 0;
    while (diffDays(first, refISO) > grace && guard++ < 60) first = addDays(first, avgCycle);
    for (let i = 0; i < 3; i++) upcoming.push(addDays(first, i * avgCycle));
  }

  const cycleDay = lastStart ? diffDays(lastStart, refISO) + 1 : null;
  const daysUntilPeriod = upcoming[0] ? diffDays(refISO, upcoming[0]) : null;
  const overdueDays = daysUntilPeriod != null && daysUntilPeriod < 0 ? -daysUntilPeriod : 0;

  /* Aktuell blutend? */
  const bleedingToday = periods.some((p) => {
    const from = p.start;
    const to = p.end || addDays(p.start, avgPeriod - 1);
    return diffDays(from, refISO) >= 0 && diffDays(refISO, to) >= 0;
  });

  /* Fruchtbares Fenster – unter hormoneller Verhütung nicht sinnvoll */
  let ovulation = null, fertileFrom = null, fertileTo = null;
  if (!onPill && upcoming[0]) {
    const luteal = clamp(Number(settings.lutealPhase) || 14, 10, 17);
    ovulation = addDays(upcoming[0], -luteal);
    fertileFrom = addDays(ovulation, -5);
    fertileTo = addDays(ovulation, 1);
  }

  /* Phase */
  let phase = 'unbekannt';
  if (bleedingToday) phase = 'menstruation';
  else if (onPill) phase = pillState(settings, refISO)?.isBreak ? 'pause' : 'einnahme';
  else if (ovulation && refISO === ovulation) phase = 'eisprung';
  else if (fertileFrom && diffDays(fertileFrom, refISO) >= 0 && diffDays(refISO, fertileTo) >= 0) phase = 'fruchtbar';
  else if (cycleDay && ovulation && diffDays(refISO, ovulation) > 0) phase = 'follikelphase';
  else if (cycleDay) phase = 'lutealphase';

  return {
    settings,
    periods,
    onPill,
    avgCycle,
    avgPeriod,
    variability,
    cycleCount: periods.length,
    recentGaps: recent,
    lastStart,
    cycleDay,
    bleedingToday,
    nextPeriod: upcoming[0] || null,
    expected,
    upcoming,
    daysUntilPeriod,
    overdueDays: bleedingToday ? 0 : overdueDays,
    ovulation,
    fertileFrom,
    fertileTo,
    phase,
    pill: pillState(settings, refISO),
  };
}

export const PHASE_TEXT = {
  menstruation: 'Periode',
  fruchtbar: 'Fruchtbare Tage',
  eisprung: 'Eisprung',
  follikelphase: 'Follikelphase',
  lutealphase: 'Lutealphase',
  einnahme: 'Einnahmetage',
  pause: 'Pause',
  unbekannt: 'Noch keine Daten',
};

/** Wie ein einzelner Tag im Kalender einzufärben ist. */
export function dayKind(iso, a) {
  const inRange = (from, to) => from && to && diffDays(from, iso) >= 0 && diffDays(iso, to) >= 0;

  for (const p of a.periods) {
    const to = p.end || addDays(p.start, a.avgPeriod - 1);
    if (inRange(p.start, to)) return 'periode';
  }
  /* Unter der Pille ist die Pause die aussagekräftigere Auskunft:
     die Blutung fällt ohnehin in diese Tage. */
  if (a.onPill) {
    const p = pillState(a.settings, iso);
    if (p?.isBreak) return 'pillenpause';
  }

  for (const start of a.upcoming) {
    if (inRange(start, addDays(start, a.avgPeriod - 1))) return 'periode-erwartet';
  }

  if (!a.onPill) {
    if (a.ovulation && iso === a.ovulation) return 'eisprung';
    if (inRange(a.fertileFrom, a.fertileTo)) return 'fruchtbar';
  }
  return null;
}

/* ------------------------------------------------------- Fällige Hinweise */
const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Liegt die geplante Zeit im Fenster, das seit dem letzten Lauf vergangen ist? */
const inWindow = (planned, now, windowMin) => {
  const diff = toMinutes(now) - toMinutes(planned);
  return diff >= 0 && diff < windowMin;
};

/**
 * Welche Fragen stehen an diesem Tag offen?
 * Dieselbe Grundlage für die Mitteilung und für die Karte in der App.
 */
export function pendingQuestions(data, refISO = todayISO()) {
  const a = analyse(data, refISO);
  const day = data?.days?.[refISO] || {};
  const r = a.settings.reminders || {};
  const out = [];

  /* Pille – jeden Tag, solange die Einnahme nicht abgehakt ist. */
  if (a.onPill && a.pill && r.pill !== false && day.pill !== true) {
    out.push({
      id: 'pille',
      frage: 'Hast du deine Pille genommen?',
      zusatz: a.pill.isBreak
        ? `Heute ist Tag ${a.pill.dayInPack} – ${a.pill.breakLabel}. Da ist keine Einnahme nötig.`
        : `Tag ${a.pill.dayInPack} von ${a.pill.total} in der Packung.`,
      ja: 'Ja, genommen',
      nein: 'Später',
      pause: a.pill.isBreak,
    });
  }

  /* Periode – ab dem Vorlauf bis eine Woche nach dem erwarteten Termin. */
  if (r.period !== false && a.nextPeriod && !a.bleedingToday && day.noPeriod !== true) {
    const ahead = clamp(Number(r.periodAhead ?? 2), 0, 7);
    const bis = diffDays(refISO, a.nextPeriod);          // negativ = überfällig
    if (bis <= ahead && bis >= -14) {
      out.push({
        id: 'periode',
        frage: 'Hast du deine Tage bekommen?',
        zusatz: a.overdueDays > 0
          ? `Der erwartete Termin war vor ${a.overdueDays} Tag${a.overdueDays === 1 ? '' : 'en'}.`
          : bis === 0
            ? 'Heute wird deine Periode erwartet.'
            : `Erwartet in ${bis} Tag${bis === 1 ? '' : 'en'}.`,
        ja: 'Ja, heute',
        nein: 'Noch nicht',
      });
    }
  }

  return out;
}

/**
 * Liefert die Mitteilungen, die gerade anstehen.
 * `windowMin` ist der Abstand zwischen zwei Läufen des Erinnerungsdienstes.
 */
export function dueReminders(data, nowISO, hhmm, windowMin = 15) {
  const a = analyse(data, nowISO);
  const fragen = pendingQuestions(data, nowISO);
  const r = a.settings.reminders || {};
  const out = [];

  const pille = fragen.find((f) => f.id === 'pille');
  if (pille && inWindow(a.settings.pill.time || '08:00', hhmm, windowMin)) {
    out.push({
      tag: 'pille',
      question: 'pille',
      title: 'Alena',
      body: `${pille.frage} ${pille.zusatz}`,
      url: '/cycle?frage=pille',
      actions: [
        { action: 'ja', title: pille.pause ? 'Alles klar' : 'Ja, genommen' },
        { action: 'spaeter', title: 'Später' },
      ],
    });
  }

  const periode = fragen.find((f) => f.id === 'periode');
  if (periode && inWindow(r.checkinTime || '09:00', hhmm, windowMin)) {
    out.push({
      tag: 'periode',
      question: 'periode',
      title: 'Alena',
      body: `${periode.frage} ${periode.zusatz}`,
      url: '/cycle?frage=periode',
      actions: [
        { action: 'ja', title: 'Ja, heute' },
        { action: 'nein', title: 'Noch nicht' },
      ],
    });
  }

  return out;
}
