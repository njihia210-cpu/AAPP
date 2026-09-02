/* ==========================================================================
   Alena – Arbeit, reine Logik
   Branchen bringen ihr eigenes Dashboard mit: eigene Wörter, eigene Boards,
   eigene Status. Alles davon lässt sich danach frei ändern.
   ========================================================================== */

/**
 * Eine Branche legt nur die Startaufstellung fest. Wer eigene Status oder
 * Boards anlegt, überschreibt sie – die Branche bleibt nur die Vorlage.
 */
export const BRANCHEN = [
  {
    id: 'versicherungen', name: 'Versicherungen', icon: '🛡️',
    beschreibung: 'Kunden, Offerten, Policen und Schäden.',
    wort: { einzahl: 'Kunde', mehrzahl: 'Kunden', firma: 'Firma' },
    boards: ['Neukunden', 'Offerten', 'Bestand', 'Schäden'],
    status: [
      { name: 'Erstkontakt', farbe: 'blau' },
      { name: 'Offerte offen', farbe: 'gelb' },
      { name: 'Unterlagen fehlen', farbe: 'rot' },
      { name: 'Police läuft', farbe: 'gruen' },
      { name: 'Wiedervorlage', farbe: 'violett' },
    ],
  },
  {
    id: 'treuhand', name: 'Treuhand und Steuern', icon: '📊',
    beschreibung: 'Mandate, Abschlüsse und Fristen.',
    wort: { einzahl: 'Mandat', mehrzahl: 'Mandate', firma: 'Firma' },
    boards: ['Steuererklärungen', 'Buchhaltung', 'Abschlüsse'],
    status: [
      { name: 'Unterlagen ausstehend', farbe: 'rot' },
      { name: 'In Bearbeitung', farbe: 'blau' },
      { name: 'Zur Kontrolle', farbe: 'gelb' },
      { name: 'Eingereicht', farbe: 'gruen' },
    ],
  },
  {
    id: 'handwerk', name: 'Handwerk und Bau', icon: '🔧',
    beschreibung: 'Aufträge von der Offerte bis zur Rechnung.',
    wort: { einzahl: 'Auftrag', mehrzahl: 'Aufträge', firma: 'Auftraggeber' },
    boards: ['Anfragen', 'Baustellen', 'Abgeschlossen'],
    status: [
      { name: 'Besichtigung', farbe: 'blau' },
      { name: 'Offeriert', farbe: 'gelb' },
      { name: 'In Arbeit', farbe: 'violett' },
      { name: 'Abgenommen', farbe: 'gruen' },
      { name: 'Verrechnet', farbe: 'grau' },
    ],
  },
  {
    id: 'immobilien', name: 'Immobilien', icon: '🏠',
    beschreibung: 'Objekte, Interessenten und Termine.',
    wort: { einzahl: 'Objekt', mehrzahl: 'Objekte', firma: 'Eigentümer' },
    boards: ['Akquise', 'Vermarktung', 'Verkauft'],
    status: [
      { name: 'Bewertung', farbe: 'blau' },
      { name: 'Inserat online', farbe: 'gelb' },
      { name: 'Besichtigungen', farbe: 'violett' },
      { name: 'Reserviert', farbe: 'gruen' },
    ],
  },
  {
    id: 'gesundheit', name: 'Gesundheit und Praxis', icon: '🩺',
    beschreibung: 'Klientinnen und Klienten mit Verlauf.',
    wort: { einzahl: 'Klient', mehrzahl: 'Klientinnen und Klienten', firma: 'Zuweiser' },
    boards: ['Neuanmeldungen', 'Laufend', 'Abgeschlossen'],
    status: [
      { name: 'Ersttermin offen', farbe: 'blau' },
      { name: 'In Behandlung', farbe: 'violett' },
      { name: 'Kontrolle fällig', farbe: 'gelb' },
      { name: 'Abgeschlossen', farbe: 'gruen' },
    ],
  },
  {
    id: 'verkauf', name: 'Verkauf und Handel', icon: '🛒',
    beschreibung: 'Leads bis zum Abschluss.',
    wort: { einzahl: 'Kontakt', mehrzahl: 'Kontakte', firma: 'Firma' },
    boards: ['Leads', 'Verhandlung', 'Gewonnen'],
    status: [
      { name: 'Neu', farbe: 'blau' },
      { name: 'Kontaktiert', farbe: 'gelb' },
      { name: 'Angebot draussen', farbe: 'violett' },
      { name: 'Abgeschlossen', farbe: 'gruen' },
      { name: 'Verloren', farbe: 'grau' },
    ],
  },
  {
    id: 'allgemein', name: 'Allgemein', icon: '💼',
    beschreibung: 'Neutral – für alles andere.',
    wort: { einzahl: 'Eintrag', mehrzahl: 'Einträge', firma: 'Organisation' },
    boards: ['Offen', 'Laufend', 'Erledigt'],
    status: [
      { name: 'Neu', farbe: 'blau' },
      { name: 'In Arbeit', farbe: 'violett' },
      { name: 'Wartet', farbe: 'gelb' },
      { name: 'Fertig', farbe: 'gruen' },
    ],
  },
];

