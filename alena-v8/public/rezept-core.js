/* ==========================================================================
   Alena – Rezeptbuch, reine Logik
   Zutaten skalieren, Schritte ordnen, Suche. Bilder liegen getrennt, damit
   die Liste schnell bleibt.
   ========================================================================== */

export const KATEGORIEN = [
  { id: 'hauptgang', name: 'Hauptgang' },
  { id: 'vorspeise', name: 'Vorspeise' },
  { id: 'dessert',   name: 'Dessert' },
  { id: 'backen',    name: 'Backen' },
  { id: 'suppe',     name: 'Suppe' },
  { id: 'salat',     name: 'Salat' },
  { id: 'getraenk',  name: 'Getränk' },
  { id: 'sonstiges', name: 'Sonstiges' },
];
export const KATEGORIE_IDS = KATEGORIEN.map((k) => k.id);
export const istKategorie = (id) => KATEGORIE_IDS.includes(id);
export const kategorieName = (id) => KATEGORIEN.find((k) => k.id === id)?.name || 'Sonstiges';

/* Einheiten, die sich sinnvoll skalieren lassen. „Prise“ bleibt „Prise“. */
export const EINHEITEN = ['g', 'kg', 'ml', 'dl', 'l', 'EL', 'TL', 'Stk.', 'Bund', 'Prise', 'Päckli', ''];

export function leeresBuch() {
  return { version: 1, rezepte: [], updatedAt: null };
}
export function leereBilder() {
  return { version: 1, bilder: {}, updatedAt: null };
}

/* ------------------------------------------------------------- Mengen */

/** „1/2“, „1,5“ und „1.5“ sollen alle als Zahl ankommen. */
export function zuZahl(wert) {
  if (typeof wert === 'number') return Number.isFinite(wert) ? wert : null;
  const t = String(wert ?? '').trim().replace(',', '.');
  if (!t) return null;
  const bruch = t.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (bruch) {
    const n = Number(bruch[2]);
    return n ? Number(bruch[1]) / n : null;
  }
  const gemischt = t.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (gemischt) {
    const n = Number(gemischt[3]);
    return n ? Number(gemischt[1]) + Number(gemischt[2]) / n : null;
  }
  const z = Number(t);
  return Number.isFinite(z) ? z : null;
}

/** Menge lesbar schreiben: keine krummen Kommastellen, wo es nicht sein muss. */
export function zeigeMenge(zahl) {
  if (zahl === null || zahl === undefined || !Number.isFinite(zahl)) return '';
  const gerundet = Math.round(zahl * 100) / 100;
  if (Number.isInteger(gerundet)) return String(gerundet);
  if (Math.abs(gerundet - 0.5) < 0.001) return '½';
  if (Math.abs(gerundet - 0.25) < 0.001) return '¼';
  if (Math.abs(gerundet - 0.75) < 0.001) return '¾';
  return String(gerundet).replace('.', ',');
}

/**
 * Zutaten auf eine andere Portionenzahl umrechnen.
 * Ohne Menge (z.B. „Salz“) bleibt der Eintrag, wie er ist.
 */
export function skaliere(zutaten, vonPortionen, aufPortionen) {
  const von = Number(vonPortionen) || 1;
  const auf = Number(aufPortionen) || von;
  const faktor = von ? auf / von : 1;
  return (zutaten || []).map((z) => {
    const zahl = zuZahl(z.menge);
    return { ...z, menge: zahl === null ? z.menge : zeigeMenge(zahl * faktor) };
  });
}

/* -------------------------------------------------------------- Suche */

export function passt(rezept, suche) {
  const q = String(suche || '').trim().toLowerCase();
  if (!q) return true;
  const heu = [
    rezept.titel, rezept.notiz, kategorieName(rezept.kategorie),
    ...(rezept.zutaten || []).map((z) => z.name),
    ...(rezept.schritte || []).map((s) => s.text),
  ].join(' ').toLowerCase();
  return q.split(/\s+/).every((teil) => heu.includes(teil));
}

export const SORTIERUNGEN = [
  { id: 'neu',   label: 'Zuletzt hinzugefügt' },
  { id: 'alpha', label: 'Alphabetisch' },
  { id: 'dauer', label: 'Nach Dauer' },
  { id: 'oft',   label: 'Am häufigsten gekocht' },
];
export const SORT_IDS = SORTIERUNGEN.map((s) => s.id);

export function sortiere(rezepte, modus = 'neu') {
  const liste = [...(rezepte || [])];
  switch (modus) {
    case 'alpha': return liste.sort((a, b) => a.titel.localeCompare(b.titel, 'de'));
    case 'dauer': return liste.sort((a, b) => (a.dauerMin || 9999) - (b.dauerMin || 9999));
    case 'oft':   return liste.sort((a, b) => (b.gekocht || 0) - (a.gekocht || 0));
    default:      return liste.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }
}

/** Favoriten zuerst, danach die gewählte Reihenfolge. */
export function abschnitte(buch, { suche = '', sortierung = 'neu' } = {}) {
  const treffer = (buch?.rezepte || []).filter((r) => passt(r, suche));
  return {
    favoriten: sortiere(treffer.filter((r) => r.favorit), sortierung),
    uebrige: sortiere(treffer.filter((r) => !r.favorit), sortierung),
    gesamt: treffer.length,
  };
}

/* ------------------------------------------------------------ Kochmodus */

/**
 * Die Seiten des Kochmodus: zuerst die Zutaten, dann jeder Schritt einzeln,
 * zum Schluss die Rückmeldung.
 */
export function kochSeiten(rezept, portionen) {
  const zutaten = skaliere(rezept.zutaten, rezept.portionen, portionen);
  return [
    { art: 'zutaten', titel: 'Zutaten', zutaten },
    ...(rezept.schritte || []).map((s, i) => ({
      art: 'schritt', nr: i + 1, von: (rezept.schritte || []).length,
      text: s.text, dauerMin: s.dauerMin || null,
    })),
    { art: 'fertig', titel: 'Guten Appetit' },
  ];
}

export const dauerText = (min) => {
  const m = Number(min) || 0;
  if (!m) return '';
  if (m < 60) return `${m} Min.`;
  const std = Math.floor(m / 60), rest = m % 60;
  return rest ? `${std} Std. ${rest} Min.` : `${std} Std.`;
};

/** Gesamtdauer: die gepflegte Angabe, sonst die Summe der Schritte. */
export function gesamtdauer(rezept) {
  if (rezept?.dauerMin) return Number(rezept.dauerMin);
  return (rezept?.schritte || []).reduce((n, s) => n + (Number(s.dauerMin) || 0), 0);
}

export function zahlen(buch) {
  const r = buch?.rezepte || [];
  return {
    gesamt: r.length,
    favoriten: r.filter((x) => x.favorit).length,
    mitBild: r.filter((x) => x.bild).length,
    gekocht: r.reduce((n, x) => n + (x.gekocht || 0), 0),
  };
}
