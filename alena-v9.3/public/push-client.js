/* ==========================================================================
   Alena – Mitteilungen am Gerät
   Eine Stelle für alles, was der Browser fürs Abonnieren braucht.
   Wichtig ist vor allem das Auffrischen: wechselt der Server die Schlüssel
   oder läuft ein Abo ab, meldet sich das Gerät hier von selbst neu an.
   ========================================================================== */

export const istIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const istInstalliert = matchMedia('(display-mode: standalone)').matches
  || navigator.standalone === true;

export const kannPush = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

/** Warum geht es auf diesem Gerät nicht? Klartext – oder null, wenn es geht. */
export function geraeteProblem() {
  if (istIOS && !istInstalliert) {
    return 'Auf dem iPhone erlaubt Apple Mitteilungen erst, wenn Alena über '
         + 'Teilen → „Zum Home-Bildschirm“ installiert und von dort geöffnet wurde.';
  }
  if (!kannPush()) return 'Dieser Browser kann keine Mitteilungen empfangen.';
  if (Notification.permission === 'denied') {
    return 'Der Browser hat Mitteilungen blockiert. Das lässt sich nur in den '
         + 'Browsereinstellungen wieder ändern.';
  }
  return null;
}

/* ------------------------------------------------------------- Umrechnung */
export function b64ToUint8(base64) {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function uint8ToB64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Hängt dieses Abo noch am aktuellen Serverschlüssel? */
export function passtSchluessel(sub, vapidKey) {
  const eigen = sub?.options?.applicationServerKey;
  if (!eigen || !vapidKey) return true;      // nicht vergleichbar – nicht grundlos wegwerfen
  return uint8ToB64(eigen) === String(vapidKey).replace(/=+$/, '');
}

/* --------------------------------------------------------------- Anmelden */
async function melde(sub) {
  const res = await fetch('/api/push?do=subscribe', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON(), label: geraetename() }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.error || 'Das Gerät liess sich nicht anmelden.');
  return out;
}

function geraetename() {
  if (istIOS) return istInstalliert ? 'iPhone (Home-Bildschirm)' : 'iPhone';
  const ua = navigator.userAgent;
  if (/Android/.test(ua)) return 'Android';
  if (/Mac/.test(navigator.platform)) return 'Mac';
  if (/Win/.test(navigator.platform)) return 'Windows';
  return navigator.platform || 'Gerät';
}

/**
 * Erlaubnis holen und anmelden. Nur aus einem Klick heraus aufrufen –
 * anders zeigt kein Browser die Nachfrage.
 */
export async function anmelden(vapidKey) {
  const problem = geraeteProblem();
  if (problem) throw new Error(problem);
  if (!vapidKey) throw new Error('Der Server hat noch keine Push-Schlüssel hinterlegt.');

  const erlaubnis = await Notification.requestPermission();
  if (erlaubnis !== 'granted') throw new Error('Mitteilungen wurden nicht erlaubt.');

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (sub && !passtSchluessel(sub, vapidKey)) {
    await sub.unsubscribe().catch(() => {});
    sub = null;
  }
  sub ||= await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: b64ToUint8(vapidKey),
  });

  await melde(sub);
  return sub;
}

/**
 * Beim Öffnen der App aufräumen: Ist die Erlaubnis erteilt, muss auch ein
 * gültiges Abo bestehen und dem Server bekannt sein. Sonst kommt still nichts
 * mehr an – der häufigste Grund für „die Mitteilungen gehen nicht“.
 * Fragt nie nach; ohne Erlaubnis passiert hier gar nichts.
 */
export async function auffrischen(vapidKey) {
  try {
    if (!kannPush() || !vapidKey) return { stand: 'nicht-moeglich' };
    if (Notification.permission !== 'granted') return { stand: 'ungefragt' };

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (sub && !passtSchluessel(sub, vapidKey)) {
      await sub.unsubscribe().catch(() => {});
      sub = null;
    }
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: b64ToUint8(vapidKey),
      });
    }
    await melde(sub);
    return { stand: 'bereit' };
  } catch (err) {
    return { stand: 'fehler', fehler: err.message };
  }
}

/** Dieses Gerät wieder abmelden. */
export async function abmelden() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  await fetch('/api/push?do=subscribe', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}
