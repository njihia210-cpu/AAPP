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
│  ├─ einstellungen.html   Benachrichtigungen, Darstellung, Konto
│  ├─ cycle.html           Periodentracker
│  ├─ ziele.html           Ziele mit Schritten
│  ├─ todo.html            To-Do-Liste mit Gedächtnis
│  ├─ lernen.html          Lernatelier: Fächer, Kapitel, Übungen
│  ├─ rezepte.html         Rezeptbuch mit Kochmodus
│  ├─ rezept-core.js       Mengen skalieren, Kochseiten, Suche
│  ├─ arbeit.html          Arbeitsbereich mit Boards
│  ├─ arbeit-core.js       Branchen, Boards, Status, Kennzahlen
│  ├─ lern-faecher.js      Welche Fächer und Unterfächer es gibt
│  ├─ franz-daten.js       Französisch: 35 Kapitel Wortschatz
│  ├─ vbv-daten.js         Versicherungen/Leben: 32 Kapitel VBV-Stoff
│  ├─ lern-core.js         Übungslogik, Tipps, Leitner-Wiederholung
│  ├─ styles.css           Farbwelt aus dem Logo, dunkel und hell
│  ├─ theme.js             Hell/Dunkel und Farbpakete (Standard: dunkel, Alena)
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
│  ├─ data.js              Daten der einfachen Apps: ?app=ziele | todo | lernen
│                          | rezepte | rezeptbilder | arbeit
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
| `CRON_SECRET` | ein langes, frei gewähltes Geheimnis für den Erinnerungsdienst |
| `SETUP_TOKEN` | ein langes, frei gewähltes Geheimnis |

Die Schlüssel lassen sich auch im Host-Bereich unter *Mitteilungen* erzeugen –
siehe „Mitteilungen einrichten“ weiter unten.

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
| **To-Dos** | **fertig** – unter `/todo` |
| Kalender | Kommt bald |
| Medikamente und Supplements | Kommt bald |
| **Periodentracker** | **fertig** – unter `/cycle` |
| **Lernatelier** | **fertig** – Französisch und Versicherungen unter `/lernen` |
| **Ziele** | **fertig** – unter `/ziele` |
| **Rezeptbuch** | **fertig** – unter `/rezepte` |

Der Host schaltet jede App pro Person mit einem Klick frei oder wieder ab —
beim Anlegen eines Logins direkt im Formular, später über die Chips auf der
Benutzerkarte. Die Liste steht in `api/_lib/redis.js` unter `MODULES`; wird
dort eine App auf `status: 'live'` mit `href` gesetzt, wird die Kachel im
App-Bereich anklickbar statt „Kommt bald“.

**Vollzugang.** Der Chip *Alle – auch künftige* setzt `alleApps` am Konto.
Solche Konten bekommen jede App, die später in `MODULES` dazukommt,
automatisch — ohne dass das Login angefasst werden muss. Wird eine einzelne
App abgewählt, endet der Vollzugang, und die bis dahin geltenden Apps bleiben
als feste Auswahl stehen.

---

## Einstellungen für Nutzerinnen und Nutzer

Unter `/einstellungen`, erreichbar aus dem App-Bereich.

**Benachrichtigungen.** Zuerst das Gerät: Mitteilungen erlauben, Testmitteilung
schicken. Darunter je App ein eigener Abschnitt — und zwar nur für die Apps,
die für dieses Konto freigeschaltet sind. Der Periodentracker bringt seine
beiden Anlässe schon mit (Pille, Periode) samt Uhrzeit und Vorlauf; die übrigen
Apps zeigen, was sie später melden werden.

**Darstellung.** Hell oder dunkel, dazu sechs Farbpakete: *Alena* (Indigo und
Flieder), *Gold* (Schwarz und Gold), *Ozean*, *Rosé*, *Wald* und *Graphit*.
Jedes Paket hat eine dunkle und eine helle Fassung. Die Wahl gilt pro Gerät
und bleibt im Browser gespeichert.

Neue Pakete kommen so dazu: Grundfarben in `gen-palettes.py` eintragen, Skript
laufen lassen, den erzeugten Block oben in `public/styles.css` ersetzen und das
Paket in `public/theme.js` unter `PAKETE` ergänzen.

