import { redis, K, DEFAULT_MODULES } from './redis.js';
import { hashPassword, saveUser, getUser, destroyAllSessions } from './auth.js';

/**
 * Startkonto
 * =========
 * Damit nach dem ersten Deploy sofort eine Anmeldung möglich ist, legt Alena
 * dieses Konto einmalig selbst an. Existiert bereits ein Konto mit diesem
 * Namen, wird sein Passwort dabei auf den hier hinterlegten Wert gesetzt.
 *
 * Das geschieht GENAU EINMAL. Danach steht in Redis unter `alena:seeded` eine
 * Markierung, und ein später im Host-Bereich geändertes Passwort bleibt
 * bestehen – auch über weitere Deployments hinweg.
 *
 * WICHTIG
 *  · Das Repository privat halten; dieses Passwort steht hier im Klartext.
 *  · Nach der ersten Anmeldung im Host-Bereich über „Passwort ändern“ ein
 *    eigenes setzen. Es bleibt dann erhalten.
 *  · Soll gar kein Startkonto angelegt werden: `password` auf '' setzen.
 *  · Soll es erneut greifen (etwa nach einem Umzug der Datenbank), in Upstash
 *    den Schlüssel `alena:seeded` löschen.
 */
export const START_KONTO = {
  username: 'host',
  name: 'Kamande Njihia',
  password: 'pt6j3wtkchpF',
};

export async function seedEinmalig() {
  if (!START_KONTO.password) return;

  try {
    // Markierung zuerst setzen: so legt bei gleichzeitigen Aufrufen
    // nur ein einziger das Konto an.
    const zuerst = await redis.set(K.seeded, new Date().toISOString(), { nx: true });
    if (!zuerst) return;

    const bestehend = await getUser(START_KONTO.username);
    const user = bestehend || {
      username: START_KONTO.username,
      name: START_KONTO.name,
      role: 'host',
      active: true,
      modules: { ...DEFAULT_MODULES },
      createdAt: new Date().toISOString(),
      createdBy: 'startkonto',
    };

    user.passwordHash = hashPassword(START_KONTO.password);
    user.role = 'host';
    user.active = true;
    user.mustChangePassword = false;
    user.updatedAt = new Date().toISOString();

    await saveUser(user);
    if (bestehend) await destroyAllSessions(START_KONTO.username);
  } catch (err) {
    // Ein fehlgeschlagenes Startkonto darf nie die Anmeldung blockieren.
    console.error('[alena] Startkonto konnte nicht angelegt werden:', err?.message);
  }
}
