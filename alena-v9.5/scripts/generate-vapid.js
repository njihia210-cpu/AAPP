/* Erzeugt ein VAPID-Schlüsselpaar für Web Push.
   Aufruf:  node scripts/generate-vapid.js                              */
import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
console.log('\nDiese beiden Werte in Vercel als Umgebungsvariablen eintragen:\n');
console.log('VAPID_PUBLIC_KEY =', keys.publicKey);
console.log('VAPID_PRIVATE_KEY =', keys.privateKey);
console.log('\nDen privaten Schlüssel niemals ins Repository legen.\n');