**Konto.** Passwort ändern und abmelden.

---

## Angemeldet bleiben

Im Login steht ein Häkchen. Ohne Haken ist das Cookie ein reines
Sitzungscookie: es verschwindet mit dem Browser, und die Sitzung in Redis läuft
nach zwölf Stunden ab. Mit Haken halten beide 90 Tage. In jedem Fall ist das
Cookie `HttpOnly`, `Secure` und `SameSite=Lax`.

---

## Systemlage im Host-Bereich

Die Karte rechts oben fragt bei jedem Aufruf nach:

| Ampel | Bedeutung |
|---|---|
| grün | in Ordnung |
| gelb | läuft, aber etwas fehlt (QStash ohne Zeitplan, `SETUP_TOKEN` noch gesetzt) |
| grau | nicht eingerichtet |
| rot | antwortet nicht |

Redis wird dabei wirklich abgefragt, mit Antwortzeit, QStash ebenso. So lässt
sich auf einen Blick sehen, ob eine Störung an der Datenbank, am Taktgeber oder
an fehlenden Schlüsseln liegt.

---

## Ziele

Unter `/ziele`. Die Daten liegen in `alena:app:ziele:<benutzer>`.

Ein Ziel bekommt Titel, Status, ein Datum und eine Notiz. Angeklickt öffnet es
sich rechts, und dort lassen sich **beliebig viele Schritte** ergänzen. Jeder
Schritt hat einen eigenen Status; der Haken setzt ihn direkt auf *geschafft*.

Fünf Stände, für Ziele wie für Schritte:

| Status | Bedeutung |
|---|---|
| Offen | noch nicht angefangen |
| In Arbeit | läuft gerade |
| Pendent | wartet auf etwas anderes |
| Geschafft | erledigt |
| Verworfen | bewusst fallengelassen |

**Fortschritt** rechnet aus den Schritten: geschaffte durch vorhandene, wobei
verworfene Schritte nicht mitzählen – sie wurden ja absichtlich gestrichen.
Ein Ziel ohne Schritte steht auf null; steht es auf *geschafft*, auf voll.

**Im Dashboard** erscheint unter der Begrüssung ein Ziel wie ein Zitat, mit
Fortschrittsbalken. Ausgewählt wird zufällig unter den offenen Zielen – aber
stabil für den ganzen Tag, damit die Anzeige beim Neuladen nicht springt. Erst
wenn alle Ziele erledigt sind, erscheint auch ein abgeschlossenes.

### Weitere Apps anschliessen

`/api/data` ist der gemeinsame Speicher für einfache Apps. Eine neue App
braucht dort nur einen Eintrag in `api/_lib/appdata.js` unter `APPS` mit ihrem
Prüfer – keine neue Serverless Function. Das hält Abstand zum Limit von zwölf.

---

## To-Dos

Die Liste unter `/todo` ist bewusst schlicht gehalten und merkt sich, was
immer wiederkehrt.

**Sortieren.** Über der Liste steht die Reihenfolge: eigene Reihenfolge,
Fälligkeit, Priorität, alphabetisch oder zuletzt hinzugefügt. Die Wahl wird
mitgespeichert und gilt beim nächsten Öffnen wieder.

**Gedächtnis.** Jeder Titel, der eingetragen wird, landet im `verlauf`. Ab der
zweiten Verwendung gilt ein Eintrag als „oft gebraucht“ (`OFT_AB` in
`public/todo-core.js`). Gross- und Kleinschreibung, doppelte Leerzeichen und
Satzzeichen am Ende spielen dabei keine Rolle: „Milch kaufen!“ und
„milch  kaufen“ sind derselbe Eintrag.

**Vorschläge.** Ganz unten stehen unter „Häufig eingetragen“ die oft
gebrauchten Titel mit ihrer Anzahl. Ein Klick trägt sie wieder ein. Was
gerade offen ist, wird nicht vorgeschlagen.

**Überfällig zuoberst.** Alles, dessen Datum vorbei ist, steht in einem
eigenen Abschnitt über der Liste – und darin zuoberst die Sachen, die immer
wieder eingetragen werden. Genau die gehen im Alltag am ehesten unter.

**Favoriten.** Ein Stern hebt eine Aufgabe in einen eigenen Abschnitt über
die übrigen offenen.

