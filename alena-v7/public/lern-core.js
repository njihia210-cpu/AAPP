/* ==========================================================================
   Alena – Lernatelier, reine Logik
   Übungsarten, Fragenbau, Antwortprüfung, Tipps und Wiederholung nach Leitner.
   Kein DOM, damit sich alles einzeln prüfen lässt.
   ========================================================================== */

export const MODI = [
  { id: 'karteikarten', name: 'Karteikarten', icon: '🃏',
    text: 'Wort ansehen, selbst einschätzen, umdrehen.', braucht: 1 },
  { id: 'auswahl',      name: 'Auswahl',      icon: '🎯',
    text: 'Aus vier Möglichkeiten die richtige antippen.', braucht: 4 },
  { id: 'tippen',       name: 'Tippen',       icon: '⌨️',
    text: 'Selber schreiben – mit Tipp, wenn es klemmt.', braucht: 1 },
  { id: 'satzbau',      name: 'Satzbau',      icon: '🧩',
    text: 'Die Wendung aus vorgegebenen Bausteinen zusammensetzen.', braucht: 1, mehrwort: true },
  { id: 'zuordnen',     name: 'Zuordnen',     icon: '🔗',
    text: 'Fünf Paare möglichst schnell verbinden.', braucht: 5 },
  { id: 'hoeren',       name: 'Hören',        icon: '🔊',
    text: 'Alena spricht französisch – du schreibst mit.', braucht: 1 },
];
export const MODUS_IDS = MODI.map((m) => m.id);
export const istModus = (id) => MODUS_IDS.includes(id);

export const RICHTUNGEN = [
  { id: 'fr-de', name: 'Französisch → Deutsch' },
  { id: 'de-fr', name: 'Deutsch → Französisch' },
  { id: 'misch', name: 'Gemischt' },
];

/* ------------------------------------------------------------ Textarbeit */

