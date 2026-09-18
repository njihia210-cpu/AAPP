"""Baut das Fach Englisch, Kapitel 1: German-English Vocabulary List for Job
Interviews (KV Zürich, I. Montaguti & M. Ingletti, 2025).

Aus dem Handout abgeschrieben – die acht Unterkategorien werden zu acht
Kapiteln, genau wie die Kapitel im Französisch-Dossier.

Aufruf: python3 bau.py   (schreibt public/eng-daten.js)
"""
import io
import json

ZIEL = '/home/claude/alena/public/eng-daten.js'

# Je Abschnitt: (Nummer, englischer Titel, deutscher Titel, [[englisch, deutsch], …])
ABSCHNITTE = [
    (1, 'General Terms', 'Allgemeine Begriffe', [
        ['job interview', 'das Vorstellungsgespräch'],
        ['application', 'die Bewerbung'],
        ['CV / resume', 'der Lebenslauf'],
        ['cover letter', 'das Anschreiben'],
        ['employer', 'der Arbeitgeber'],
        ['employee', 'der Arbeitnehmer'],
        ['mentor', 'der Mentor / die Mentorin'],
        ['supervisor', 'die Aufsichtsperson'],
        ['former apprentices', 'ehemalige Auszubildende'],
        ['apprentice', 'die/der Auszubildende/r'],
        ['position / job', 'die Stelle / Position'],
        ['company / business', 'die Firma / das Unternehmen'],
        ['department', 'die Abteilung'],
        ['accounting / finance department', 'die Buchhaltung'],
        ['sales department', 'der Vertrieb'],
        ['production department', 'die Produktionsabteilung'],
        ['purchasing department', 'die Einkaufsabteilung'],
        ['warehouse', 'das Lager'],
        ['branch (of industry)', 'die Branche'],
        ['branch (of a company)', 'die Filiale'],
        ['company headquarters', 'der Hauptsitz'],
    ]),
    (2, 'Education & Qualifications', 'Ausbildung und Qualifikationen', [
        ['vocational training / apprenticeship', 'die Ausbildung'],
        ['studies / university education', 'das Studium'],
        ['degree', 'der Abschluss'],
        ['university', 'die Universität'],
        ['university of applied sciences', 'die Fachhochschule'],
        ['certificate', 'das Zertifikat'],
        ['further training', 'die Weiterbildung'],
        ['additional training', 'zusätzliche Weiterbildung'],
        ['knowledge / skills', 'die Kenntnisse'],
        ['language skills', 'die Sprachkenntnisse'],
        ['task', 'die Aufgabe'],
        ['trained', 'ausgebildet / geschult'],
    ]),
    (3, 'Work Experience', 'Berufserfahrung', [
        ['work experience', 'die Berufserfahrung'],
        ['previous work experience', 'bisherige Berufserfahrung'],
        ['greatest achievement', 'der grösste Erfolg'],
        ['internship', 'das Praktikum'],
        ['full-time job', 'die Vollzeitstelle'],
        ['part-time job', 'die Teilzeitstelle'],
        ['volunteer experience', 'die ehrenamtliche Erfahrung'],
        ['employment relationship', 'das Arbeitsverhältnis'],
        ['previous duties', 'bisherige Tätigkeiten'],
        ['responsibility', 'die Verantwortung'],
        ['qualities', 'die Eigenschaften'],
        ['qualifications', 'die Qualifikationen'],
        ['project', 'das Projekt'],
        ['team', 'das Team'],
        ['manager / executive', 'die Führungskraft'],
        ['suitable (candidate; solution; method, etc.)', 'geeignet'],
        ['tight deadline', 'enge Frist'],
    ]),
    (4, 'Personal Strengths', 'Persönliche Stärken', [
        ['reliable', 'zuverlässig'],
        ['team-oriented', 'teamfähig'],
        ['committed', 'engagiert'],
        ['goal-oriented', 'zielstrebig'],
        ['resilient', 'belastbar'],
        ['organized', 'organisiert'],
        ['flexible', 'flexibel'],
        ['motivated', 'motiviert'],
        ['communicative', 'kommunikativ'],
        ['willing to learn', 'lernbereit'],
    ]),
    (5, 'Job Conditions', 'Vertragsbedingungen', [
        ['salary', 'das Gehalt'],
        ['working hours', 'die Arbeitszeit'],
        ['probation period', 'die Probezeit'],
        ['employment contract', 'der Arbeitsvertrag'],
        ['termination', 'die Kündigung'],
        ['vacation entitlement', 'der Urlaubsanspruch'],
        ['benefits', 'die Sozialleistungen'],
        ['place of work', 'der Arbeitsort'],
    ]),
    (6, 'Common Action Verbs', 'Häufige Aktionsverben', [
        ['achieve', 'erreichen'],
        ['adapt to', 'anpassen'],
        ['communicate', 'kommunizieren'],
        ['collaborate', 'zusammenarbeiten'],
        ['demonstrate', 'zeigen / demonstrieren'],
        ['develop', 'entwickeln'],
        ['lead', 'führen'],
        ['manage', 'leiten / verwalten'],
        ['organize', 'organisieren'],
        ['focus on', 'den Fokus legen auf'],
        ['resolve', 'lösen'],
        ['support', 'unterstützen'],
        ['train', 'schulen / trainieren'],
        ['implement', 'umsetzen'],
        ['motivate', 'motivieren'],
        ['negotiate', 'verhandeln'],
        ['give feedback on', 'Feedback geben zu'],
        ['handle remote work', 'Fernarbeit meistern'],
    ]),
    (7, 'Describing Yourself', 'Sich selbst beschreiben', [
        ['I am a dedicated person.', 'Ich bin eine engagierte Person.'],
        ['I enjoy working in a team.', 'Ich arbeite gerne im Team.'],
        ['I like taking responsibility.', 'Ich übernehme gerne Verantwortung.'],
        ['I am very eager to learn.', 'Ich bin sehr lernbereit.'],
        ['I am resilient and flexible.', 'Ich bin belastbar und flexibel.'],
        ['I work in a structured and organized way.', 'Ich arbeite strukturiert und organisiert.'],
        ['I am a quick learner.', 'Ich habe eine schnelle Auffassungsgabe.'],
        ['I handle stress well.', 'Ich kann gut mit Stress umgehen.'],
        ['I am goal-oriented and motivated.', 'Ich bin zielstrebig und motiviert.'],
        ['I am communicative and open-minded.', 'Ich bin kommunikativ und offen.'],
        ['I bring experience in [field/area].', 'Ich bringe Erfahrung in [Bereich] mit.'],
        ['I am willing to grow and develop.', 'Ich bin bereit, mich weiterzuentwickeln.'],
    ]),
    (8, 'Self-Description Starters', 'Satzanfänge zur Selbstbeschreibung', [
        # Im Handout steht „I would describe myself as…“ zweimal, einmal für
        # „Ich beschreibe mich selbst als…“ und einmal für „Ich würde mich
        # selbst als … bezeichnen“. Zwei gleiche Karten wären beim Zuordnen
        # nicht lösbar – darum stehen beide deutschen Formen auf einer Karte.
        ['I would describe myself as…',
         'Ich beschreibe mich selbst als… / Ich würde mich selbst als … bezeichnen'],
        ['People see me as…', 'Andere sehen mich als…'],
        ['My former colleagues would say I am…',
         'Meine früheren Kollegen würden sagen, ich bin…'],
        ["I'm known as…", 'Man kennt mich als…'],
        ["I'm considered someone who…", 'Ich gelte als jemand, der…'],
        ['In my previous job, I was known for…',
         'In meinem früheren Job war ich bekannt für…'],
        ["I'm often told that I…", 'Ich bekomme oft zu hören, dass ich…'],
    ]),
]