export const BRANCHEN_IDS = BRANCHEN.map((b) => b.id);
export const istBranche = (id) => BRANCHEN_IDS.includes(id);
export const findeBranche = (id) => BRANCHEN.find((b) => b.id === id) || BRANCHEN.at(-1);

export const FARBEN = ['blau', 'gruen', 'gelb', 'rot', 'violett', 'grau'];
export const istFarbe = (f) => FARBEN.includes(f);

export function leereArbeit() {
  return { version: 1, branche: null, boards: [], status: [], kunden: [], updatedAt: null };
}

const kennung = () => Math.random().toString(16).slice(2, 10);

/** Die Startaufstellung einer Branche in echte Boards und Status übersetzen. */
export function richteEin(brancheId) {
  const b = findeBranche(brancheId);
  return {
    ...leereArbeit(),
    branche: b.id,
    boards: b.boards.map((name, i) => ({ id: kennung(), name, ordnung: i })),
    status: b.status.map((s, i) => ({ id: kennung(), name: s.name, farbe: s.farbe, ordnung: i })),
  };
}

export const istEingerichtet = (daten) => Boolean(daten?.branche && (daten.boards || []).length);

/** Wie diese Branche ihre Einträge nennt. */
export const wortschatz = (daten) => findeBranche(daten?.branche).wort;

/* ------------------------------------------------------------- Ordnen */

export const sortiertNachOrdnung = (liste) =>
  [...(liste || [])].sort((a, b) => (a.ordnung ?? 0) - (b.ordnung ?? 0));

/** Kunden eines Boards, gruppiert nach Status – die Spalten des Boards. */
export function spalten(daten, boardId) {
  const status = sortiertNachOrdnung(daten?.status);
  const kunden = (daten?.kunden || []).filter((k) => k.board === boardId);
  const spalten = status.map((s) => ({
    status: s,
    kunden: kunden.filter((k) => k.status === s.id),
  }));
  // Was keinen gültigen Status trägt, geht nicht verloren.
  const bekannt = new Set(status.map((s) => s.id));
  const heimatlos = kunden.filter((k) => !bekannt.has(k.status));
  if (heimatlos.length) {
    spalten.push({ status: { id: null, name: 'Ohne Status', farbe: 'grau' }, kunden: heimatlos });
  }
  return spalten;
}

/** Suche über Name, Firma, Notiz und Updates. */
export function passt(kunde, suche) {
  const q = String(suche || '').trim().toLowerCase();
  if (!q) return true;
  const heu = [kunde.name, kunde.firma, kunde.kontakt, kunde.notiz,
    ...(kunde.updates || []).map((u) => u.text),
    ...(kunde.todos || []).map((t) => t.titel)].join(' ').toLowerCase();
  return q.split(/\s+/).every((teil) => heu.includes(teil));
}

/** Das jüngste Status-Update – das steht auf der Karte. */
export function letztesUpdate(kunde) {
  const u = [...(kunde?.updates || [])].sort((a, b) => String(b.datum).localeCompare(String(a.datum)));
  return u[0] || null;
}

export const offeneTodos = (kunde) => (kunde?.todos || []).filter((t) => !t.erledigt).length;

export const heuteISO = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
};

export const istUeberfaellig = (todo, heute = heuteISO()) =>
  Boolean(todo && !todo.erledigt && todo.faellig && todo.faellig < heute);

/* ---------------------------------------------------------- Kennzahlen */

export function zahlen(daten, heute = heuteISO()) {
  const kunden = daten?.kunden || [];
  const todos = kunden.flatMap((k) => k.todos || []);
  return {
    kunden: kunden.length,
    boards: (daten?.boards || []).length,
    offeneTodos: todos.filter((t) => !t.erledigt).length,
    ueberfaellig: todos.filter((t) => istUeberfaellig(t, heute)).length,
    ohneUpdate: kunden.filter((k) => !(k.updates || []).length).length,
  };
}

/** Was zuletzt passiert ist – über alle Kunden hinweg. */
export function verlauf(daten, anzahl = 8) {
  return (daten?.kunden || [])
    .flatMap((k) => (k.updates || []).map((u) => ({ ...u, kunde: k.name, kundeId: k.id })))
    .sort((a, b) => String(b.datum).localeCompare(String(a.datum)) || String(b.id).localeCompare(String(a.id)))
    .slice(0, anzahl);
}
