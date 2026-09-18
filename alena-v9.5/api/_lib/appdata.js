import crypto from 'node:crypto';
import { redis } from './redis.js';
import { istStatus, leereZiele } from '../../public/ziele-core.js';
import { istPrio, SORT_IDS, schluessel as titelSchluessel, leereTodos } from '../../public/todo-core.js';
import { istModus, leereFortschritt, leererPlan } from '../../public/lern-core.js';
import {
  istKategorie, SORT_IDS as REZEPT_SORT, leeresBuch, leereBilder,
} from '../../public/rezept-core.js';
import { istBranche, istFarbe, leereArbeit } from '../../public/arbeit-core.js';

/**
 * Allgemeiner Speicher für App-Daten.
 * Jede App bringt hier ihren Prüfer mit; weitere Apps brauchen dadurch
 * keine eigene Serverless Function.
 */

const schluessel = (app, username) => `alena:app:${app}:${username}`;
const kennung = () => crypto.randomBytes(6).toString('hex');
const text = (wert, max) => String(wert ?? '').trim().slice(0, max);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------------ Ziele */
function ziele(eingang) {
  const out = leereZiele();
  const liste = Array.isArray(eingang?.goals) ? eingang.goals.slice(0, 200) : [];

  out.goals = liste.map((z) => {
    const titel = text(z?.titel, 160);
    if (!titel) return null;
    return {
      id: /^[a-f0-9]{6,24}$/.test(z?.id || '') ? z.id : kennung(),
      titel,
      notiz: text(z?.notiz, 800) || undefined,
      status: istStatus(z?.status) ? z.status : 'offen',
      faellig: ISO.test(z?.faellig || '') ? z.faellig : undefined,
      createdAt: typeof z?.createdAt === 'string' ? z.createdAt.slice(0, 40) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schritte: (Array.isArray(z?.schritte) ? z.schritte.slice(0, 100) : [])
        .map((s) => {
          const st = text(s?.titel, 160);
          if (!st) return null;
          return {
            id: /^[a-f0-9]{6,24}$/.test(s?.id || '') ? s.id : kennung(),
            titel: st,
            status: istStatus(s?.status) ? s.status : 'offen',
            createdAt: typeof s?.createdAt === 'string' ? s.createdAt.slice(0, 40) : new Date().toISOString(),
          };
        })
        .filter(Boolean),
    };
  }).filter(Boolean);

  out.updatedAt = new Date().toISOString();
  return out;
}

/* ------------------------------------------------------------------ To-Dos */
function todos(eingang) {
  const out = leereTodos();

  out.sortierung = SORT_IDS.includes(eingang?.sortierung) ? eingang.sortierung : 'manuell';

  out.tasks = (Array.isArray(eingang?.tasks) ? eingang.tasks.slice(0, 500) : [])
    .map((t) => {
      const titel = text(t?.titel, 200);
      if (!titel) return null;
      const erledigt = t?.status === 'erledigt';
      return {
        id: /^[a-f0-9]{6,24}$/.test(t?.id || '') ? t.id : kennung(),
        titel,
        status: erledigt ? 'erledigt' : 'offen',
        prioritaet: istPrio(t?.prioritaet) ? t.prioritaet : 'normal',
        faellig: ISO.test(t?.faellig || '') ? t.faellig : undefined,
        favorit: t?.favorit === true ? true : undefined,
        notiz: text(t?.notiz, 400) || undefined,
        createdAt: typeof t?.createdAt === 'string' ? t.createdAt.slice(0, 40) : new Date().toISOString(),
        erledigtAt: erledigt
          ? (typeof t?.erledigtAt === 'string' ? t.erledigtAt.slice(0, 40) : new Date().toISOString())
          : undefined,
      };
    })
    .filter(Boolean);

  /* Das Gedächtnis: höchstens 300 Einträge, die seltensten fallen weg. */
  const roh = eingang?.verlauf && typeof eingang.verlauf === 'object' ? eingang.verlauf : {};
  const eintraege = Object.entries(roh)
    .map(([k, v]) => {
      const titel = text(v?.titel, 200);
      const key = titelSchluessel(k) || titelSchluessel(titel);
      if (!titel || !key) return null;
      return [key, {
        titel,
        anzahl: Math.min(9999, Math.max(1, Math.round(Number(v?.anzahl) || 1))),
        zuletzt: ISO.test(v?.zuletzt || '') ? v.zuletzt : undefined,
        favorit: v?.favorit === true ? true : undefined,
      }];
    })
    .filter(Boolean)
    .sort((a, b) => b[1].anzahl - a[1].anzahl)
    .slice(0, 300);
  out.verlauf = Object.fromEntries(eintraege);

  out.updatedAt = new Date().toISOString();
  return out;
}