SCHLUESSEL = {1: 'general-terms', 2: 'education', 3: 'work-experience',
              4: 'strengths', 5: 'job-conditions', 6: 'action-verbs',
              7: 'describing-yourself', 8: 'starters'}


def niveau(nr, en):
    """Ganze Sätze sind schwer. Sonst entscheidet die Länge des Ausdrucks."""
    if nr >= 7:
        return 's'
    if '/' in en or len(en.split()) >= 3:
        return 'm'
    return 'e'


kapitel = []
for nr, en_titel, de_titel, paare in ABSCHNITTE:
    kapitel.append({
        'id': f'eng-{nr}-{SCHLUESSEL[nr]}',
        'nr': nr,
        'titel': f'{nr}. {en_titel}',
        'deutsch': de_titel,
        'w': [[en, de, niveau(nr, en)] for en, de in paare],
    })

# Keine Karte darf zweimal vorne dasselbe zeigen – sonst wird Zuordnen zum Raten.
vorne = [x[0] for k in kapitel for x in k['w']]
doppelt = {v for v in vorne if vorne.count(v) > 1}
if doppelt:
    raise SystemExit(f'Doppelte Einträge: {doppelt}')

kopf = '''/* ==========================================================================
   Alena – Englisch: Kapitel 1, Job Interviews
   Quelle: KV Zürich, „German-English Vocabulary List for Job Interviews“
   (I. Montaguti & M. Ingletti, 2025). Abgeschrieben, nichts dazuerfunden.
   Aufbau je Eintrag: [englisch, deutsch, niveau]
   Niveau: e = einfach, m = mittel, s = Sätze
   ========================================================================== */

export const NIVEAUS = [
  { id: 'e', name: 'Einfach', beschreibung: 'Grundbegriffe – kurze, häufige Wörter.' },
  { id: 'm', name: 'Mittel',  beschreibung: 'Fachbegriffe und mehrteilige Ausdrücke.' },
  { id: 's', name: 'Sätze',   beschreibung: 'Ganze Sätze und Satzanfänge fürs Gespräch.' },
];

export const KAPITEL = %s;

/* Vorne steht das Englische, hinten das Deutsche. `sprich` sagt der
   Sprachausgabe, was sie vorlesen soll. */
export const ALLE_ITEMS = KAPITEL.flatMap((k) =>
  k.w.map(([en, de, n], i) => ({
    id: `${k.id}:${i}`, kapitel: k.id, vorne: en, hinten: de, niveau: n, sprich: en,
  })));

export const SPRACHE = 'en-GB';
''' % json.dumps(kapitel, ensure_ascii=False, indent=0)

io.open(ZIEL, 'w', encoding='utf-8').write(kopf)

gesamt = sum(len(k['w']) for k in kapitel)
print(f'{len(kapitel)} Kapitel, {gesamt} Einträge')
for k in kapitel:
    stufen = {}
    for _, _, n in k['w']:
        stufen[n] = stufen.get(n, 0) + 1
    print(f"{len(k['w']):3d}  {k['id']:26s} {k['titel']:32s} "
          + ' '.join(f'{n}:{c}' for n, c in sorted(stufen.items())))