**Wieder aktivieren.** Erledigtes bleibt im aufklappbaren Archiv. Der Knopf
*Wieder aktivieren* holt einen Eintrag zurück in die offene Liste.

Gespeichert wird über `/api/data?app=todo`, geprüft in
`api/_lib/appdata.js`: höchstens 500 Aufgaben und 300 Einträge im Gedächtnis,
wobei die seltensten zuerst wegfallen.




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

## Rezeptbuch

Unter `/rezepte`. Ein Rezept besteht aus Zutaten, Schritten und wahlweise
einem Foto.

**Erfassen.** Zutaten mit Menge, Einheit und Name; Schritte als Text, jeder
mit optionaler Dauer. Das Foto wird im Browser auf 900 Pixel verkleinert und
als JPEG gespeichert – ein Bild pro Rezept, höchstens rund 300 KB.

**Bilder liegen getrennt.** Die Rezeptliste kommt aus
`/api/data?app=rezepte`, die Bilder aus `?app=rezeptbilder`. So lädt die
Übersicht sofort und die Bilder kommen nach. Beide hängen am Modul `rezepte`.

**Kochmodus.** Zuerst die Zutaten zum Abhaken, dann jeder Schritt einzeln in
grosser Schrift, zuletzt der Gruss. Dabei:

- **Portionen** lassen sich im Kochmodus ändern; die Mengen rechnen mit.
  Brüche werden verstanden (`1/2`, `1 1/2`) und wieder als `½` ausgegeben.
  Was keine Menge hat – „Salz“ – bleibt, wie es ist.
- **Wecker** je Schritt, wenn eine Dauer erfasst ist.
- Der **Bildschirm bleibt an** (Wake Lock), solange gekocht wird.
- Pfeiltasten blättern, Escape beendet.
- Am Ende zählt Alena das Rezept als gekocht – daraus wird die Sortierung
  „am häufigsten gekocht“.

---

## Arbeit

Unter `/arbeit`. Beim ersten Öffnen wird eine **Branche** gewählt; die Wahl
bleibt im Login.

| Branche | Nennt die Einträge | Boards |
|---|---|---|
| Versicherungen | Kunden | Neukunden · Offerten · Bestand · Schäden |
| Treuhand und Steuern | Mandate | Steuererklärungen · Buchhaltung · Abschlüsse |
| Handwerk und Bau | Aufträge | Anfragen · Baustellen · Abgeschlossen |
| Immobilien | Objekte | Akquise · Vermarktung · Verkauft |
| Gesundheit und Praxis | Klientinnen und Klienten | Neuanmeldungen · Laufend · Abgeschlossen |
| Verkauf und Handel | Kontakte | Leads · Verhandlung · Gewonnen |
| Allgemein | Einträge | Offen · Laufend · Erledigt |

Die Branche ist nur die **Startaufstellung**. Boards und Status lassen sich
danach umbenennen, ergänzen, einfärben und löschen – unter *Boards und
Status*. Wird ein Board oder Status entfernt, wandern die Einträge auf das
erste Board beziehungsweise den ersten Status statt zu verschwinden.

**Ein Eintrag** hat Name, Firma, Kontakt und Notiz, liegt auf genau einem
Board mit genau einem Status, und führt zwei Listen:

- **Status-Updates** – datierte Notizen, was passiert ist. Das jüngste steht
  auf der Karte, alle zusammen bilden unten den Verlauf „Zuletzt passiert“.
- **Aufgaben** – mit Frist; überfällige werden rot und zählen in der
  Kennzahl oben.

Die Kennzahlen zeigen Einträge, offene Aufgaben, überfällige und – als
stiller Hinweis – wie viele Einträge noch gar kein Update haben.

---

## Lernatelier

Das Lernatelier hat zwei Ebenen: **Fach** und **Unterfach**. Beide werden ganz
oben gewählt; darunter wechseln Kapitel, Niveaus und Übungsarten mit.

| Fach | Unterfach | Stoff |
|---|---|---|
| Französisch | Wortschatz | *Le vocabulaire de base* – 35 Kapitel, 1760 Einträge |
| Versicherungen | Leben | VBV/AFA – Vorsorge und Sozialversicherungen, 32 Kapitel, 412 Einträge |

### Ein Unterfach ergänzen