/* ------------------------------------------------------------ Lernatelier */
function lernen(eingang) {
  const out = leereFortschritt();

  /* Der Lernstand je Vokabel. Der Schlüssel ist „kapitel:nummer“. */
  const roh = eingang?.karten && typeof eingang.karten === 'object' ? eingang.karten : {};
  const karten = {};
  for (const [k, v] of Object.entries(roh).slice(0, 4000)) {
    if (!/^[a-z0-9-]{2,60}:\d{1,4}$/.test(k)) continue;
    karten[k] = {
      fach: Math.min(4, Math.max(0, Math.round(Number(v?.fach) || 0))),
      richtig: Math.min(9999, Math.max(0, Math.round(Number(v?.richtig) || 0))),
      falsch: Math.min(9999, Math.max(0, Math.round(Number(v?.falsch) || 0))),
      zuletzt: ISO.test(v?.zuletzt || '') ? v.zuletzt : undefined,
      faellig: ISO.test(v?.faellig || '') ? v.faellig : undefined,
    };
  }
  out.karten = karten;

  /* Die letzten Runden – für den Rückblick auf der Startseite der App. */
  out.sitzungen = (Array.isArray(eingang?.sitzungen) ? eingang.sitzungen.slice(-50) : [])
    .map((s) => ({
      datum: ISO.test(s?.datum || '') ? s.datum : new Date().toISOString().slice(0, 10),
      modus: istModus(s?.modus) ? s.modus : 'karteikarten',
      kapitel: (Array.isArray(s?.kapitel) ? s.kapitel.slice(0, 40) : [])
        .map((k) => text(k, 60)).filter(Boolean),
      gesamt: Math.min(999, Math.max(0, Math.round(Number(s?.gesamt) || 0))),
      richtig: Math.min(999, Math.max(0, Math.round(Number(s?.richtig) || 0))),
      quote: Math.min(100, Math.max(0, Math.round(Number(s?.quote) || 0))),
    }))
    .filter((s) => s.gesamt > 0);

  /* Zuletzt gewählte Einstellung, damit „Los“ beim nächsten Mal gleich passt. */
  const w = eingang?.wahl;
  if (w && typeof w === 'object') {
    const kennung = (v) => (/^[a-z0-9-]{2,40}$/.test(String(v || '')) ? String(v) : null);
    out.wahl = {
      fach: kennung(w.fach) || 'franzoesisch',
      unterfach: kennung(w.unterfach) || 'wortschatz',
      kapitel: (Array.isArray(w.kapitel) ? w.kapitel.slice(0, 60) : []).map((k) => text(k, 60)).filter(Boolean),
      // Die Niveaukennungen bringt jedes Fach selbst mit – hier reicht die Form.
      niveaus: (Array.isArray(w.niveaus) ? w.niveaus.slice(0, 6) : []).filter((n) => /^[a-z]$/.test(String(n))),
      modus: istModus(w.modus) ? w.modus : 'karteikarten',
      richtung: ['fr-de', 'de-fr', 'misch'].includes(w.richtung) ? w.richtung : 'fr-de',
      anzahl: Math.min(100, Math.max(5, Math.round(Number(w.anzahl) || 20))),
    };
  }

  /* Der Lernplan: Zieldatum, Lerntage und Wunschpensum. */
  const p = eingang?.plan;
  if (p && typeof p === 'object') {
    const tage = (Array.isArray(p.wochentage) ? p.wochentage : [])
      .map((t) => Math.round(Number(t)))
      .filter((t) => t >= 1 && t <= 7);
    out.plan = {
      ...leererPlan(),
      aktiv: p.aktiv === true,
      fach: text(p.fach, 40) || null,
      unterfach: text(p.unterfach, 40) || null,
      ziel: ISO.test(p.ziel || '') ? p.ziel : null,
      wochentage: tage.length ? [...new Set(tage)].sort() : [1, 2, 3, 4, 5],
      proTag: Math.min(200, Math.max(5, Math.round(Number(p.proTag) || 20))),
    };
  }

  /* Zusammenfassung je Unterfach – die Startseite liest nur diese Zeilen,
     statt den ganzen Wortschatz zu laden. */
  out.stand = (Array.isArray(eingang?.stand) ? eingang.stand.slice(-10) : [])
    .map((z) => ({
      fach: text(z?.fach, 40),
      unterfach: text(z?.unterfach, 40),
      gesamt: Math.min(99999, Math.max(0, Math.round(Number(z?.gesamt) || 0))),
      gelernt: Math.min(99999, Math.max(0, Math.round(Number(z?.gelernt) || 0))),
      sitzt: Math.min(99999, Math.max(0, Math.round(Number(z?.sitzt) || 0))),
      faellig: Math.min(99999, Math.max(0, Math.round(Number(z?.faellig) || 0))),
      prozent: Math.min(100, Math.max(0, Math.round(Number(z?.prozent) || 0))),
      aktualisiert: ISO.test(z?.aktualisiert || '') ? z.aktualisiert : undefined,
    }))
    .filter((z) => z.fach && z.unterfach && z.gesamt > 0);

  out.updatedAt = new Date().toISOString();
  return out;
}

