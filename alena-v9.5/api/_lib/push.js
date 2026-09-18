import webpush from 'web-push';
import { redis, K } from './redis.js';

/**
 * Push-Versand.
 * Fehler werden hier nicht verschluckt: Wer eine Mitteilung auslöst, soll
 * erfahren, warum sie nicht angekommen ist.
 */

export const vapidSubject = () => (process.env.VAPID_SUBJECT || 'mailto:amplifyxswiss@gmail.com').trim();

/** Kurzform des öffentlichen Schlüssels – zum Erkennen alter Abos. */
export const schluesselKurz = () => (process.env.VAPID_PUBLIC_KEY || '').trim().slice(0, 16) || null;

/**
 * Was hindert den Versand? Gibt Klartext zurück – oder null, wenn alles passt.
 * Prüft nicht nur, ob die Variablen gesetzt sind, sondern auch, ob die
 * Bibliothek sie akzeptiert. Abgeschnittene Schlüssel sind der häufigste Fehler.
 */
export function pushProblem() {
  const pub = (process.env.VAPID_PUBLIC_KEY || '').trim();
  const priv = (process.env.VAPID_PRIVATE_KEY || '').trim();

  if (!pub && !priv) return 'VAPID_PUBLIC_KEY und VAPID_PRIVATE_KEY fehlen.';
  if (!pub) return 'VAPID_PUBLIC_KEY fehlt.';
  if (!priv) return 'VAPID_PRIVATE_KEY fehlt.';
  if (pub.length < 80) return 'VAPID_PUBLIC_KEY ist zu kurz – beim Kopieren wohl etwas abgeschnitten.';
  if (priv.length < 40) return 'VAPID_PRIVATE_KEY ist zu kurz – beim Kopieren wohl etwas abgeschnitten.';
  if (!/^(mailto:|https?:\/\/)/.test(vapidSubject())) {
    return 'VAPID_SUBJECT muss mit „mailto:“ oder „https://“ beginnen.';
  }
  try {
    webpush.setVapidDetails(vapidSubject(), pub, priv);
  } catch (err) {
    return `Die Schlüssel passen nicht zusammen: ${err.message}`;
  }
  return null;
}

/** Sind die VAPID-Schlüssel brauchbar? Richtet die Bibliothek gleich mit ein. */
export function pushBereit() {
  return pushProblem() === null;
}

/* Was die Push-Dienste mit ihren Statuscodes sagen wollen. */
const DEUTUNG = {
  400: 'Der Push-Dienst hat die Anfrage abgelehnt.',
  403: 'Dieses Gerät kennt noch den alten Push-Schlüssel. Es muss die Mitteilungen einmal neu erlauben.',
  404: 'Dieses Abo gibt es beim Push-Dienst nicht mehr.',
  410: 'Dieses Gerät hat die Mitteilungen abbestellt.',
  413: 'Die Mitteilung war zu lang.',
  429: 'Der Push-Dienst bremst gerade. Später nochmals versuchen.',
};

/* Bei diesen Codes ist das Abo endgültig hin – wegräumen. */
const ENDGUELTIG = new Set([403, 404, 410]);

/**
 * Nachricht an alle Geräte eines Kontos senden.
 * Liefert je Gerät zurück, ob es geklappt hat, und räumt tote Abos weg.
 */
export async function sendToUser(username, payload) {
  const problem = pushProblem();
  if (problem) throw new Error(problem);

  const map = (await redis.hgetall(K.subs(username))) || {};
  const geraete = Object.entries(map);
  if (!geraete.length) {
    return { sent: 0, removed: 0, geraete: [], grund: 'Für dieses Konto ist kein Gerät angemeldet.' };
  }

  const body = JSON.stringify(payload);
  const tot = [];
  const berichte = [];

  await Promise.all(geraete.map(async ([id, sub]) => {
    const label = String(sub?.label || 'Gerät');
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        body,
        { TTL: 3600, urgency: 'high' }
      );
      berichte.push({ id, label, ok: true });
    } catch (err) {
      const code = Number(err?.statusCode) || 0;
      const text = DEUTUNG[code]
        || String(err?.body || err?.message || 'Unbekannter Fehler.').slice(0, 200);
      if (ENDGUELTIG.has(code)) tot.push(id);
      berichte.push({ id, label, ok: false, code, text, entfernt: ENDGUELTIG.has(code) });
    }
  }));

  if (tot.length) await redis.hdel(K.subs(username), ...tot);

  const sent = berichte.filter((b) => b.ok).length;
  const fehler = berichte.filter((b) => !b.ok);

  return {
    sent,
    removed: tot.length,
    geraete: berichte,
    grund: sent ? null : (fehler[0]?.text || 'Kein Gerät erreichbar.'),
  };
}