Ein Datenmodul in `public/` anlegen, das `NIVEAUS`, `KAPITEL` und `ALLE_ITEMS`
exportiert, und in `public/lern-faecher.js` einen Eintrag ergänzen. Ein Eintrag
ist `{ id, kapitel, vorne, hinten, niveau }`; `sprich` sagt der Sprachausgabe,
was vorzulesen ist (nur Französisch hat das). Wer eigene Fälle mitbringt,
exportiert zusätzlich `FAELLE` – dann steht die Übung *Vorsorgegrafik* zur
Verfügung. Das Unterfach bestimmt über `modi`, welche Übungsarten überhaupt
angeboten werden. Kapitelkennungen müssen über alle Fächer hinweg eindeutig
sein, weil der Lernstand daran hängt; die Versicherungskapitel tragen deshalb
den Vorsatz `vbv-`.

---

## Versicherungen – Leben

Der Stoff für die **VBV/AFA-Prüfung, Modul Leben**: **32 Kapitel, 412
Einträge**, Ansätze **2026**. Nichts ist dazuerfunden – eine Testprüfung
vergleicht jede Zahl im Datensatz mit den geprüften Kennzahlen und meldet jede
Zahl ohne Beleg.

### Kapitel

**Grundlagen und erste Säule**

| Kapitel | Inhalt |
|---|---|
| Das Drei-Säulen-System | Aufbau, Zweck je Säule, Art. 111 BV, 3a gegen 3b |
| Finanzierungsverfahren | Ausgabenumlage, Kapitaldeckung, Bedarfsdeckung – wie sie funktionieren, wo sie gelten, wo ihre Schwäche liegt |
| Erste Säule – AHV | Beiträge, Renten, Skala 44, Splitting, Erziehungs- und Betreuungsgutschriften |
| Frühpensionierung und Aufschub | Vorbezug, Kürzungssätze, Aufschub, Wirkung in allen drei Säulen |
| Erste Säule – IV | Eingliederung vor Rente, stufenloses Rentensystem, Wartezeit, Kinderrente |
| Erste Säule – EO | Dienst, Mutterschaft, Entschädigung des anderen Elternteils |
| Erste Säule – ALV | Beiträge, Taggeld 70/80 %, Anzahl Taggelder, Rahmenfrist |
| Ergänzungsleistungen | Lebensbedarf, Vermögensschwelle, Berechnung, Rückerstattung |

**Zweite Säule**

| Kapitel | Inhalt |
|---|---|
| Zweite Säule – Grundlagen | Eintrittsschwelle, Koordinationsabzug, koordinierter Lohn, Obligatorium und Schattenrechnung |
| Zweite Säule – Sparen | Altersgutschriften, Umwandlungssatz, Einkauf, Freizügigkeit |
| Zweite Säule – Risiko | Invaliden- und Hinterlassenenrenten, Prämienbefreiung, Begünstigung |
| Wohneigentumsförderung | Vorbezug und Verpfändung, Mindestbetrag, Fristen, Steuerfolgen |

**Dritte Säule und Produkte**

| Kapitel | Inhalt |
|---|---|
| Dritte Säule | 3a-Maxima, Bezugsgründe, Bank gegen Versicherung, Abgrenzung 3b |
| Säule 3a in der Praxis | Staffelung, Bezugsfenster, Einzahlung nach dem Referenzalter, Nachzahlung von Beitragslücken |
| Säule 3b in der Praxis | Freie Vorsorge, Verfügbarkeit, Begünstigung, Gestaltung |
| Produkte der Lebensversicherung | Risiko, gemischt (Risiko- und Sparteil, Prämienbestandteile), Leibrente, Rückgewähr, fondsgebunden |
| Qualifizierte Lebensversicherung | Begriff nach VAG, Abgrenzung zur klassischen Police, Angemessenheitsprüfung, Dokumentation |
| Das Basisinformationsblatt | Wofür BIB steht, die fünf Pflichtangaben, Anlagen und Währungen, Kosten, höchstmöglicher Verlust, Verständlichkeit, Umfang |
| Begünstigung in der Säule 3a | Die fünf Ränge nach Art. 2 BVV 3 und wie viel Spielraum je Rang besteht |
| Steuern in der Vorsorge | Abzüge, Kapitalleistungen, Renten, Leibrenten nach neuem Recht |
| Besteuerung nach Säule und Leistung | Die ganze Matrix: welche Steuer welche Leistung trifft, von der 2.-Säule-Rente bis zur gemischten 3b-Police |
| Begünstigung und Erbrecht | Begünstigtenordnung, Pflichtteile nach dem Erbrecht 2023 |

