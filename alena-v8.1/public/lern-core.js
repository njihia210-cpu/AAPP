/* ==========================================================================
   Alena – Lernatelier, reine Logik
   Übungsarten, Fragenbau, Antwortprüfung, Tipps und Wiederholung nach Leitner.
   Kein DOM, damit sich alles einzeln prüfen lässt.
   ========================================================================== */

export const MODI = [
  { id: 'stufen',       name: 'Aufbau',       icon: '🪜',
    text: 'Erst wiedererkennen, dann selber schreiben – je nachdem, wie gut ein Wort sitzt.', braucht: 4 },
  { id: 'karteikarten', name: 'Karteikarten', icon: '🃏',
    text: 'Ansehen, selbst einschätzen, umdrehen.', braucht: 1 },
  { id: 'auswahl',      name: 'Auswahl',      icon: '🎯',
    text: 'Aus vier Möglichkeiten die richtige antippen.', braucht: 4 },
  { id: 'tippen',       name: 'Tippen',       icon: '⌨️',
    text: 'Selber schreiben – mit Tipp, wenn es klemmt.', braucht: 1 },
  { id: 'satzbau',      name: 'Satzbau',      icon: '🧩',
    text: 'Aus vorgegebenen Bausteinen zusammensetzen.', braucht: 1, mehrwort: true },
  { id: 'zuordnen',     name: 'Zuordnen',     icon: '🔗',
    text: 'Fünf Paare möglichst schnell verbinden.', braucht: 5 },
  { id: 'hoeren',       name: 'Hören',        icon: '🔊',
    text: 'Alena liest vor – du schreibst mit.', braucht: 1 },
  { id: 'grafik',       name: 'Vorsorgegrafik', icon: '📊',
    text: 'Die Phasen in die richtige Reihenfolge bringen.', braucht: 1, faelle: true },
];
export const MODUS_IDS = MODI.map((m) => m.id);
export const istModus = (id) => MODUS_IDS.includes(id);

