"""Baut aus dem VBV-JSON den Datensatz für das Lernatelier.

Es wird nichts erfunden: jede Karte hat ihre Entsprechung in der Quelle.
"""
import json, io, re

G = json.load(open('kennzahlen.json', encoding='utf-8'))

CHF = lambda n: f"{n:,}".replace(',', "'")


def geld(n, zusatz='im Monat'):
    return f"{CHF(n)} {zusatz}".strip()


kapitel = []


def kap(kid, titel, deutsch):
    k = {'id': kid, 'titel': titel, 'deutsch': deutsch, 'w': []}
    kapitel.append(k)
    return k


def add(k, vorne, hinten, niveau):
    k['w'].append([vorne, hinten, niveau])


# Die Systemkapitel stehen vor den Fällen – erst das Gerüst, dann die Rechnung.
for sk in json.load(open('system.json', encoding='utf-8')):
    kapitel.append({'id': sk['id'], 'titel': sk['titel'], 'deutsch': sk['deutsch'], 'w': sk['w']})

# ------------------------------------------------------------------ Fälle
# Die beiden Dossier-Fälle sind auf Wunsch entfernt; ohne sie gibt es hier
# keine Vorsorgegrafik. Das Feld bleibt bestehen, damit ein späteres
# Unterfach es wieder füllen kann.
faelle = []

for i, k in enumerate(kapitel, 1):
    k['nr'] = i

kopf = '''/* ==========================================================================
   Alena – Versicherungen / Leben
   Quelle: geprüfte Schweizer Sozialversicherungs- und Vorsorgezahlen (Stand %s)
   von ahv-iv.ch, bsv.admin.ch, bag.admin.ch, seco.admin.ch, ssk-csi.ch
   sowie die gesetzlichen Grundzüge (%s).
   Aufbau je Eintrag: [vorne, hinten, niveau]
   Niveau: e = Grundlagen, m = Fallwerte, s = Zusammenhänge, p = Prüfungsreif
   ========================================================================== */

export const NIVEAUS = [
  { id: 'e', name: 'Grundlagen',    beschreibung: 'Kennzahlen, Fristen, Ausgangslagen.' },
  { id: 'm', name: 'Fallwerte',     beschreibung: 'Renten, Phasen, Totale und Lücken.' },
  { id: 's', name: 'Zusammenhänge', beschreibung: 'Koordination, Kürzungen, Kontrollfragen.' },
  { id: 'p', name: 'Prüfungsreif',  beschreibung: 'Rechenwege, Stolpersteine, Beratung.' },
];

export const KENNZAHLEN = %s;

export const KAPITEL = %s;

/* Vorne steht die Frage, hinten die Antwort. Vorgelesen wird hier nichts. */
export const ALLE_ITEMS = KAPITEL.flatMap((k) =>
  k.w.map(([vorne, hinten, n], i) => ({
    id: `${k.id}:${i}`, kapitel: k.id, vorne, hinten, niveau: n,
  })));

/* Für die Übung „Vorsorgegrafik“: die Phasen in ihrer richtigen Reihenfolge. */
export const FAELLE = %s;
''' % ('2026', 'AHVG, IVG, EOG, AVIG, BVG, FZG, UVG, VVG, VAG, DBG, ZGB',
       json.dumps(G, ensure_ascii=False, indent=1),
       json.dumps([{'id': k['id'], 'nr': k['nr'], 'titel': k['titel'],
                    'deutsch': k['deutsch'], 'w': k['w']} for k in kapitel],
                  ensure_ascii=False, indent=0),
       json.dumps(faelle, ensure_ascii=False, indent=1))

io.open('/home/claude/alena/public/vbv-daten.js', 'w', encoding='utf-8').write(kopf)

print(f"{len(kapitel)} Kapitel, {sum(len(k['w']) for k in kapitel)} Einträge, {len(faelle)} Fälle")
for k in kapitel:
    stufen = {}
    for _, _, n in k['w']:
        stufen[n] = stufen.get(n, 0) + 1
    print(f"{len(k['w']):3d}  {k['id']:26s} {k['titel']:46s} " +
          ' '.join(f'{n}:{c}' for n, c in sorted(stufen.items())))
