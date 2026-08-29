# Alena

Startseite mit Login und Registrierung, Host-Verwaltung und echte Push-Mitteilungen.
Gebaut für **Vercel** + **Upstash for Redis**.

Betreiber: Kamande Njihia, Holzlegistrasse 15a, 8408 Winterthur — amplifyxswiss@gmail.com

```
alena/
├─ public/
│  ├─ index.html           Startseite: Login, Registrierung, Apps, FAQ, Impressum, Host-Link
│  ├─ host.html            Host-Konsole: Anfragen, Logins, Sperren, Apps
│  ├─ app.html             App-Bereich nach dem Login
│  ├─ styles.css           Farbwelt aus dem Logo, dunkel und hell
│  ├─ theme.js             Hell/Dunkel-Umschalter (Standard: dunkel)
│  ├─ ambient.js           schwebende Linien im Hintergrund
│  ├─ sw.js                Service Worker (Push + Offline)
│  ├─ manifest.webmanifest Home-Bildschirm-Symbol und App-Verhalten
│  └─ icons/               aus dem Logo erzeugt
├─ api/
│  ├─ setup.js             einmaliges Anlegen des ersten Host-Kontos
│  ├─ register.js          öffentliches Registrierungsformular
│  ├─ auth/                login, logout, me, password
│  ├─ admin/users.js       Benutzer anlegen, sperren, Apps schalten
│  ├─ admin/requests.js    Registrierungsanfragen
│  └─ push/                subscribe, send
└─ scripts/generate-vapid.js
```

---

## 1. Repository anlegen

```bash
cd alena
git init && git add -A && git commit -m "Alena: Startseite, Host-Bereich, Push"
gh repo create alena --private --source=. --push     # oder von Hand auf GitHub
```

Das Repository **privat** halten.

## 2. Auf Vercel deployen

Auf **vercel.com → Add New → Project** das Repository importieren.
Framework: *Other*. Build Command und Output Directory bleiben leer –
`public/` wird ausgeliefert, `api/` wird zu Functions.

## 3. Upstash for Redis verbinden

Im Vercel-Projekt: **Storage → Create Database → Upstash for Redis**
(Region **eu-central-1**, Frankfurt). Beim Verbinden setzt Vercel
`KV_REST_API_URL` und `KV_REST_API_TOKEN` automatisch.

Ein direkt bei Upstash angelegter Store funktioniert ebenfalls – dann
`UPSTASH_REDIS_REST_URL` und `UPSTASH_REDIS_REST_TOKEN` selbst eintragen.

## 4. Push-Schlüssel erzeugen

```bash
npm install
npx web-push generate-vapid-keys
```

In Vercel unter **Settings → Environment Variables** eintragen:

| Variable | Wert |
|---|---|
| `VAPID_PUBLIC_KEY` | öffentlicher Schlüssel |
| `VAPID_PRIVATE_KEY` | privater Schlüssel |
| `VAPID_SUBJECT` | `mailto:amplifyxswiss@gmail.com` |
| `SETUP_TOKEN` | ein langes, frei gewähltes Geheimnis |

Danach einmal **Redeploy** auslösen.

## 5. Host-Konto anlegen

```bash
curl -X POST https://<deine-domain>/api/setup \
  -H "content-type: application/json" \
  -d '{"token":"<SETUP_TOKEN>","username":"host","name":"Kamande Njihia","password":"pt6j3wtkchpF"}'
```

Der Aufruf funktioniert nur, solange noch kein Konto existiert.
Danach `SETUP_TOKEN` in Vercel wieder **löschen**.

Anmelden über den unauffälligen **Host**-Link ganz unten auf der Startseite
oder direkt über `/host`. Das Passwort lässt sich dort oben rechts über
*Passwort ändern* jederzeit wechseln — empfehlenswert, sobald alles läuft,
weil dieses Passwort über den Chat gegangen ist.

---

## Ablauf für neue Nutzerinnen und Nutzer

1. Auf der Startseite auf **Registrieren** — Name und E-Mail eingeben.
2. Die Anfrage erscheint im Host-Bereich unter *Registrierungsanfragen*.
3. Dort **Antworten** öffnet das Mailprogramm mit vorbereiteter Nachricht.
4. **Login anlegen** füllt das Formular rechts vor (Benutzername aus der
   E-Mail, Passwort erzeugt) — anlegen, Zugangsdaten per Mail senden.
5. Anfrage auf **Erledigt** setzen.

Pro IP-Adresse sind drei Anfragen pro Stunde möglich.

## Die sieben Apps

To-Dos · Kalender · Medikamententracker · Periodentracker · Lernatelier ·
Ziele · Rezeptbuch

Alle stehen im App-Bereich auf **Kommt bald** und werden einzeln gebaut.
Der Host schaltet sie pro Person mit einem Klick frei oder wieder ab.
Die Liste steht in `api/_lib/redis.js` unter `MODULES` — eine neue App
dort ergänzen, und sie erscheint überall automatisch.

## Darstellung

Hell und Dunkel lassen sich ganz unten auf jeder Seite umschalten.
Standard ist Dunkel; die Wahl bleibt im Browser gespeichert.
Der bewegte Hintergrund steht still, wenn das Gerät „Bewegung reduzieren“
eingeschaltet hat.

---

## Mitteilungen auf dem iPhone

Apple erlaubt Web-Push nur in installierten Web-Apps:

1. Alena in **Safari** öffnen (nicht in Chrome, nicht im In-App-Browser).
2. **Teilen → „Zum Home-Bildschirm“**.
3. Alena über das neue Symbol starten und bei *Erinnerungen einschalten* auf **Erlauben** tippen.

Voraussetzung ist iOS 16.4 oder neuer. In einem gewöhnlichen Safari-Tab
bleiben Mitteilungen aus – das ist eine Vorgabe von Apple, kein Fehler der App.
Android, Windows, macOS und Linux brauchen diesen Umweg nicht.

Aus dem Code heraus senden:

```js
import { sendToUser } from './api/push/send.js';
await sendToUser('anna', { title: 'Alena', body: '08:00 – Vitamin D', url: '/app' });
```

---

## Datenmodell in Redis

| Key | Inhalt |
|---|---|
| `alena:users` | Set aller Benutzernamen |
| `alena:user:<name>` | Benutzerobjekt inkl. `modules` und `passwordHash` |
| `alena:sess:<token>` | Benutzername, 30 Tage gültig |
| `alena:usersess:<name>` | Set der aktiven Sitzungen (für „alle abmelden“) |
| `alena:push:<name>` | Hash der Push-Abos je Gerät |
| `alena:requests` | Hash der Registrierungsanfragen |
| `alena:fails:<ip:name>` | Fehlversuche beim Login, 15 Minuten |
| `alena:reqlimit:<ip>` | Bremse für das Registrierungsformular |

Passwörter werden mit **scrypt** und Zufallssalz gespeichert, nie im Klartext.
Sitzungen laufen über ein `HttpOnly`-Cookie.

## Offene Punkte

- Die sieben Apps selbst — eine nach der anderen.
- Für zeitgesteuerte Erinnerungen einen Vercel-Cron auf `/api/push/send`
  einrichten und mit `CRON_SECRET` absichern.
- Datenschutzerklärung bei Bedarf ausführlicher fassen.
