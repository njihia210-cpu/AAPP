import { api } from './_lib/handler.js';
import { redis, K } from './_lib/redis.js';
import { methodNotAllowed } from './_lib/auth.js';
import { seedEinmalig, START_KONTO } from './_lib/seed.js';

/**
 * Kleine Standortbestimmung ohne Geheimnisse – sagt, was noch fehlt.
 * Öffentlich erreichbar unter /api/status.
 */
export default api(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  await seedEinmalig();

  const accounts = Number((await redis.scard(K.users)) || 0);
  const hasSetupToken = Boolean(process.env.SETUP_TOKEN);
  const hasVapid = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

  const offen = [];
  if (accounts === 0 && !hasSetupToken) offen.push('SETUP_TOKEN in Vercel setzen und neu deployen.');
  if (accounts === 0 && hasSetupToken) offen.push('Erstes Host-Konto anlegen – auf /host erscheint dafür ein Formular.');
  if (!hasVapid) offen.push('VAPID_PUBLIC_KEY und VAPID_PRIVATE_KEY setzen, sonst gibt es keine Mitteilungen.');

  return res.status(200).json({
    datenbank: 'verbunden',
    konten: accounts,
    startkonto: START_KONTO.password ? START_KONTO.username : null,
    setupMoeglich: accounts === 0 && hasSetupToken,
    setupTokenGesetzt: hasSetupToken,
    mitteilungenBereit: hasVapid,
    offen,
  });
});