/* ---------------------------------------------------------- Rezeptbuch */
function rezepte(eingang) {
  const out = leeresBuch();

  out.rezepte = (Array.isArray(eingang?.rezepte) ? eingang.rezepte.slice(0, 300) : [])
    .map((r) => {
      const titel = text(r?.titel, 160);
      if (!titel) return null;
      return {
        id: /^[a-f0-9]{6,24}$/.test(r?.id || '') ? r.id : kennung(),
        titel,
        kategorie: istKategorie(r?.kategorie) ? r.kategorie : 'hauptgang',
        portionen: Math.min(99, Math.max(1, Math.round(Number(r?.portionen) || 2))),
        dauerMin: Math.min(6000, Math.max(0, Math.round(Number(r?.dauerMin) || 0))) || undefined,
        notiz: text(r?.notiz, 1000) || undefined,
        favorit: r?.favorit === true ? true : undefined,
        bild: r?.bild === true ? true : undefined,
        gekocht: Math.min(9999, Math.max(0, Math.round(Number(r?.gekocht) || 0))),
        zuletztGekocht: ISO.test(r?.zuletztGekocht || '') ? r.zuletztGekocht : undefined,
        zutaten: (Array.isArray(r?.zutaten) ? r.zutaten.slice(0, 80) : [])
          .map((z) => {
            const name = text(z?.name, 120);
            if (!name) return null;
            return {
              menge: text(z?.menge, 20) || undefined,
              einheit: text(z?.einheit, 16) || undefined,
              name,
            };
          }).filter(Boolean),
        schritte: (Array.isArray(r?.schritte) ? r.schritte.slice(0, 60) : [])
          .map((st) => {
            const t = text(st?.text, 1200);
            if (!t) return null;
            return {
              text: t,
              dauerMin: Math.min(2000, Math.max(0, Math.round(Number(st?.dauerMin) || 0))) || undefined,
            };
          }).filter(Boolean),
        createdAt: typeof r?.createdAt === 'string' ? r.createdAt.slice(0, 40) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    })
    .filter(Boolean);

  out.sortierung = REZEPT_SORT.includes(eingang?.sortierung) ? eingang.sortierung : 'neu';
  out.updatedAt = new Date().toISOString();
  return out;
}

/* Bilder liegen getrennt: die Rezeptliste soll leicht bleiben. */
const BILD = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const BILD_MAX = 400 * 1024;   // rund 300 KB Bilddaten nach base64

function rezeptbilder(eingang) {
  const out = leereBilder();
  const roh = eingang?.bilder && typeof eingang.bilder === 'object' ? eingang.bilder : {};
  const bilder = {};
  for (const [k, v] of Object.entries(roh).slice(0, 300)) {
    if (!/^[a-f0-9]{6,24}$/.test(k)) continue;
    const d = String(v || '');
    if (!BILD.test(d) || d.length > BILD_MAX) continue;
    bilder[k] = d;
  }
  out.bilder = bilder;
  out.updatedAt = new Date().toISOString();
  return out;
}

/* ------------------------------------------------------------- Arbeit */
function arbeit(eingang) {
  const out = leereArbeit();
  out.branche = istBranche(eingang?.branche) ? eingang.branche : null;

  out.boards = (Array.isArray(eingang?.boards) ? eingang.boards.slice(0, 20) : [])
    .map((b, i) => {
      const name = text(b?.name, 60);
      if (!name) return null;
      return {
        id: /^[a-f0-9]{6,24}$/.test(b?.id || '') ? b.id : kennung(),
        name,
        ordnung: Math.min(99, Math.max(0, Math.round(Number(b?.ordnung) ?? i))),
      };
    }).filter(Boolean);

  out.status = (Array.isArray(eingang?.status) ? eingang.status.slice(0, 20) : [])
    .map((st, i) => {
      const name = text(st?.name, 60);
      if (!name) return null;
      return {
        id: /^[a-f0-9]{6,24}$/.test(st?.id || '') ? st.id : kennung(),
        name,
        farbe: istFarbe(st?.farbe) ? st.farbe : 'grau',
        ordnung: Math.min(99, Math.max(0, Math.round(Number(st?.ordnung) ?? i))),
      };
    }).filter(Boolean);

  const boardIds = new Set(out.boards.map((b) => b.id));
  const statusIds = new Set(out.status.map((s) => s.id));

  out.kunden = (Array.isArray(eingang?.kunden) ? eingang.kunden.slice(0, 1000) : [])
    .map((k) => {
      const name = text(k?.name, 120);
      if (!name) return null;
      return {
        id: /^[a-f0-9]{6,24}$/.test(k?.id || '') ? k.id : kennung(),
        name,
        firma: text(k?.firma, 120) || undefined,
        kontakt: text(k?.kontakt, 160) || undefined,
        notiz: text(k?.notiz, 2000) || undefined,
        // Verwaiste Zuordnungen landen auf dem ersten Board statt im Nirgendwo.
        board: boardIds.has(k?.board) ? k.board : (out.boards[0]?.id || null),
        status: statusIds.has(k?.status) ? k.status : (out.status[0]?.id || null),
        createdAt: typeof k?.createdAt === 'string' ? k.createdAt.slice(0, 40) : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: (Array.isArray(k?.updates) ? k.updates.slice(-100) : [])
          .map((u) => {
            const t = text(u?.text, 2000);
            if (!t) return null;
            return {
              id: /^[a-f0-9]{6,24}$/.test(u?.id || '') ? u.id : kennung(),
              datum: ISO.test(u?.datum || '') ? u.datum : new Date().toISOString().slice(0, 10),
              text: t,
              status: statusIds.has(u?.status) ? u.status : undefined,
            };
          }).filter(Boolean),
        todos: (Array.isArray(k?.todos) ? k.todos.slice(0, 100) : [])
          .map((t) => {
            const titel = text(t?.titel, 200);
            if (!titel) return null;
            return {
              id: /^[a-f0-9]{6,24}$/.test(t?.id || '') ? t.id : kennung(),
              titel,
              erledigt: t?.erledigt === true,
              faellig: ISO.test(t?.faellig || '') ? t.faellig : undefined,
            };
          }).filter(Boolean),
      };
    })
    .filter(Boolean);

  out.updatedAt = new Date().toISOString();
  return out;
}

/** Welche App darf hier speichern – und wie werden ihre Daten geprüft? */
export const APPS = {
  ziele:        { modul: 'ziele',       pruefe: ziele,        leer: leereZiele },
  todo:         { modul: 'todo',        pruefe: todos,        leer: leereTodos },
  lernen:       { modul: 'lernatelier', pruefe: lernen,       leer: leereFortschritt },
  rezepte:      { modul: 'rezepte',     pruefe: rezepte,      leer: leeresBuch },
  rezeptbilder: { modul: 'rezepte',     pruefe: rezeptbilder, leer: leereBilder },
  arbeit:       { modul: 'arbeit',      pruefe: arbeit,       leer: leereArbeit },
};

export const kenntApp = (app) => Object.prototype.hasOwnProperty.call(APPS, app);

export async function ladeApp(app, username) {
  const def = APPS[app];
  return (await redis.get(schluessel(app, username))) || def.leer();
}

export async function speichereApp(app, username, daten) {
  const def = APPS[app];
  const sauber = def.pruefe(daten);
  await redis.set(schluessel(app, username), sauber);
  return sauber;
}

export async function loescheApp(app, username) {
  await redis.del(schluessel(app, username));
  return APPS[app].leer();
}
