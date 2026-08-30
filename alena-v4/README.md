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
├─ api/                    genau acht Functions – siehe Hinweis unten
│  ├─ setup.js             einmaliges Anlegen des ersten Host-Kontos
│  ├─ status.js            Standortbestimmung: was fehlt noch?
│  ├─ register.js          öffentliches Registrierungsformular
│  ├─ auth.js              ?do=login | logout | me | password
│  ├─ admin.js             ?bereich=users | requests | schedule
│  ├─ cycle.js             Zyklusdaten, ?do=quick für die Nachfrage
│  ├─ push.js              ?do=subscribe | send
│  ├─ cron.js              Erinnerungsdienst
│  └─ _lib/                gemeinsamer Code, keine eigenen Functions
│     └─ seed.js           Startkonto: Benutzername und Passwort
└─ scripts/generate-vapid.js
```

> **Warum alles zusammengelegt ist:** Der Vercel-Hobby-Tarif erlaubt höchstens
> **12 Serverless Functions je Deployment**. Jede Datei in `api/` wird zu einer
> Function – Unterordner und Dateinamen mit `_` am Anfang zählen nicht. Darum
> laufen verwandte Endpunkte über einen Parameter statt über eigene Dateien.
> Beim Bau weiterer Apps: neue Aktionen in eine bestehende Datei aufnehmen,
> statt neue anzulegen.

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

## 5. Anmelden — das Startkonto ist schon hinterlegt

Nach dem ersten Deploy legt Alena beim ersten Aufruf von `/host` selbst ein
Konto an:

| | |
|---|---|
| Benutzername | `host` |
| Passwort | `pt6j3wtkchpF` |

Das geschieht **genau einmal**. Bestand schon ein Konto namens `host` mit
einem anderen Passwort, wird es dabei auf dieses gesetzt, entsperrt und
bekommt die Host-Rolle — damit ist ein verlorener Zugang sofort wieder offen.

Danach merkt sich Redis unter `alena:seeded`, dass es erledigt ist. Ein im
Host-Bereich über *Passwort ändern* gesetztes eigenes Passwort bleibt also
bestehen, auch über weitere Deployments hinweg.

**Bitte gleich nach der ersten Anmeldung ein eigenes Passwort setzen.**
Dieses hier steht im Klartext in `api/_lib/seed.js` — wer das Repository
sieht, kennt es. Das Repository privat halten.

Kein Startkonto gewünscht? In `api/_lib/seed.js` bei `START_KONTO` das
`password` auf `''` setzen. Soll es erneut greifen, in Upstash den Schlüssel
`alena:seeded` löschen.

### Weitere Wege ins Konto

Für den Fall, dass das Startkonto ausgeschaltet ist:

`/host` aufrufen. Solange noch kein einziges Konto besteht und `SETUP_TOKEN`
gesetzt ist, erscheint dort **von selbst ein Einrichtungsformular**:
Setup-Token, Benutzername, Anzeigename, Passwort — anlegen, fertig.
Die Anmeldung erfolgt sofort automatisch.

Danach `SETUP_TOKEN` in Vercel wieder **löschen**; das Formular verschwindet,
sobald ein Konto besteht.

Wer lieber die Kommandozeile nimmt:

```bash
curl -X POST https://<deine-domain>/api/setup \
  -H "content-type: application/json" \
  -d '{"token":"<SETUP_TOKEN>","username":"host","name":"Kamande Njihia","password":"<passwort>"}'
```

Anmelden später über den unauffälligen **Host**-Link ganz unten auf der
Startseite oder direkt über `/host`. Das Passwort lässt sich dort oben rechts
über *Passwort ändern* wechseln.

### Wenn der Host-Zugang nicht klappt

`https://<deine-domain>/api/status` im Browser öffnen. Die Antwort sagt,
woran es liegt:

| Antwort | Bedeutung |
|---|---|
| Fehlermeldung zur Datenbank | Upstash for Redis ist nicht verbunden |
| `"konten": 0, "setupTokenGesetzt": false` | `SETUP_TOKEN` fehlt in Vercel |
| `"setupMoeglich": true` | alles bereit – `/host` zeigt das Formular |
| `"konten": 1` und Anmeldung scheitert | Benutzername oder Passwort stimmt nicht |

Nach jeder Änderung an den Umgebungsvariablen muss **neu deployt** werden,
sonst kennt die laufende Funktion die neuen Werte nicht.

### Passwort vergessen

Auf `/host` unter dem Anmeldeformular **Zugang zurücksetzen** aufklappen.
Mit `SETUP_TOKEN`, Benutzername und einem neuen Passwort lässt sich jedes
Konto wieder öffnen – es bekommt dabei die Host-Rolle und wird entsperrt.
Stimmt der Benutzername nicht, nennt die Fehlermeldung die vorhandenen Konten.
Höchstens zehn Fehlversuche pro Stunde und IP-Adresse.

Danach `SETUP_TOKEN` in Vercel wieder löschen: Wer dieses Geheimnis hat,
kommt an jedes Konto.

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

| App | Stand |
|---|---|
| To-Dos | Kommt bald |
| Kalender | Kommt bald |
| Medikamententracker | Kommt bald |
| **Periodentracker** | **fertig** – unter `/cycle` |
| Lernatelier | Kommt bald |
| Ziele | Kommt bald |
| Rezeptbuch | Kommt bald |

Der Host schaltet jede App pro Person mit einem Klick frei oder wieder ab —
beim Anlegen eines Logins direkt im Formular, später über die Chips auf der
Benutzerkarte. Die Liste steht in `api/_lib/redis.js` unter `MODULES`; wird
dort eine App auf `status: 'live'` mit `href` gesetzt, wird die Kachel im
App-Bereich anklickbar statt „Kommt bald“.

---

## Periodentracker

Erreichbar unter `/cycle`, sichtbar nur für Konten, bei denen die App
freigeschaltet ist. Die Daten liegen unter `alena:cycle:<benutzer>`.

**Was er kann**

- Tägliche Nachfrage als Karte und als Mitteilung (siehe unten)
- Ring mit Zyklustag, Phase und Countdown; bei ausbleibender Periode zählt er
  die Verspätung mit statt den Termin stillschweigend zu verschieben
- Monatskalender: Periode, erwartete Periode, fruchtbares Fenster, Eisprung,
  Pillenpause – jeder Tag anklickbar
- Tageseintrag: Blutungsstärke, zehn Symptome, Stimmung, Notiz, Sex
- Verlauf: alle erfassten Perioden, nachtragen und löschen
- Statistik: Ø Zykluslänge, Ø Periodendauer, Schwankung, letzte Zyklen als
  Balken, häufigste Symptome, drei kommende Perioden
- Vorhersage aus dem Mittel der letzten sechs Zyklen; ohne Vorgeschichte
  gelten die Werte aus den Einstellungen
- Testmitteilung und Download aller eigenen Daten als JSON

**Pille**

Vier Schemata: Kombipille 21 + 7, Kombipille 24 + 4, Langzyklus und
Minipille. Alena zählt Packung und Tag mit, zeigt Pause beziehungsweise
Placebotage im Kalender und erinnert täglich zur eingestellten Zeit —
aber nur, wenn die Einnahme für heute noch nicht abgehakt ist.

Ist die Pille eingeschaltet, blendet Alena Eisprung und fruchtbares Fenster
**aus**. Unter hormoneller Verhütung findet in der Regel kein Eisprung statt;
eine Fruchtbarkeitsvorhersage wäre dort irreführend. Die Blutung in der Pause
ist eine Abbruchblutung, was in der Vorschau auch so benannt wird.

Der Tracker trägt einen sichtbaren Hinweis, dass die Vorhersagen Schätzungen
sind, **nicht zur Verhütung taugen** und keine ärztliche Beratung ersetzen.

**Tägliche Nachfrage**

Alena fragt einmal pro Tag nach – im Wortlaut:

> **Hast du deine Pille genommen?** Tag 21 von 28 in der Packung.
> [ Ja, genommen ] [ Später ]

> **Hast du deine Tage bekommen?** Heute wird deine Periode erwartet.
> [ Ja, heute ] [ Noch nicht ]

Die Pillenfrage kommt zur eingestellten Einnahmezeit, solange die Einnahme
für heute nicht abgehakt ist. Die Periodenfrage kommt zur eingestellten
Uhrzeit der Nachfrage – ab dem Vorlauf vor dem erwarteten Termin bis zwei
Wochen danach, solange keine Blutung eingetragen ist und die Frage an diesem
Tag nicht schon mit „Noch nicht“ beantwortet wurde.

Die Antwort geht **direkt aus der Mitteilung**: Auf Android, Windows und Mac
sitzen die beiden Knöpfe in der Mitteilung selbst, der Service Worker
speichert die Antwort ohne dass die App geöffnet wird. „Ja“ bei der
Periodenfrage legt gleich eine neue Periode ab heute an.

Auf dem iPhone zeigt Apple keine Knöpfe in Web-Mitteilungen. Dort führt ein
Tipp auf die Mitteilung in die App, wo dieselbe Frage als Karte oben auf der
Seite steht – mit denselben zwei Knöpfen. Diese Karte erscheint ohnehin bei
jedem Öffnen, solange etwas offen ist.

Jede Frage wird pro Tag höchstens einmal verschickt.

**Erinnerungen einrichten – der Taktgeber**

Der Endpunkt `/api/cron` verschickt, was gerade fällig ist. Er
arbeitet in der Zeitzone Europe/Zurich und braucht `CRON_SECRET`. Damit er
läuft, muss ihn etwas regelmässig aufrufen — etwa alle 15 Minuten.

Der Vercel-Hobby-Tarif kann das **nicht**: dort sind Cron Jobs auf **einmal
pro Tag** begrenzt, und selbst dann nur stundengenau (±59 Minuten). Ein
häufigerer Ausdruck lässt das Deployment scheitern. Es braucht also einen
Taktgeber von aussen.

*Empfohlen: Upstash QStash über den Vercel-Marktplatz* — im kostenlosen Tarif
1000 Nachrichten pro Tag und 10 Zeitpläne. Alle 15 Minuten sind 96 Aufrufe am
Tag, das passt bequem hinein.

1. Im Vercel-Projekt: **Integrations → Browse Marketplace → Upstash
   QStash/Workflow** hinzufügen und mit dem Projekt verbinden.
   Vercel setzt `QSTASH_TOKEN` und die Signaturschlüssel selbst.
2. Einmal **neu deployen**, damit die Funktionen den Token kennen.
3. Im **Host-Bereich** rechts unter *Erinnerungsdienst* auf
   **Zeitplan einrichten** klicken.

Damit legt Alena den Zeitplan selbst an: alle 15 Minuten ein Aufruf von
`/api/cron`, das `CRON_SECRET` reist als Kopfzeile mit statt in der
Adresse. Dieselbe Karte zeigt danach den laufenden Zeitplan und erlaubt
*Anhalten* oder *Neu einrichten*. In der QStash-Oberfläche muss nichts von
Hand gemacht werden.

*Alternative ohne QStash:* ein kostenloser Cron-Dienst wie cron-job.org, der
alle 15 Minuten diese Adresse aufruft:

```
https://<deine-domain>/api/cron?secret=<CRON_SECRET>&window=15
```

*Mit Vercel Pro* geht es auch ohne fremden Dienst — in `vercel.json`:

```json
"crons": [{ "path": "/api/cron", "schedule": "*/15 * * * *" }]
```

`window` muss dem Abstand zwischen zwei Aufrufen in Minuten entsprechen —
wer stündlich aufruft, setzt `window=60`. Pro Tag und Frage wird höchstens
eine Mitteilung verschickt, doppelte Aufrufe schaden also nicht.

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
import { sendToUser } from './api/_lib/push.js';
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
