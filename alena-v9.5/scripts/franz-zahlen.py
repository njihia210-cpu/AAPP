"""Baut das Kapitel LES CHIFFRES neu: 0 bis 200 der Reihe nach, danach die
grossen Zahlen und Jahreszahlen. Nur die französische Variante – septante,
huitante und nonante kommen nicht vor.

Aufruf: python3 zahlen.py   (schreibt public/franz-daten.js an Ort und Stelle)
"""
import io
import json
import re

ZIEL = '/home/claude/alena/public/franz-daten.js'

# ------------------------------------------------------------------ Französisch
FR_EINER = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept',
            'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze',
            'quinze', 'seize']
FR_ZEHNER = {20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante'}


def fr_unter_hundert(n):
    if n < 17:
        return FR_EINER[n]
    if n < 20:                                    # 17–19
        return 'dix-' + FR_EINER[n - 10]
    if n < 70:                                    # 20–69
        zehner, rest = FR_ZEHNER[n // 10 * 10], n % 10
        if rest == 0:
            return zehner
        if rest == 1:                             # vingt et un, soixante et un
            return zehner + ' et un'
        return f'{zehner}-{FR_EINER[rest]}'
    if n < 80:                                    # 70–79
        if n == 71:
            return 'soixante et onze'
        return 'soixante-' + fr_unter_hundert(n - 60)
    rest = n - 80                                 # 80–99
    if rest == 0:
        return 'quatre-vingts'                    # das s fällt weg, sobald etwas folgt
    return 'quatre-vingt-' + fr_unter_hundert(rest)


def fr(n):
    if n < 100:
        return fr_unter_hundert(n)
    if n == 100:
        return 'cent'
    if n == 200:
        return 'deux cents'
    return 'cent ' + fr_unter_hundert(n - 100)


# ---------------------------------------------------------------------- Deutsch
DE_EINER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben',
            'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn',
            'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn']
DE_ZEHNER = {20: 'zwanzig', 30: 'dreissig', 40: 'vierzig', 50: 'fünfzig',
             60: 'sechzig', 70: 'siebzig', 80: 'achtzig', 90: 'neunzig'}


def de(n):
    if n < 20:
        return DE_EINER[n]
    if n < 100:
        zehner, rest = DE_ZEHNER[n // 10 * 10], n % 10
        if rest == 0:
            return zehner
        return ('ein' if rest == 1 else DE_EINER[rest]) + 'und' + zehner
    if n == 100:
        return 'hundert'
    if n == 200:
        return 'zweihundert'
    return 'hundert' + de(n - 100)


def zifferform(n):
    return f'{n:,}'.replace(',', "'")


# ------------------------------------------------------------------- Das Kapitel
def niveau(n):
    if n <= 20:
        return 'e'
    if n <= 100:
        return 'm'
    return 's'


w = [[fr(n), f'{de(n)} ({zifferform(n)})', niveau(n)] for n in range(201)]

# Hunderter über 200 hinaus: sie folgen derselben Regel und runden das Bild ab.
GROSS = [
    ('deux cent cinquante', 'zweihundertfünfzig', 250, 's'),
    ('trois cents', 'dreihundert', 300, 'm'),
    ('quatre cents', 'vierhundert', 400, 'm'),
    ('cinq cents', 'fünfhundert', 500, 'm'),
    ('six cents', 'sechshundert', 600, 'm'),
    ('sept cents', 'siebenhundert', 700, 'm'),
    ('huit cents', 'achthundert', 800, 'm'),
    ('neuf cents', 'neunhundert', 900, 'm'),
    ('neuf cent quatre-vingt-dix-neuf', 'neunhundertneunundneunzig', 999, 's'),
    ('mille', 'tausend', 1000, 'e'),
    ('mille un', 'tausendeins', 1001, 's'),
    ('mille cinq cents', 'tausendfünfhundert', 1500, 'm'),
    ('deux mille', 'zweitausend', 2000, 'm'),
    ('cinq mille', 'fünftausend', 5000, 'm'),
    ('dix mille', 'zehntausend', 10000, 'm'),
    ('vingt mille', 'zwanzigtausend', 20000, 'm'),
    ('cinquante mille', 'fünfzigtausend', 50000, 'm'),
    ('cent mille', 'hunderttausend', 100000, 'e'),
    ('cinq cent mille', 'fünfhunderttausend', 500000, 's'),
    ('un million', 'eine Million', 1000000, 'e'),
    ('deux millions', 'zwei Millionen', 2000000, 'm'),
    ('un milliard', 'eine Milliarde', 1000000000, 'e'),
    ('deux milliards', 'zwei Milliarden', 2000000000, 'm'),
]
for f, d, n, niv in GROSS:
    w.append([f, f'{d} ({zifferform(n)})', niv])

# Jahreszahlen werden im Französischen ausgeschrieben wie jede andere Zahl.
JAHRE = [
    ('mille neuf cent quarante et un', 1941),
    ('mille neuf cent quatre-vingt-onze', 1991),
    ('deux mille cinq', 2005),
    ('deux mille vingt-six', 2026),
]
for f, j in JAHRE:
    w.append([f, f'das Jahr {j}', 'm'])

REGELN = [
    ['Comment dit-on 70 en français ?', 'soixante-dix – wörtlich „sechzig-zehn“', 'e'],
    ['Comment dit-on 80 en français ?', 'quatre-vingts – wörtlich „vier-zwanzig“', 'e'],
    ['Comment dit-on 90 en français ?', 'quatre-vingt-dix – wörtlich „vier-zwanzig-zehn“', 'e'],
    ['Quand écrit-on « et un » ?', 'Bei 21, 31, 41, 51, 61 und 71 – sonst steht ein Bindestrich', 'm'],
    ['Quand « quatre-vingts » perd-il son s ?', 'Sobald etwas folgt: quatre-vingts, aber quatre-vingt-un', 's'],
    ['Quand « cent » prend-il un s ?', 'Im Plural am Ende der Zahl: deux cents, aber deux cent un', 's'],
    ['« Mille » prend-il un s ?', 'Nie – mille bleibt immer unverändert', 's'],
]
w.extend(REGELN)

# ----------------------------------------------------------------- Einsetzen
quelle = io.open(ZIEL, encoding='utf-8').read()
kopf, rest = quelle.split('export const KAPITEL = ', 1)
literal, fuss = rest.split('\n];\n', 1)
kapitel = json.loads(literal + '\n]')

for k in kapitel:
    if k['id'] == 'les-chiffres':
        k['w'] = w
        break
else:
    raise SystemExit('Kapitel les-chiffres nicht gefunden')

schweiz = [x for k in kapitel for x in k['w']
           if re.search(r'\b(septante|huitante|octante|nonante)', x[0])]
if schweiz:
    raise SystemExit(f'Schweizer Zahlwörter noch drin: {schweiz}')

neu = kopf + 'export const KAPITEL = ' + json.dumps(kapitel, ensure_ascii=False, indent=0) + '\n];\n' + fuss
io.open(ZIEL, 'w', encoding='utf-8').write(neu.replace('\n]\n];\n', '\n];\n'))

gesamt = sum(len(k['w']) for k in kapitel)
stufen = {}
for x in w:
    stufen[x[2]] = stufen.get(x[2], 0) + 1
print(f'{len(kapitel)} Kapitel, {gesamt} Einträge – LES CHIFFRES: {len(w)} '
      f'({" ".join(f"{n}:{c}" for n, c in sorted(stufen.items()))})')