**Weitere Zweige und Beratung**

| Kapitel | Inhalt |
|---|---|
| Unfallversicherung UVG | Deckung, Taggeld, Rente, Komplementärrente, Nachdeckung, Abredeversicherung |
| Krankentaggeld | VVG gegen KVG, Wartefristen, Übertrittsrecht, Kürzung wegen IV |
| Hinterlassenenleistungen | Witwen-, Witwer- und Waisenrenten über alle Säulen, Voraussetzungen, Konkubinat |
| Welche Renten gibt es? | Alle Rentenarten der Zweige mit ihren Prozentsätzen |
| Kürzungen und Koordination | Überentschädigung, die beiden 90-%-Grenzen, was nie gekürzt wird |
| Der Versicherungsvertrag | VVG: Antrag, Widerruf, Anzeigepflicht, Kündigung |
| Risikoprüfung | Gesundheitsfragen, Vorbehalte, Anzeigepflichtverletzung |
| Beratung und Aufsicht | FINMA, Vermittlerregister, Informationspflichten |
| Vorsorgeanalyse | Vorgehen, Lückenberechnung, Prioritäten |
| Wichtige Begriffe | Die Fachwörter, die in der Prüfung vorausgesetzt werden |

Die beiden Dossier-Fälle (Berger und Nessier) sind entfernt; damit entfällt
auch die Übungsart *Vorsorgegrafik* in diesem Unterfach.

### Niveaus

| Stufe | Was drinsteckt | Einträge |
|---|---|---|
| Grundlagen | Kennzahlen, Fristen, Systemaufbau | 75 |
| Fallwerte | Renten, Beiträge, Grenzwerte, Fristen im Fall | 137 |
| Zusammenhänge | Verfahren, Koordination, Kürzungen, Kontrollfragen | 135 |
| Prüfungsreif | Rechenwege, Feinheiten, Stolpersteine, Beratung | 65 |

### Woher die Zahlen stammen

Die Kapitel stützen sich auf die **geprüften Sozialversicherungszahlen 2026**,
abgerufen bei ahv-iv.ch, bsv.admin.ch, bag.admin.ch, seco.admin.ch und
ssk-csi.ch, dazu die Aufsichts- und Vorsorgeregeln aus VAG, AVO und
BVV 3 (fedlex.admin.ch, faq.bsv.admin.ch, finma.ch, svv.ch, vbv.ch) und die
kantonalen Steuermerkblätter zur Vorsorgebesteuerung (ag.ch, baselland.ch, gr.ch), sowie auf die gesetzlichen Grundzüge (AHVG, IVG, EOG, AVIG, BVG,
FZG, UVG, VVG, VAG, DBG, ZGB). Sie liegen in `kennzahlen.json` neben dem
Generator; eine Testprüfung vergleicht jede Zahl im Datensatz mit dieser Datei
und meldet jede Zahl ohne Beleg. Ändern sich die Ansätze, wird
`kennzahlen.json` angepasst und der Generator neu ausgeführt.

Hören und Satzbau bietet dieses Fach nicht an: Es gibt keine Sprache zum
Vorlesen, und Merksätze aus Wortkacheln zu legen übt nichts. Beim **Tippen**
kommen nur Einträge mit einer Antwort von höchstens 60 Zeichen – längere
gehören auf Karteikarten. Zahlen werden nachsichtig geprüft: `4713`, `4'713`
und `4 713` gelten alle, eine falsche Zahl bleibt aber falsch, „fast“ gibt es
dort nicht.

---

## Lernatelier – Französisch

Unter `/lernen` steckt der Wortschatz aus *Französisch Coaching, Dossier 3 –
Listes de vocabulaire*: **35 Kapitel, 1760 Einträge**, aus dem PDF gelesen und
gegen ein französisches und ein deutsches Wörterbuch geprüft.

### Niveaus

