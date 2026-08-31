import crypto from 'node:crypto';
import { redis } from './redis.js';
import { istStatus, leereZiele } from '../../public/ziele-core.js';
import { istPrio, SORT_IDS, schluessel as titelSchluessel, leereTodos } from '../../public/todo-core.js';

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

/** Welche App darf hier speichern – und wie werden ihre Daten geprüft? */
export const APPS = {
  ziele: { modul: 'ziele', pruefe: ziele, leer: leereZiele },
  todo:  { modul: 'todo',  pruefe: todos, leer: leereTodos },
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