/** Akzente, Artikel und Hinweise weg – so wird verglichen, nicht schikaniert. */
export function normalisiere(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // Akzente
    .toLowerCase()
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/ß/g, 'ss')
    .replace(/\((?:m\.|f\.|m\. ?& ?f\.|pl\.)\)/g, '')   // (m.) (f.)
    .replace(/[’']/g, "'")
    .replace(/[.,;:!?"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Zusätzlich den Artikel abstreifen – „le livre“ und „livre“ sind beide recht. */
export function ohneArtikel(s) {
  return normalisiere(s)
    .replace(/^(le|la|les|l'|un|une|des|du|de la|der|die|das|ein|eine|einen|einem)\s*/i, '')
    .replace(/^(se|s'|sich|zu)\s*/i, '')
    .trim();
}

/** Mehrere Übersetzungen: „der Bruder / der Halbbruder“ oder „tun, machen“. */
export function varianten(s) {
  return String(s || '')
    .split(/\s*[\/,]\s*|\s+oder\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Wie weit liegen zwei Wörter auseinander? (Levenshtein) */
export function abstand(a, b) {
  a = String(a); b = String(b);
  if (a === b) return 0;
  const vor = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let jetzt = [i + 1];
    for (let j = 0; j < b.length; j++) {
      jetzt.push(Math.min(vor[j + 1] + 1, jetzt[j] + 1, vor[j] + (a[i] === b[j] ? 0 : 1)));
    }
    for (let j = 0; j <= b.length; j++) vor[j] = jetzt[j];
  }
  return vor[b.length];
}

/**
 * Antwort prüfen.
 * 'richtig'  – stimmt
 * 'fast'     – ein Tippfehler oder ein Akzent daneben; zählt als richtig,
 *              aber die richtige Schreibweise wird gezeigt
 * 'falsch'   – daneben
 */
export function pruefe(eingabe, erwartet) {
  const e = normalisiere(eingabe);
  if (!e) return 'falsch';

  const ziele = varianten(erwartet);
  const formen = new Set();
  for (const z of ziele) { formen.add(normalisiere(z)); formen.add(ohneArtikel(z)); }
  formen.add(normalisiere(erwartet));
  formen.delete('');

  // Akzente und Artikel dürfen fehlen – das ist beim Abfragen kein Fehler.
  if (formen.has(e) || formen.has(ohneArtikel(eingabe))) return 'richtig';
  for (const f of formen) {
    const grenze = f.length <= 4 ? 0 : f.length <= 8 ? 1 : 2;
    if (grenze && abstand(e, f) <= grenze) return 'fast';
    if (grenze && abstand(ohneArtikel(eingabe), f) <= grenze) return 'fast';
  }
  return 'falsch';
}

/* ----------------------------------------------------------------- Tipps */

/**
 * Gestufter Tipp: erst die Form, dann Buchstaben, zuletzt fast alles.
 * stufe 1..3 – danach bleibt es bei Stufe 3.
 */
export function tipp(loesung, stufe = 1) {
  const wort = String(loesung || '');
  if (stufe <= 1) {
    const teile = wort.split(' ').map((w) => (w.length <= 2 ? w : w[0] + '·'.repeat(w.length - 1)));
    return teile.join(' ');
  }
  const anteil = stufe === 2 ? 0.4 : 0.7;
  return wort.split(' ').map((w) => {
    if (w.length <= 2) return w;
    const zeigen = Math.max(1, Math.round(w.length * anteil));
    return w.slice(0, zeigen) + '·'.repeat(w.length - zeigen);
  }).join(' ');
}

/* ------------------------------------------------------------- Auswählen */

/** Zufällige Reihenfolge – mit optionalem Startwert, damit Tests stabil sind. */
export function mische(liste, zufall = Math.random) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Kleiner, wiederholbarer Zufall (für Tests und für „gleiche Runde nochmals“). */
export function saat(zahl) {
  let s = zahl >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** Welche Wörter passen zur Auswahl aus Kapiteln und Niveaus? */
export function auswahl(alleWoerter, { kapitel = [], niveaus = [] } = {}) {
  const kSet = new Set(kapitel);
  const nSet = new Set(niveaus);
  return alleWoerter.filter((w) =>
    (kSet.size === 0 || kSet.has(w.kapitel)) && (nSet.size === 0 || nSet.has(w.niveau)));
}

/** Ab wie vielen Wörtern lohnt sich der Satzbau? Darunter ist es kein Satz. */
export const MINDESTLAENGE = 3;

/**
 * Welche Wörter taugen für diese Übungsart?
 * Satzbau braucht ganze Wendungen – „boire“ aus zwei Bausteinen zu legen
 * wäre keine Übung.
 */
export function fuerModus(woerter, modus) {
  if (modus !== 'satzbau') return woerter;
  return woerter.filter((w) => w.fr.trim().split(/\s+/).length >= MINDESTLAENGE);
}

/** Welche Übungsarten sind mit diesem Vorrat überhaupt sinnvoll? */
export function moegliche(woerter) {
  return MODI.filter((m) => fuerModus(woerter, m.id).length >= (m.mehrwort ? 4 : m.braucht))
    .map((m) => m.id);
}

/* ------------------------------------------------- Wiederholung (Leitner) */

/** Fünf Fächer: je weiter hinten, desto seltener kommt das Wort wieder. */
export const FAECHER = [0, 1, 2, 3, 4];
const ABSTAND_TAGE = [0, 1, 3, 7, 21];

export const heuteISO = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
};

const plusTage = (iso, tage) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
};

export function leereFortschritt() {
  return { version: 1, fach: 'franzoesisch', karten: {}, sitzungen: [], updatedAt: null };
}

/** Nach einer Antwort das Fach setzen und den nächsten Termin ausrechnen. */
export function nachAntwort(karte, richtig, heute = heuteISO()) {
  const alt = karte || { fach: 0, richtig: 0, falsch: 0 };
  const fach = richtig ? Math.min(4, (alt.fach ?? 0) + 1) : 0;
  return {
    fach,
    richtig: (alt.richtig || 0) + (richtig ? 1 : 0),
    falsch: (alt.falsch || 0) + (richtig ? 0 : 1),
    zuletzt: heute,
    faellig: plusTage(heute, ABSTAND_TAGE[fach]),
  };
}

export const istFaellig = (karte, heute = heuteISO()) =>
  !karte || !karte.faellig || karte.faellig <= heute;

/**
 * Die Runde zusammenstellen: Fälliges zuerst, dann Neues, dann der Rest.
 * So wird wiederholt, was ansteht, ohne dass Neues liegen bleibt.
 */
export function runde(woerter, fortschritt, anzahl = 20, zufall = Math.random, heute = heuteISO()) {
  const karten = fortschritt?.karten || {};
  const faellig = [], neu = [], rest = [];
  for (const w of woerter) {
    const k = karten[w.id];
    if (!k) neu.push(w);
    else if (istFaellig(k, heute)) faellig.push(w);
    else rest.push(w);
  }
  const zieh = [...mische(faellig, zufall), ...mische(neu, zufall), ...mische(rest, zufall)];
  return zieh.slice(0, Math.max(1, anzahl));
}

/* ------------------------------------------------------------- Fragenbau */

const frage_de = (w) => w.de;
const frage_fr = (w) => w.fr;

/** Welche Richtung gilt für dieses Wort? */
export function richtungFuer(modus, richtung, zufall = Math.random) {
  if (modus === 'satzbau' || modus === 'hoeren') return 'de-fr';   // Ziel ist immer Französisch
  if (richtung === 'misch') return zufall() < 0.5 ? 'fr-de' : 'de-fr';
  return richtung;
}

/** Ablenker für die Auswahl – aus demselben Kapitel, damit es fordert. */
export function ablenker(wort, vorrat, feld, anzahl = 3, zufall = Math.random) {
  const richtig = normalisiere(wort[feld]);
  const gleich = vorrat.filter((w) => w.kapitel === wort.kapitel && normalisiere(w[feld]) !== richtig);
  const andere = vorrat.filter((w) => w.kapitel !== wort.kapitel && normalisiere(w[feld]) !== richtig);
  const gesehen = new Set([richtig]);
  const out = [];
  for (const w of [...mische(gleich, zufall), ...mische(andere, zufall)]) {
    const n = normalisiere(w[feld]);
    if (gesehen.has(n)) continue;
    gesehen.add(n); out.push(w[feld]);
    if (out.length >= anzahl) break;
  }
  return out;
}

/** Bausteine für den Satzbau: die richtigen Wörter plus ein paar Störer. */
export function bausteine(wort, vorrat, zufall = Math.random) {
  // Reine Satzzeichen wären unhandliche Bausteine – die Prüfung ignoriert sie ohnehin.
  const teile = wort.fr.trim().split(/\s+/).filter((t) => /[a-zA-ZÀ-ÿ0-9]/.test(t));
  const stoerer = [];
  const kandidaten = mische(vorrat.filter((w) => w.id !== wort.id), zufall);
  for (const w of kandidaten) {
    for (const t of w.fr.trim().split(/\s+/)) {
      if (!teile.includes(t) && !stoerer.includes(t) && t.length > 1) { stoerer.push(t); break; }
    }
    if (stoerer.length >= Math.min(3, Math.max(1, teile.length - 1))) break;
  }
  return { teile, steine: mische([...teile, ...stoerer], zufall) };
}

/** Eine einzelne Aufgabe bauen. */
export function baueFrage(wort, { modus, richtung = 'fr-de', vorrat = [], zufall = Math.random }) {
  const r = richtungFuer(modus, richtung, zufall);
  const frageFeld = r === 'fr-de' ? 'fr' : 'de';
  const antwortFeld = r === 'fr-de' ? 'de' : 'fr';
  const basis = {
    id: wort.id, modus, richtung: r, wort,
    frage: r === 'fr-de' ? frage_fr(wort) : frage_de(wort),
    loesung: wort[antwortFeld],
    sprechen: r === 'de-fr' || modus === 'hoeren' ? wort.fr : null,
  };

  if (modus === 'auswahl') {
    const falsche = ablenker(wort, vorrat, antwortFeld, 3, zufall);
    return { ...basis, optionen: mische([wort[antwortFeld], ...falsche], zufall) };
  }
  if (modus === 'satzbau') {
    const { teile, steine } = bausteine(wort, vorrat, zufall);
    return { ...basis, frage: wort.de, loesung: wort.fr, teile, steine };
  }
  if (modus === 'hoeren') {
    return { ...basis, frage: '', loesung: wort.fr, sprechen: wort.fr, verstecktBis: 'antwort' };
  }
  return basis;
}

/** Die ganze Runde als Aufgabenliste. */
export function baueRunde(woerter, { modus, richtung = 'fr-de', vorrat = [], zufall = Math.random }) {
  const material = vorrat.length ? vorrat : woerter;
  if (modus === 'zuordnen') {
    // Zuordnen läuft in Fünferpaketen statt Frage für Frage.
    const pakete = [];
    for (let i = 0; i < woerter.length; i += 5) {
      const teil = woerter.slice(i, i + 5);
      if (teil.length < 2) break;
      pakete.push({ modus, paare: teil, links: mische(teil, zufall), rechts: mische(teil, zufall) });
    }
    return pakete;
  }
  return woerter.map((w) => baueFrage(w, { modus, richtung, vorrat: material, zufall }));
}

/* -------------------------------------------------------------- Auswertung */

export function bilanz(antworten) {
  const gesamt = antworten.length;
  const richtig = antworten.filter((a) => a.ergebnis === 'richtig').length;
  const fast = antworten.filter((a) => a.ergebnis === 'fast').length;
  return {
    gesamt, richtig, fast,
    falsch: gesamt - richtig - fast,
    quote: gesamt ? Math.round(((richtig + fast) / gesamt) * 100) : 0,
  };
}

export function lob(quote) {
  if (quote >= 95) return 'Sitzt.';
  if (quote >= 80) return 'Sehr ordentlich.';
  if (quote >= 60) return 'Geht voran – die Fehler kommen bald wieder dran.';
  if (quote >= 35) return 'Noch wacklig. Nimm dieselben Kapitel gleich nochmals.';
  return 'Das war neu für dich. Fang mit Karteikarten an, dann wird es leichter.';
}

/** Wie steht es um die gewählten Kapitel? */
export function stand(woerter, fortschritt, heute = heuteISO()) {
  const karten = fortschritt?.karten || {};
  let gelernt = 0, sitzt = 0, faellig = 0;
  for (const w of woerter) {
    const k = karten[w.id];
    if (!k) continue;
    gelernt++;
    if (k.fach >= 4) sitzt++;
    if (istFaellig(k, heute)) faellig++;
  }
  return {
    gesamt: woerter.length, gelernt, sitzt, faellig,
    neu: woerter.length - gelernt,
    anteil: woerter.length ? Math.round((gelernt / woerter.length) * 100) : 0,
  };
}