export const RICHTUNGEN = [
  { id: 'fr-de', name: 'Vorderseite → Rückseite' },
  { id: 'de-fr', name: 'Rückseite → Vorderseite' },
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
/** Nur die Ziffern – „4'713“, „4713“ und „4 713“ sind dieselbe Zahl. */
export function zahlform(s) {
  const t = String(s || '');
  if (!/\d/.test(t)) return null;
  const nur = t.replace(/[^0-9]/g, '');
  return nur || null;
}

export function pruefe(eingabe, erwartet) {
  const e = normalisiere(eingabe);
  if (!e) return 'falsch';

  // Reine Zahlenantworten zuerst: Trennzeichen und Währung spielen keine Rolle.
  const zEin = zahlform(eingabe), zSoll = zahlform(erwartet);
  if (zEin && zSoll && !/[a-zà-ÿ]{3}/i.test(normalisiere(erwartet))) {
    return zEin === zSoll ? 'richtig' : 'falsch';
  }

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

/** Was länger ist, tippt niemand ab – dafür sind Karteikarten da. */
export const MAX_TIPPEN = 60;

/**
 * Welche Einträge taugen für diese Übungsart?
 * Satzbau braucht ganze Wendungen; Tippen und Hören brauchen kurze Antworten –
 * einen dreizeiligen Merksatz abzuschreiben übt nichts.
 */
export function fuerModus(items, modus) {
  if (modus === 'satzbau') {
    return items.filter((w) => w.vorne.trim().split(/\s+/).length >= MINDESTLAENGE
      && w.vorne.length <= MAX_TIPPEN);
  }
  if (modus === 'tippen' || modus === 'hoeren') {
    return items.filter((w) => w.vorne.length <= MAX_TIPPEN && w.hinten.length <= MAX_TIPPEN);
  }
  return items;
}

/**
 * Welche Übungsarten sind mit diesem Vorrat überhaupt sinnvoll?
 * `erlaubt` grenzt zusätzlich auf das ein, was das Fach anbietet – Hören
 * ergibt nur dort Sinn, wo eine Sprache hinterlegt ist.
 */
export function moegliche(items, erlaubt = null, faelle = 0) {
  return MODI
    .filter((m) => !erlaubt || erlaubt.includes(m.id))
    .filter((m) => (m.faelle
      ? faelle >= 1
      : fuerModus(items, m.id).length >= (m.mehrwort ? 4 : m.braucht)))
    .map((m) => m.id);
}

/* ------------------------------------------------------------- Stufen */

/**
 * Der Aufbau-Modus: Ein Wort wird zuerst nur wiedererkannt, dann in der
 * schwierigeren Richtung gewählt – und erst wenn es mehrfach richtig war,
 * muss es geschrieben werden.
 * `ab` ist der Leitner-Stand, ab dem die Stufe gilt.
 */
export const STUFEN = [
  { nr: 1, ab: 0, modus: 'auswahl', richtung: 'fr-de', name: 'Erkennen',
    text: 'Aus vier Möglichkeiten wählen.' },
  { nr: 2, ab: 2, modus: 'auswahl', richtung: 'de-fr', name: 'Umgekehrt',
    text: 'Jetzt andersherum – die Vorderseite ist gesucht.' },
  { nr: 3, ab: 3, modus: 'tippen',  richtung: 'de-fr', name: 'Schreiben',
    text: 'Sitzt. Jetzt selber schreiben.' },
];

/** Welche Stufe gilt für diese Karte? */
export function stufeFuer(karte) {
  const stand = Math.max(0, Number(karte?.fach) || 0);
  let treffer = STUFEN[0];
  for (const st of STUFEN) if (stand >= st.ab) treffer = st;
  return treffer;
}

/** Gilt das Wort als gesessen – also reif zum Schreiben? */
export const sitzt = (karte) => stufeFuer(karte).nr >= STUFEN.length;

/* ------------------------------------------------- Wiederholung (Leitner) */

/** Fünf Leitner-Kästchen: je weiter hinten, desto seltener kommt die Karte wieder. */
export const KAESTCHEN = [0, 1, 2, 3, 4];
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
  return { version: 1, karten: {}, sitzungen: [], stand: [], updatedAt: null };
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

/**
 * Welche Richtung gilt für diese Aufgabe?
 * Satzbau und Hören zielen immer auf die Vorderseite – dort steht die
 * Fremdsprache beziehungsweise der Fachbegriff.
 */
export function richtungFuer(modus, richtung, zufall = Math.random) {
  if (modus === 'satzbau' || modus === 'hoeren' || modus === 'grafik') return 'de-fr';
  if (richtung === 'misch') return zufall() < 0.5 ? 'fr-de' : 'de-fr';
  return richtung;
}

/** Welche Gestalt hat diese Antwort? Zahl, Prozent oder Text. */
export function gestalt(s) {
  const t = String(s || '').trim();
  if (/%/.test(t)) return 'prozent';
  if (/^[\d'’ .]+$/.test(t) && /\d/.test(t)) return 'zahl';
  return 'text';
}

/**
 * Ablenker für die Auswahl.
 * Aus demselben Kapitel, damit es fordert – und von derselben Gestalt, damit
 * die Lösung nicht schon daran zu erkennen ist, dass sie als Einzige eine
 * Zahl ist.
 */
export function ablenker(wort, vorrat, feld, anzahl = 3, zufall = Math.random) {
  const richtig = normalisiere(wort[feld]);
  const form = gestalt(wort[feld]);
  const passt = (w) => gestalt(w[feld]) === form;
  const brauchbar = (w) => normalisiere(w[feld]) !== richtig;

  const imKapitel = vorrat.filter((w) => w.kapitel === wort.kapitel && brauchbar(w));
  const auswaerts = vorrat.filter((w) => w.kapitel !== wort.kapitel && brauchbar(w));

  // Reihenfolge der Vorliebe: gleiches Kapitel und gleiche Gestalt zuerst.
  const stufen = [
    imKapitel.filter(passt), auswaerts.filter(passt),
    imKapitel.filter((w) => !passt(w)), auswaerts.filter((w) => !passt(w)),
  ];

  const gesehen = new Set([richtig]);
  const out = [];
  for (const stufe of stufen) {
    for (const w of mische(stufe, zufall)) {
      const n = normalisiere(w[feld]);
      if (gesehen.has(n)) continue;
      gesehen.add(n); out.push(w[feld]);
      if (out.length >= anzahl) return out;
    }
  }
  return out;
}

/** Bausteine für den Satzbau: die richtigen Wörter plus ein paar Störer. */
export function bausteine(wort, vorrat, zufall = Math.random) {
  // Reine Satzzeichen wären unhandliche Bausteine – die Prüfung ignoriert sie ohnehin.
  const teile = wort.vorne.trim().split(/\s+/).filter((t) => /[a-zA-ZÀ-ÿ0-9]/.test(t));
  const stoerer = [];
  const kandidaten = mische(vorrat.filter((w) => w.id !== wort.id), zufall);
  for (const w of kandidaten) {
    for (const t of w.vorne.trim().split(/\s+/)) {
      if (!teile.includes(t) && !stoerer.includes(t) && t.length > 1) { stoerer.push(t); break; }
    }
    if (stoerer.length >= Math.min(3, Math.max(1, teile.length - 1))) break;
  }
  return { teile, steine: mische([...teile, ...stoerer], zufall) };
}

/** Eine einzelne Aufgabe bauen. */
export function baueFrage(wort, { modus, richtung = 'fr-de', vorrat = [], zufall = Math.random }) {
  const r = richtungFuer(modus, richtung, zufall);
  const antwortFeld = r === 'fr-de' ? 'hinten' : 'vorne';
  const basis = {
    id: wort.id, modus, richtung: r, wort,
    frage: r === 'fr-de' ? wort.vorne : wort.hinten,
    loesung: wort[antwortFeld],
    // Vorgelesen wird nur, was eine Sprache hinterlegt hat (Französisch).
    sprechen: wort.sprich && (r === 'de-fr' || modus === 'hoeren') ? wort.sprich : null,
  };

  if (modus === 'auswahl') {
    const falsche = ablenker(wort, vorrat, antwortFeld, 3, zufall);
    return { ...basis, optionen: mische([wort[antwortFeld], ...falsche], zufall) };
  }
  if (modus === 'satzbau') {
    const { teile, steine } = bausteine(wort, vorrat, zufall);
    return { ...basis, frage: wort.hinten, loesung: wort.vorne, teile, steine };
  }
  if (modus === 'hoeren') {
    return { ...basis, frage: '', loesung: wort.vorne, sprechen: wort.sprich || wort.vorne };
  }
  return basis;
}

/**
 * Aufgaben für die Vorsorgegrafik: die Phasen eines Falls in die richtige
 * Reihenfolge bringen. Gelernt wird die Treppe, nicht ein einzelner Wert.
 */
export function baueGrafik(faelle, zufall = Math.random) {
  return mische(faelle, zufall).map((f) => ({
    modus: 'grafik',
    fall: f,
    frage: f.titel,
    aufgabe: f.aufgabe || 'Bring die Phasen in die richtige Reihenfolge.',
    reihenfolge: f.phasen.map((p) => p.phase),
    steine: mische(f.phasen.map((p) => p.phase), zufall),
    phasen: f.phasen,
  }));
}

/**
 * Eine Aufgabe im Aufbau-Modus: Die Übungsart richtet sich danach, wie gut
 * das Wort schon sitzt. Lange Antworten werden nie abgetippt – dort bleibt
 * es bei der Karteikarte.
 */
export function baueStufe(wort, { fortschritt, vorrat, zufall = Math.random }) {
  const st = stufeFuer(fortschritt?.karten?.[wort.id]);
  let modus = st.modus;
  if (modus === 'tippen' && (wort.vorne.length > MAX_TIPPEN || wort.hinten.length > MAX_TIPPEN)) {
    modus = 'karteikarten';
  }
  if (modus === 'auswahl' && vorrat.length < 4) modus = 'karteikarten';
  const aufgabe = baueFrage(wort, { modus, richtung: st.richtung, vorrat, zufall });
  return { ...aufgabe, stufe: st };
}

/** Die ganze Runde als Aufgabenliste. */
export function baueRunde(woerter, { modus, richtung = 'fr-de', vorrat = [], zufall = Math.random, faelle = [], fortschritt = null }) {
  const material = vorrat.length ? vorrat : woerter;
  if (modus === 'grafik') return baueGrafik(faelle, zufall);
  if (modus === 'stufen') {
    return woerter.map((w) => baueStufe(w, { fortschritt, vorrat: material, zufall }));
  }
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

/**
 * Lernstand in Prozent.
 * Jede Karte kann fünf Stufen füllen; erst wenn alles im obersten Kästchen
 * liegt, sind es 100 %. Das wächst langsamer als „schon mal angeschaut“,
 * beschreibt den Stand aber ehrlich.
 */
export function prozent(items, fortschritt) {
  const karten = fortschritt?.karten || {};
  if (!items.length) return 0;
  let summe = 0;
  for (const i of items) summe += Math.min(4, Math.max(0, Number(karten[i.id]?.fach) || 0));
  return Math.round((summe / (items.length * 4)) * 100);
}

/** Zusammenfassung eines Unterfachs – wird im Konto abgelegt. */
export function zusammenfassung(items, fortschritt, { fach, unterfach }, heute = heuteISO()) {
  const s = stand(items, fortschritt, heute);
  const karten = fortschritt?.karten || {};
  return {
    fach, unterfach,
    gesamt: s.gesamt,
    gelernt: s.gelernt,
    sitzt: items.filter((i) => sitzt(karten[i.id])).length,
    faellig: s.faellig,
    prozent: prozent(items, fortschritt),
    aktualisiert: heute,
  };
}

/* ------------------------------------------------------------- Lernplan */

export function leererPlan() {
  return { aktiv: false, fach: null, unterfach: null, ziel: null, wochentage: [1, 2, 3, 4, 5], proTag: 20 };
}

/** Wie viele Lerntage liegen zwischen zwei Daten (inklusive beider)? */
export function lerntage(vonISO, bisISO, wochentage = [1, 2, 3, 4, 5]) {
  const tage = new Set(wochentage.map(Number));
  if (!tage.size) return 0;
  const von = new Date(vonISO + 'T00:00:00Z');
  const bis = new Date(bisISO + 'T00:00:00Z');
  if (bis < von) return 0;
  let n = 0;
  for (const d = new Date(von); d <= bis; d.setUTCDate(d.getUTCDate() + 1)) {
    // getUTCDay: 0 = Sonntag. Wir zählen Montag als 1, Sonntag als 7.
    const wt = d.getUTCDay() === 0 ? 7 : d.getUTCDay();
    if (tage.has(wt)) n++;
  }
  return n;
}

/** Wie viel wurde heute schon geübt? */
export function heuteGeuebt(fortschritt, heute = heuteISO()) {
  return (fortschritt?.sitzungen || [])
    .filter((s) => s.datum === heute)
    .reduce((n, s) => n + (s.gesamt || 0), 0);
}

/**
 * Der Stand des Lernplans.
 * `noetig` ist das, was heute nötig wäre, um bis zum Zieldatum durchzukommen –
 * es wächst von selbst, wenn Tage ausgelassen werden.
 */
export function planStand(items, fortschritt, plan, heute = heuteISO()) {
  const karten = fortschritt?.karten || {};
  const offen = items.filter((i) => !sitzt(karten[i.id])).length;
  const tage = plan?.ziel ? lerntage(heute, plan.ziel, plan.wochentage) : 0;
  const geuebt = heuteGeuebt(fortschritt, heute);
  const wunsch = Math.max(1, Number(plan?.proTag) || 20);

  // Ohne Zieldatum gilt schlicht das Wunschpensum.
  const noetig = !plan?.ziel ? wunsch
    : tage <= 0 ? offen
    : Math.max(wunsch, Math.ceil(offen / tage));

  return {
    offen, tage, geuebt,
    noetig: Math.min(noetig, Math.max(offen, 0)),
    rest: Math.max(0, Math.min(noetig, offen) - geuebt),
    geschafft: geuebt >= Math.min(noetig, Math.max(offen, 1)),
    abgelaufen: Boolean(plan?.ziel && plan.ziel < heute),
    fertig: offen === 0,
  };
}

/** Ein Satz, der den Stand des Plans zusammenfasst. */
export function planText(stand) {
  if (stand.fertig) return 'Alles sitzt. Der Plan ist durch.';
  if (stand.abgelaufen) return 'Das Zieldatum ist vorbei – setz ein neues.';
  if (stand.geschafft) return 'Tagespensum geschafft.';
  if (stand.tage === 1) return `Letzter Lerntag – heute noch ${stand.rest}.`;
  return `Heute noch ${stand.rest} von ${stand.noetig}.`;
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