Jeder Eintrag trägt eine Stufe. Sie ergibt sich aus dem Kapitel und wird pro
Wort nachjustiert – lange Wendungen rutschen eine Stufe hoch, kurze
Allerweltswörter eine hinunter.

| Stufe | Was drinsteckt | Einträge |
|---|---|---|
| Einfach | Grundwortschatz: Zahlen, Familie, Körper, Küche | 726 |
| Mittel | Alltag: Kleider, Sport, Berufe, Gesundheit, Schule | 540 |
| Schwer | Charakter, Medien, Künste, Arbeitsbedingungen | 353 |
| BM1 | Umwelt, Politik, Meinung äussern, Text gliedern | 141 |

Niveau und Kapitel lassen sich frei kombinieren. Ohne Auswahl kommt alles dran.

### Aufbau – die Übungsart, die mitwächst

Standard ist **Aufbau**. Dort richtet sich die Übung danach, wie gut ein
Eintrag schon sitzt:

| Stufe | Ab Kästchen | Übung |
|---|---|---|
| 1 · Erkennen | 0 | Auswahl aus vier Möglichkeiten, Vorderseite → Rückseite |
| 2 · Umgekehrt | 2 | Auswahl in der schwierigeren Richtung |
| 3 · Schreiben | 3 | Selber tippen – jetzt gilt der Eintrag als gesessen |

Jede richtige Antwort hebt ein Kästchen, jede falsche wirft auf Stufe 1
zurück. Wer also zweimal richtig gewählt hat, wird beim dritten Mal
umgekehrt gefragt und danach zum Schreiben aufgefordert. Ist die Antwort
länger als 60 Zeichen, bleibt es auch auf Stufe 3 bei der Karteikarte – ein
dreizeiliger Merksatz gehört nicht abgetippt.

Über den Kapiteln steht, wie sich die Auswahl verteilt: „38× erkennen · 0×
umgekehrt · 0× schreiben“.

### Übungsarten

| Art | Was passiert |
|---|---|
| **Karteikarten** | Wort ansehen, umdrehen, selbst einschätzen. |
| **Auswahl** | Vier Möglichkeiten, die Ablenker stammen aus demselben Kapitel. |
| **Tippen** | Selber schreiben. Der Tipp verrät gestuft mehr. |
| **Satzbau** | Die Wendung aus vorgegebenen Bausteinen legen – mit Störern dazwischen. |
| **Zuordnen** | Fünf Paare verbinden. |
| **Hören** | Alena spricht französisch vor, du schreibst mit. |

Der Satzbau nimmt nur Einträge mit mindestens drei Wörtern; sonst wäre es keine
Übung. Übungsarten, für die die Auswahl nicht reicht, sind ausgegraut statt
versteckt.

### Wie geprüft wird

Beim Tippen ist die Prüfung nachsichtig, wo es nichts mit Können zu tun hat:
fehlende Akzente, fehlender Artikel, Gross- und Kleinschreibung, `oe` statt `œ`
und der Hinweis `(m.)` sind egal. Bei mehreren Übersetzungen genügt eine.
Ein einzelner Tippfehler gilt als *fast* – zählt als richtig, zeigt aber die
saubere Schreibweise. Wer vorher zweimal den Tipp geholt hat, bekommt
höchstens *fast*.

### Lernplan

Über den Kapiteln steht der Lernplan: Zieldatum, Wochentage und ein
Mindestpensum pro Tag. Daraus rechnet Alena, was heute nötig wäre:

    nötig heute = max(Wunschpensum, offene Einträge ÷ verbleibende Lerntage)

Wer einen Tag auslässt, sieht das Pensum am nächsten Tag steigen – niemand
muss selbst nachrechnen. *Tagespensum starten* beginnt eine Runde mit genau
der Anzahl, die heute noch fehlt. Als offen gilt, was noch nicht auf Stufe 3
sitzt.

### Lernstand

Der Lernstand hängt am Login und wird während der Runde alle fünf Antworten
gesichert – ein geschlossenes Fenster kostet höchstens vier Antworten.

Die Prozentzahl misst, wie voll die Leitner-Kästchen sind: jede Karte kann
vier Stufen füllen, 100 % heisst, dass alles zuoberst liegt. Das wächst
langsamer als „schon einmal angeschaut“, beschreibt den Stand aber ehrlich.

