/* ==========================================================================
   Alena – To-Dos
   Reine Logik: Sortierung, Gedächtnis für häufige Einträge, Vorschläge.
   ========================================================================== */

export const PRIOS = [
  { id: 'hoch',   label: 'Hoch',   rang: 0 },
  { id: 'normal', label: 'Normal', rang: 1 },
  { id: 'tief',   label: 'Tief',   rang: 2 },
];
export const PRIO_IDS = PRIOS.map((p) => p.id);
export const istPrio = (id) => PRIO_IDS.includes(id);
export const prioLabel = (id) => PRIOS.find((p) => p.id === id)?.label || 'Normal';
const prioRang = (id) => PRIOS.find((p) => p.id === id)?.rang ?? 1;

export const SORTIERUNGEN = [
  { id: 'manuell',    label: 'Eigene Reihenfolge' },
  { id: 'faellig',    label: 'Fälligkeit' },
  { id: 'prioritaet', label: 'Priorität' },
  { id: 'alpha',      label: 'Alphabetisch' },
  { id: 'neu',        label: 'Zuletzt hinzugefügt' },
];
export const SORT_IDS = SORTIERUNGEN.map((s) => s.id);

/** Ab wie vielen Einträgen gilt etwas als „oft gebraucht“. */
export const OFT_AB = 2;

export const heuteISO = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
};

export function leereTodos() {
  return { version: 1, tasks: [], verlauf: {}, sortierung: 'manuell', updatedAt: null };
}

/** Vergleichsform eines Titels – „Milch kaufen“ und „milch  kaufen“ sind dasselbe. */
export function schluessel(titel) {
  return String(titel || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]+$/g, '')
    .trim();
}

/* ------------------------------------------------------------- Gedächtnis */
/** Merkt sich, dass dieser Eintrag verwendet wurde. */
export function merke(daten, titel, iso = heuteISO()) {
  const k = schluessel(titel);
  if (!k) return daten;
  daten.verlauf ||= {};
  const alt = daten.verlauf[k] || { titel: String(titel).trim(), anzahl: 0, zuletzt: null, favorit: false };
  daten.verlauf[k] = {
    ...alt,
    titel: String(titel).trim(),
    anzahl: alt.anzahl + 1,
    zuletzt: iso,
  };
  return daten;
}

export const wieOft = (daten, titel) => daten?.verlauf?.[schluessel(titel)]?.anzahl || 0;
export const istOft = (daten, titel) => wieOft(daten, titel) >= OFT_AB;

/**
 * Vorschläge unter dem Eingabefeld: was oft eingetragen wurde und gerade
 * nicht offen ist. Häufigstes zuerst, bei Gleichstand das Neuere.
 */
export function vorschlaege(daten, anzahl = 6) {
  const offen = new Set((daten?.tasks || [])
    .filter((t) => t.status !== 'erledigt')
    .map((t) => schluessel(t.titel)));

  return Object.entries(daten?.verlauf || {})
    .filter(([k, v]) => v.anzahl >= OFT_AB && !offen.has(k))
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.anzahl - a.anzahl || String(b.zuletzt).localeCompare(String(a.zuletzt)))
    .slice(0, anzahl);
}

/* ------------------------------------------------------------- Sortierung */
export function sortiere(tasks, modus = 'manuell') {
  const liste = [...(tasks || [])];
  const spaet = '9999-12-31';

  switch (modus) {
    case 'faellig':
      return liste.sort((a, b) =>
        (a.faellig || spaet).localeCompare(b.faellig || spaet)
        || prioRang(a.prioritaet) - prioRang(b.prioritaet)
        || a.titel.localeCompare(b.titel, 'de'));
    case 'prioritaet':
      return liste.sort((a, b) =>
        prioRang(a.prioritaet) - prioRang(b.prioritaet)
        || (a.faellig || spaet).localeCompare(b.faellig || spaet)
        || a.titel.localeCompare(b.titel, 'de'));
    case 'alpha':
      return liste.sort((a, b) => a.titel.localeCompare(b.titel, 'de'));
    case 'neu':
      return liste.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    default:
      return liste;   // eigene Reihenfolge: so, wie sie gespeichert ist
  }
}

/* ------------------------------------------------------------ Einteilung */
export const istOffen = (t) => t?.status !== 'erledigt';
export const istUeberfaellig = (t, heute = heuteISO()) =>
  istOffen(t) && Boolean(t?.faellig) && t.faellig < heute;

/**
 * Teilt die Aufgaben in die Abschnitte der Oberfläche.
 * Überfällige zuerst, darunter die oft gebrauchten ganz oben – genau die
 * gehen im Alltag am ehesten unter.
 */
export function abschnitte(daten, heute = heuteISO()) {
  const alle = daten?.tasks || [];
  const modus = SORT_IDS.includes(daten?.sortierung) ? daten.sortierung : 'manuell';

  const ueberfaellig = sortiere(alle.filter((t) => istUeberfaellig(t, heute)), 'faellig')
    .sort((a, b) => (istOft(daten, b.titel) ? 1 : 0) - (istOft(daten, a.titel) ? 1 : 0));

  const ueberIds = new Set(ueberfaellig.map((t) => t.id));
  const offen = alle.filter((t) => istOffen(t) && !ueberIds.has(t.id));

  return {
    ueberfaellig,
    favoriten: sortiere(offen.filter((t) => t.favorit), modus),
    offen: sortiere(offen.filter((t) => !t.favorit), modus),
    erledigt: alle.filter((t) => !istOffen(t))
      .sort((a, b) => String(b.erledigtAt).localeCompare(String(a.erledigtAt))),
  };
}

/** Zahlen für die Kopfzeile. */
export function zahlen(daten, heute = heuteISO()) {
  const a = daten?.tasks || [];
  return {
    offen: a.filter(istOffen).length,
    ueberfaellig: a.filter((t) => istUeberfaellig(t, heute)).length,
    heute: a.filter((t) => istOffen(t) && t.faellig === heute).length,
    erledigt: a.filter((t) => !istOffen(t)).length,
  };
}
