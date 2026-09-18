import { redisReady } from './redis.js';

/**
 * Umhüllt jeden Endpunkt: meldet eine fehlende Datenbank verständlich
 * und lässt keinen unerwarteten Fehler als nackten Absturz nach aussen.
 */
export function api(handler) {
  return async (req, res) => {
    if (!redisReady) {
      return res.status(503).json({
        error: 'Die Datenbank ist noch nicht verbunden. In Vercel unter Storage '
             + 'einen Upstash-for-Redis-Store anlegen und danach einmal neu deployen.',
      });
    }
    try {
      return await handler(req, res);
    } catch (err) {
      console.error('[alena]', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Unerwarteter Serverfehler. Bitte später erneut versuchen.' });
      }
    }
  };
}