Neben dem Lernstand legt die App je Unterfach eine kurze Zusammenfassung ab
(`stand` im Datensatz: gesamt, geübt, sitzt, fällig, Prozent). Die Startseite
liest nur diese Zeilen und zeigt daraus die Karte **Lernstand** mit Balken je
Fach – so muss sie den Wortschatz nicht laden.

### Wiederholung

Jede Vokabel wandert durch fünf Fächer (Leitner): richtig hebt sie eine Stufe,
falsch wirft sie ganz zurück. Die Abstände sind 0, 1, 3, 7 und 21 Tage. Beim
Zusammenstellen einer Runde kommt zuerst, was fällig ist, dann Ungeübtes,
zuletzt der Rest. Über den Kapiteln zeigen die Knöpfe *Nur fällige* und
*Nur ungeübte* genau diese Auswahl.

Der Lernstand liegt unter `/api/data?app=lernen` – höchstens 4000 Karten und
die letzten 50 Runden. Die zuletzt gewählte Einstellung wird mitgespeichert,
damit *Los* beim nächsten Mal gleich passt.

### Wortschatz ergänzen oder ändern

Alles steht in `public/franz-daten.js`. Ein Kapitel ist
`{ id, nr, titel, deutsch, w: [[französisch, deutsch, niveau], …] }`,
Niveau ist `e`, `m`, `s` oder `b`. Neue Kapitel brauchen keinen weiteren
Code – die App liest die Liste, wie sie ist.

---

## Mitteilungen einrichten

Der Host-Bereich hat dafür die Karte **Mitteilungen**. Steht dort *Versand
steht still*, fehlen die Schlüssel – und ohne sie kommt bei niemandem etwas an,
egal wie viele Geräte angemeldet sind.

1. Im Host-Bereich auf **Schlüssel erzeugen** tippen. Alena erzeugt ein
   VAPID-Paar und gleich ein `CRON_SECRET` dazu.
2. Die vier Werte in Vercel unter **Settings → Environment Variables**
   eintragen. Sie erscheinen nur dieses eine Mal.
3. Einmal **Redeploy** auslösen.
4. Zurück im Host-Bereich: die Karte meldet *Versand bereit*. Darunter
   **Zeitplan einrichten** im Erinnerungsdienst anklicken, damit QStash den
   Takt gibt.
5. Auf dem eigenen Gerät unter *Einstellungen → Mitteilungen* erlauben und mit
   **Probemitteilung** prüfen, ob sie ankommt.

Die Schlüssel lassen sich jederzeit neu erzeugen – aber jedes bereits
angemeldete Gerät wird dadurch ungültig und muss die Mitteilungen neu
erlauben. Die Karte zeigt an, wie viele Geräte noch am alten Schlüssel hängen,
und räumt sie auf Wunsch weg.

### Wenn nichts ankommt

Die Probemitteilung nennt den Grund, statt still nichts zu tun:

| Meldung | Bedeutung |
|---|---|
| `VAPID_… fehlt` | Schritt 1–3 oben ist noch offen. |
| `… ist zu kurz` | Beim Kopieren wurde der Schlüssel abgeschnitten. |
| „kennt noch den alten Push-Schlüssel“ | Die Schlüssel wurden gewechselt. Das Gerät muss neu erlauben; das Abo wird dabei automatisch entfernt. |
| „hat die Mitteilungen abbestellt“ | Im Betriebssystem oder Browser abgeschaltet. |
| „Für dieses Konto ist kein Gerät angemeldet“ | Auf dem Gerät wurde noch nie *Erlauben* gedrückt – auf dem iPhone siehe unten. |
| „Der Push-Dienst bremst gerade“ | Vorübergehend; das Abo bleibt bestehen. |

Beim Öffnen der App prüft Alena still, ob das Abo noch zum Serverschlüssel
passt, und meldet das Gerät nötigenfalls neu an. Tauscht der Browser das Abo
von sich aus aus, fängt der Service Worker das ab. Beides zusammen ist der
Grund, warum Mitteilungen sonst irgendwann unbemerkt versiegen.

Im Host-Bereich steht unter der Karte ausserdem, wann der Erinnerungsdienst
zuletzt gelaufen ist und was dabei herauskam.

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
