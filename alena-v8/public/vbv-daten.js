/* ==========================================================================
   Alena – Versicherungen / Leben
   Quelle: VBV/AFA – Modul Leben, Vorsorgegrafiken (Stand 2026-09-02, Ansätze 2025).
   Aufbau je Eintrag: [vorne, hinten, niveau]
   Niveau: e = Grundlagen, m = Fallwerte, s = Zusammenhänge, p = Prüfungsreif
   ========================================================================== */

export const NIVEAUS = [
  { id: 'e', name: 'Grundlagen',    beschreibung: 'Kennzahlen, Fristen, Ausgangslagen.' },
  { id: 'm', name: 'Fallwerte',     beschreibung: 'Renten, Phasen, Totale und Lücken.' },
  { id: 's', name: 'Zusammenhänge', beschreibung: 'Koordination, Kürzungen, Kontrollfragen.' },
  { id: 'p', name: 'Prüfungsreif',  beschreibung: 'Rechenwege, Stolpersteine, Beratung.' },
];

export const GRUNDLAGEN = {
 "ansaetze": "2025",
 "skala": "Skala 44 (AHV/IV-Renten ab 01.01.2025)",
 "uvg_hoechstverdienst": 148200,
 "saeule_3a_maximum_mit_pk": 7258,
 "wartefristen": {
  "uvg_taggeld": "80 % ab Tag 3 (2 Karenztage)",
  "iv_rente": "12 Monate Wartezeit",
  "bvg_invalidenrente": "gemäss Reglement, üblich 720 oder 730 Tage",
  "ktg_vvg": "gemäss Vertrag, üblich 80 % ab Tag 31/61/91 bis Tag 720/730"
 },
 "koordination": {
  "uvg_komplementaerrente": "IV + UVG zusammen max. 90 % des versicherten Verdienstes (UVG Art. 20 Abs. 2)",
  "bvg_ueberentschaedigung": "Kürzung ab 90 % des mutmasslich entgangenen Verdienstes (BVG Art. 34a, BVV 2 Art. 24)",
  "saeule_3": "Summenversicherung – wird weder von IV noch BVG angerechnet"
 }
};

export const KAPITEL = [
{
"id": "vbv-grundlagen",
"nr": 1,
"titel": "Grundlagen und Kennzahlen",
"deutsch": "Ansätze, Skala und Höchstbeträge",
"w": [
[
"Welche Ansätze gelten in diesem Dossier?",
"Ansätze 2025",
"e"
],
[
"Welche Rentenskala liegt den AHV/IV-Renten zugrunde?",
"Skala 44 (AHV/IV-Renten ab 01.01.2025)",
"e"
],
[
"Wie hoch ist der UVG-Höchstverdienst?",
"148'200 im Jahr",
"e"
],
[
"Wie hoch ist der Maximalbetrag der Säule 3a mit Pensionskasse?",
"7'258 im Jahr",
"e"
],
[
"UVG-Höchstverdienst",
"148'200",
"e"
],
[
"Maximum Säule 3a mit PK",
"7'258",
"e"
]
]
},
{
"id": "vbv-wartefristen",
"nr": 2,
"titel": "Wartefristen",
"deutsch": "Wann welche Leistung einsetzt",
"w": [
[
"UVG-Taggeld: ab wann und wie hoch?",
"80 % ab Tag 3 (2 Karenztage)",
"e"
],
[
"IV-Rente: wie lange dauert die Wartezeit?",
"12 Monate Wartezeit",
"e"
],
[
"BVG-Invalidenrente: welche Wartefrist gilt?",
"gemäss Reglement, üblich 720 oder 730 Tage",
"m"
],
[
"Krankentaggeld nach VVG: was ist üblich?",
"gemäss Vertrag, üblich 80 % ab Tag 31/61/91 bis Tag 720/730",
"m"
],
[
"Wie viele Karenztage kennt das UVG-Taggeld?",
"2 Karenztage – das Taggeld läuft ab Tag 3",
"e"
],
[
"Wie hoch ist das UVG-Taggeld?",
"80 % des versicherten Verdienstes",
"e"
]
]
},
{
"id": "vbv-koordination",
"nr": 3,
"titel": "Koordination und Überentschädigung",
"deutsch": "Wer kürzt wann und warum",
"w": [
[
"UVG-Komplementärrente: welche Obergrenze gilt?",
"IV + UVG zusammen max. 90 % des versicherten Verdienstes (UVG Art. 20 Abs. 2)",
"s"
],
[
"BVG-Überentschädigung: ab welcher Grenze wird gekürzt?",
"Kürzung ab 90 % des mutmasslich entgangenen Verdienstes (BVG Art. 34a, BVV 2 Art. 24)",
"s"
],
[
"Wie wird die Säule 3 angerechnet?",
"Summenversicherung – wird weder von IV noch BVG angerechnet",
"s"
],
[
"Auf welche Grösse bezieht sich die UVG-Komplementärrente?",
"auf den versicherten Verdienst (UVG Art. 20 Abs. 2)",
"s"
],
[
"Auf welche Grösse bezieht sich die BVG-Überentschädigung?",
"auf den mutmasslich entgangenen Verdienst (BVV 2 Art. 24)",
"s"
],
[
"Warum wird eine Summenversicherung nicht angerechnet?",
"Sie ist keine Schadenversicherung – IV und BVG rechnen sie nicht an",
"s"
]
]
},
{
"id": "vbv-berger-lage",
"nr": 4,
"titel": "Fall Berger (Unfall) – Ausgangslage",
"deutsch": "Familie Berger – Erwerbsunfähigkeit infolge Unfall",
"w": [
[
"Berger: Um welche Aufgabe geht es?",
"Erstellen Sie die Vorsorgegrafik für die Erwerbsunfähigkeit von Martin Berger infolge Unfall (IV-Grad 100 %).",
"e"
],
[
"Berger: Wer ist die versicherte Person?",
"Martin Berger, 35 (12.07.1989), Informatiker, Pensum 100 %",
"e"
],
[
"Berger: Wie sieht die Familiensituation aus?",
"verheiratet seit 2016 mit Lisa (33, 60 %, AHV-Lohn 46'000), Kind Leon 4 Jahre",
"e"
],
[
"Berger: Wie hoch ist der AHV-Jahreslohn?",
"108'000",
"m"
],
[
"Berger: Wie hoch ist der Bedarf im Monat?",
"9'000 (100 % des bisherigen Einkommens)",
"m"
],
[
"Berger: Wie hoch ist das massgebende durchschnittliche Jahreseinkommen?",
"82'000",
"m"
],
[
"Berger: Wie lange läuft die Lohnfortzahlung?",
"100 % bis Tag 90",
"e"
],
[
"Berger: Wie hoch ist die BVG-Invalidenrente laut Vorsorgeausweis?",
"19'400 im Jahr",
"m"
],
[
"Berger: Wie hoch ist die BVG-Invalidenkinderrente laut Vorsorgeausweis?",
"3'870 im Jahr",
"m"
],
[
"Berger: Ab wann greift die Prämienbefreiung?",
"nach 6 Monaten",
"m"
],
[
"Berger: Wie hoch ist die freie Sparquote im Monat?",
"1'200",
"m"
],
[
"Berger: Wann wird das Referenzalter erreicht?",
"2054-08-01",
"m"
]
]
},
{
"id": "vbv-berger-loesung",
"nr": 5,
"titel": "Fall Berger (Unfall) – Leistungen und Phasen",
"deutsch": "Die Zahlen der Grafik",
"w": [
[
"Berger: Wie hoch ist die IV-Rente im Monat?",
"2'419",
"m"
],
[
"Berger: Wie hoch ist die IV-Kinderrente im Monat?",
"968",
"m"
],
[
"Berger: Wie hoch ist die UVG-Komplementärrente im Monat?",
"4'713",
"m"
],
[
"Berger: Wie hoch ist die BVG-Invalidenrente in der Grafik?",
"0 – sie wird vollständig gekürzt",
"m"
],
[
"Berger: Welche Leistungen laufen in der Phase „Tag 1–2“?",
"Arbeitgeber 9'000",
"s"
],
[
"Berger: Wie heisst die Phase Tag 1–2?",
"Karenzfrist UVG",
"e"
],
[
"Berger: Wie hoch ist das Total in der Phase „Tag 1–2“?",
"9'000",
"m"
],
[
"Berger: Wie gross ist die Lücke in der Phase „Tag 1–2“?",
"0 – der Bedarf ist gedeckt",
"m"
],
[
"Berger: Wie hoch ist der Deckungsgrad in der Phase „Tag 1–2“?",
"100 %",
"m"
],
[
"Berger: Welche Leistungen laufen in der Phase „Tag 3–90“?",
"Arbeitgeber 1'800 + UVG 7'200",
"s"
],
[
"Berger: Wie heisst die Phase Tag 3–90?",
"Lohnfortzahlung",
"e"
],
[
"Berger: Wie hoch ist das Total in der Phase „Tag 3–90“?",
"9'000",
"m"
],
[
"Berger: Wie gross ist die Lücke in der Phase „Tag 3–90“?",
"0 – der Bedarf ist gedeckt",
"m"
],
[
"Berger: Wie hoch ist der Deckungsgrad in der Phase „Tag 3–90“?",
"100 %",
"m"
],
[
"Berger: Welche Leistungen laufen in der Phase „Tag 91–720“?",
"UVG 7'200",
"s"
],
[
"Berger: Wie heisst die Phase Tag 91–720?",
"nur UVG-Taggeld",
"e"
],
[
"Berger: Wie hoch ist das Total in der Phase „Tag 91–720“?",
"7'200",
"m"
],
[
"Berger: Wie gross ist die Lücke in der Phase „Tag 91–720“?",
"1'800",
"m"
],
[
"Berger: Wie hoch ist der Deckungsgrad in der Phase „Tag 91–720“?",
"80 %",
"m"
],
[
"Berger: Welche Leistungen laufen in der Phase „ab Tag 721“?",
"UVG 4'713 + IV 3'217",
"s"
],
[
"Berger: Wie heisst die Phase ab Tag 721?",
"Rentenphase",
"e"
],
[
"Berger: Wie hoch ist das Total in der Phase „ab Tag 721“?",
"8'100",
"m"
],
[
"Berger: Wie gross ist die Lücke in der Phase „ab Tag 721“?",
"900",
"m"
],
[
"Berger: Wie hoch ist der Deckungsgrad in der Phase „ab Tag 721“?",
"90 %",
"m"
]
]
},
{
"id": "vbv-berger-rechnen",
"nr": 6,
"titel": "Fall Berger (Unfall) – Rechenwege und Merksätze",
"deutsch": "Warum die Zahlen so herauskommen",
"w": [
[
"Berger: Wie wird die UVG-Komplementärrente gerechnet?",
"90 % × 108'000 = 97'200 minus IV-Leistungen 40'644 = 56'556 im Jahr = 4'713 im Monat",
"p"
],
[
"Berger: Warum wird die BVG-Invalidenrente gekürzt?",
"IV + UVG erreichen bereits 90 % des mutmasslich entgangenen Verdienstes; die BVG-Invalidenrente von 1'939/Mt. wird vollständig gekürzt",
"p"
],
[
"Berger: Merksatz 1 von 5",
"Unfall heisst UVG, nicht KTG: 80 % Taggeld ab Tag 3, die im Dossier genannte Krankentaggeldregelung ab Tag 91 kommt nie zum Zug.",
"s"
],
[
"Berger: Merksatz 2 von 5",
"Der Arbeitgeber ergänzt das UVG-Taggeld bis Tag 90 auf 100 %.",
"s"
],
[
"Berger: Merksatz 3 von 5",
"Die UVG-Komplementärrente deckelt IV und UVG zusammen auf 90 % des versicherten Verdienstes.",
"s"
],
[
"Berger: Merksatz 4 von 5",
"Weil diese 90 % damit ausgeschöpft sind, fällt die BVG-Invalidenrente vollständig weg – der teuerste Punkt der Aufgabe.",
"s"
],
[
"Berger: Merksatz 5 von 5",
"Prämienbefreiung nach 6 Monaten: das Alterssparen läuft weiter, die freie Sparquote von 1'200/Mt. bricht weg.",
"s"
]
]
},
{
"id": "vbv-berger-fragen",
"nr": 7,
"titel": "Fall Berger (Unfall) – Kontrollfragen",
"deutsch": "Prüfungsfragen und Stolpersteine",
"w": [
[
"Berger: Wie hoch ist die UVG-Komplementärrente und wie wird sie berechnet?",
"4'713/Mt. – 90 % von 108'000 = 97'200 abzüglich der IV-Leistungen von 40'644 = 56'556 im Jahr.",
"s"
],
[
"Berger: Warum erscheint die BVG-Invalidenrente nicht in der Grafik?",
"Überentschädigung: IV und UVG erreichen bereits 90 % des mutmasslich entgangenen Verdienstes, die PK kürzt auf 0 (BVV 2 Art. 24).",
"s"
],
[
"Berger: Wie sähe die Rentenphase bei Krankheit statt Unfall aus?",
"IV 3'387 + BVG 1'939 = 5'326/Mt. statt 8'100 – die Lücke wäre 3'674 statt 900. Krankheit ist der schlechtere Fall.",
"s"
],
[
"Berger: Wird Lisas Einkommen in der Überentschädigungsrechnung berücksichtigt?",
"Nein. Massgebend ist ausschliesslich Martins mutmasslich entgangener Verdienst.",
"s"
],
[
"Berger: Erhält Lisa eine IV-Zusatzrente?",
"Nein. Die Zusatzrente für Ehegatten wurde per 01.01.2015 abgeschafft, nur laufende Ansprüche geniessen Besitzstand.",
"s"
],
[
"Berger: Stolperstein 1 von 3",
"Krankentaggeld statt UVG-Taggeld eingesetzt",
"p"
],
[
"Berger: Stolperstein 2 von 3",
"BVG-Invalidenrente in die Grafik gezeichnet statt gekürzt",
"p"
],
[
"Berger: Stolperstein 3 von 3",
"Zusatzrente aus der Skala-44-Tabelle für die Ehefrau eingerechnet",
"p"
]
]
},
{
"id": "vbv-nessier-lage",
"nr": 8,
"titel": "Fall Nessier (Krankheit) – Ausgangslage",
"deutsch": "Nessier-Lupf – Erwerbsunfähigkeit infolge Krankheit",
"w": [
[
"Nessier: Um welche Aufgabe geht es?",
"Erstellen Sie die Vorsorgegrafik für die Erwerbsunfähigkeit von Tony Nessier infolge Krankheit (IV-Grad 100 %).",
"e"
],
[
"Nessier: Wer ist die versicherte Person?",
"Tony Nessier, 30 (22.03.1995), Grundschullehrer, Pensum 100 %",
"e"
],
[
"Nessier: Wie sieht die Familiensituation aus?",
"Konkubinat seit 5 Jahren mit Sabrina Lupf (27, 40 %, AHV-Lohn 42'000), Kind Gilles 1 Jahr (22.05.2024)",
"e"
],
[
"Nessier: Wie hoch ist der AHV-Jahreslohn?",
"90'000",
"m"
],
[
"Nessier: Wie hoch ist der Bedarf im Monat?",
"7'500 (100 % des bisherigen Einkommens)",
"m"
],
[
"Nessier: Wie hoch ist das massgebende durchschnittliche Jahreseinkommen?",
"74'000",
"m"
],
[
"Nessier: Wie lange läuft die Lohnfortzahlung?",
"100 % bis Tag 90",
"e"
],
[
"Nessier: Wie ist das Krankentaggeld geregelt?",
"80 % ab Tag 91 bis Tag 730",
"m"
],
[
"Nessier: Wie hoch ist der BVG-versicherte Lohn?",
"63'540",
"m"
],
[
"Nessier: Wie hoch ist der Koordinationsabzug?",
"26'460",
"m"
],
[
"Nessier: Wie hoch ist die BVG-Invalidenrente laut Vorsorgeausweis?",
"21'743 im Jahr",
"m"
],
[
"Nessier: Wie hoch ist die BVG-Invalidenkinderrente laut Vorsorgeausweis?",
"4'349 im Jahr",
"m"
],
[
"Nessier: Welche Wartefrist hat die Pensionskasse in diesem Fall?",
"24 Monate",
"m"
],
[
"Nessier: Ab wann greift die Prämienbefreiung?",
"nach 3 Monaten",
"m"
],
[
"Nessier: Wie hoch ist das Sparpotenzial im Jahr?",
"5'000",
"m"
],
[
"Nessier: Wie viel liegt auf dem Sparkonto?",
"60'000",
"m"
],
[
"Nessier: Welches Anlegerprofil hat die versicherte Person?",
"ausgewogen",
"m"
],
[
"Nessier: Wann wird das Referenzalter erreicht?",
"2060-03-22",
"m"
]
]
},
{
"id": "vbv-nessier-loesung",
"nr": 9,
"titel": "Fall Nessier (Krankheit) – Leistungen und Phasen",
"deutsch": "Die Zahlen der Grafik",
"w": [
[
"Nessier: Wie hoch ist die IV-Rente im Monat?",
"2'298",
"m"
],
[
"Nessier: Wie hoch ist die IV-Kinderrente im Monat?",
"919",
"m"
],
[
"Nessier: Wie hoch ist die BVG-Invalidenrente in der Grafik?",
"1'812",
"m"
],
[
"Nessier: Wie hoch ist die BVG-Invalidenkinderrente im Monat?",
"362",
"m"
],
[
"Nessier: Welche Leistungen laufen in der Phase „Tag 1–90“?",
"Arbeitgeber 7'500",
"s"
],
[
"Nessier: Wie heisst die Phase Tag 1–90?",
"Lohnfortzahlung",
"e"
],
[
"Nessier: Wie hoch ist das Total in der Phase „Tag 1–90“?",
"7'500",
"m"
],
[
"Nessier: Wie gross ist die Lücke in der Phase „Tag 1–90“?",
"0 – der Bedarf ist gedeckt",
"m"
],
[
"Nessier: Wie hoch ist der Deckungsgrad in der Phase „Tag 1–90“?",
"100 %",
"m"
],
[
"Nessier: Welche Leistungen laufen in der Phase „Tag 91–365“?",
"KTG 6'000",
"s"
],
[
"Nessier: Wie heisst die Phase Tag 91–365?",
"nur Krankentaggeld",
"e"
],
[
"Nessier: Wie hoch ist das Total in der Phase „Tag 91–365“?",
"6'000",
"m"
],
[
"Nessier: Wie gross ist die Lücke in der Phase „Tag 91–365“?",
"1'500",
"m"
],
[
"Nessier: Wie hoch ist der Deckungsgrad in der Phase „Tag 91–365“?",
"80 %",
"m"
],
[
"Nessier: Welche Leistungen laufen in der Phase „Tag 366–730“?",
"KTG 2'783 + IV 3'217",
"s"
],
[
"Nessier: Wie heisst die Phase Tag 366–730?",
"IV + KTG koordiniert",
"e"
],
[
"Nessier: Wie hoch ist das Total in der Phase „Tag 366–730“?",
"6'000",
"m"
],
[
"Nessier: Wie gross ist die Lücke in der Phase „Tag 366–730“?",
"1'500",
"m"
],
[
"Nessier: Wie hoch ist der Deckungsgrad in der Phase „Tag 366–730“?",
"80 %",
"m"
],
[
"Nessier: Welche Leistungen laufen in der Phase „ab Tag 731“?",
"IV 3'217 + BVG 2'174",
"s"
],
[
"Nessier: Wie heisst die Phase ab Tag 731?",
"Rentenphase mit Kinderrenten",
"e"
],
[
"Nessier: Wie hoch ist das Total in der Phase „ab Tag 731“?",
"5'391",
"m"
],
[
"Nessier: Wie gross ist die Lücke in der Phase „ab Tag 731“?",
"2'109",
"m"
],
[
"Nessier: Wie hoch ist der Deckungsgrad in der Phase „ab Tag 731“?",
"72 %",
"m"
],
[
"Nessier: Welche Leistungen laufen in der Phase „ab Wegfall Kinderrenten“?",
"IV 2'298 + BVG 1'812",
"s"
],
[
"Nessier: Wie heisst die Phase ab Wegfall Kinderrenten?",
"Gilles 18 bzw. 25",
"e"
],
[
"Nessier: Wie hoch ist das Total in der Phase „ab Wegfall Kinderrenten“?",
"4'110",
"m"
],
[
"Nessier: Wie gross ist die Lücke in der Phase „ab Wegfall Kinderrenten“?",
"3'390",
"m"
],
[
"Nessier: Wie hoch ist der Deckungsgrad in der Phase „ab Wegfall Kinderrenten“?",
"55 %",
"m"
]
]
},
{
"id": "vbv-nessier-rechnen",
"nr": 10,
"titel": "Fall Nessier (Krankheit) – Rechenwege und Merksätze",
"deutsch": "Warum die Zahlen so herauskommen",
"w": [
[
"Nessier: Warum wird hier nichts gekürzt?",
"IV + BVG = 64'696 im Jahr, Grenze 90 % von 90'000 = 81'000 – die Pensionskasse zahlt voll",
"p"
],
[
"Nessier: Wie lange dauert die Taggeldphase?",
"640 Tage",
"p"
],
[
"Nessier: Wie lange dauert die Rentenphase insgesamt?",
"387 Monate",
"p"
],
[
"Nessier: Wie lange dauert Phase 4, wenn die Kinderrenten mit 18 enden?",
"173 Monate",
"p"
],
[
"Nessier: Wie lange dauert Phase 4, wenn die Kinderrenten bis 25 laufen?",
"257 Monate",
"p"
],
[
"Nessier: Wie hoch ist der nominale Kapitalbedarf, wenn die Kinderrenten mit 18 enden?",
"1'122'317",
"p"
],
[
"Nessier: Wie hoch ist der nominale Kapitalbedarf bei Kinderrenten bis 25?",
"1'014'713",
"p"
],
[
"Nessier: Wie ist der Kapitalbedarf gerechnet?",
"32'000 (Taggeldphase) + Monate Phase 4 × 2'109 + Monate Phase 5 × 3'390",
"p"
],
[
"Nessier: Merksatz 1 von 5",
"Drei Wartefristen erzeugen die Treppe: Lohnfortzahlung bis Tag 90, IV nach 12 Monaten, PK nach 24 Monaten.",
"s"
],
[
"Nessier: Merksatz 2 von 5",
"Ab Monat 13 kürzt der Krankentaggeldversicherer um die IV-Rente – das Total bleibt 6'000, die Säule wechselt nur die Farbe.",
"s"
],
[
"Nessier: Merksatz 3 von 5",
"Anders als beim Unfall wird hier nichts gekürzt: die 90-%-Grenze wird nicht erreicht.",
"s"
],
[
"Nessier: Merksatz 4 von 5",
"Der Koordinationsabzug von 26'460 macht die BVG-Rente klein – die 2. Säule deckt nur rund 29 % des Bedarfs.",
"s"
],
[
"Nessier: Merksatz 5 von 5",
"Die Kinderrenten von zusammen 1'281/Mt. sind befristet; danach steigt die Lücke auf 3'390 – über die längste Phase.",
"s"
]
]
},
{
"id": "vbv-nessier-fragen",
"nr": 11,
"titel": "Fall Nessier (Krankheit) – Kontrollfragen",
"deutsch": "Prüfungsfragen und Stolpersteine",
"w": [
[
"Nessier: Warum ändert sich das Total zwischen Tag 366 und 730 nicht, obwohl die IV einsetzt?",
"Der Krankentaggeldversicherer kürzt sein Taggeld um die IV-Rente (Überentschädigungsverbot). Es bleiben 6'000.",
"s"
],
[
"Nessier: Wird die BVG-Invalidenrente gekürzt?",
"Nein. IV und BVG ergeben 64'696, die Grenze liegt bei 81'000.",
"s"
],
[
"Nessier: Was ändert eine Heirat an dieser Grafik?",
"Nichts. Die IV kennt seit 2015 keine Zusatzrente für Partner, die BVG-Invalidenrente ist zivilstandsunabhängig. Der Unterschied liegt vollständig im Todesfall.",
"s"
],
[
"Nessier: Welche drei Massnahmen kosten heute nichts und schützen Sabrina?",
"Begünstigungserklärung bei der Pensionskasse einreichen, Begünstigung in der Säule 3a melden, Testament errichten.",
"s"
],
[
"Nessier: Wie lange dauert die Lücke von 2'109 im Monat?",
"173 Monate wenn die Kinderrenten mit 18 enden, 257 Monate bei Ausbildung bis 25.",
"s"
],
[
"Nessier: Warum passt der Fonds aus dem Basisinformationsblatt nicht zu Tony?",
"Es ist ein reiner Aktienfonds mit 11.8–13.1 % Volatilität und Jahresverlusten bis −19 %. Tonys Anlegerprofil ist ausgewogen, nicht dynamisch.",
"s"
],
[
"Nessier: Stolperstein 1 von 4",
"UVG-Taggeld statt Krankentaggeld eingesetzt",
"p"
],
[
"Nessier: Stolperstein 2 von 4",
"Die BVG-Wartefrist von 24 Monaten mit den üblichen 720 Tagen verwechselt",
"p"
],
[
"Nessier: Stolperstein 3 von 4",
"Den Wechsel von KTG zu IV ab Monat 13 nicht eingezeichnet",
"p"
],
[
"Nessier: Stolperstein 4 von 4",
"Den Wegfall der Kinderrenten als eigene Phase vergessen",
"p"
]
]
},
{
"id": "vbv-nessier-beratung",
"nr": 12,
"titel": "Fall Nessier (Krankheit) – Lösungsvorschlag",
"deutsch": "Was empfohlen wird und warum",
"w": [
[
"Nessier: Welches Produkt wird vorgeschlagen?",
"Gebundene Vorsorgepolice Säule 3a mit EU-Rente und Prämienbefreiung",
"s"
],
[
"Nessier: Wie hoch ist die vorgeschlagene EU-Rente?",
"2'500 im Monat",
"s"
],
[
"Nessier: Welche Wartefrist wird gewählt?",
"24 Monate",
"s"
],
[
"Nessier: Bis zu welchem Endalter läuft die Deckung?",
"Endalter 65",
"s"
],
[
"Nessier: Womit wird die Wahl begründet?",
"Deckt Phase 4 vollständig inklusive Steuerlast auf der 3a-Rente und weggefallener Sparquote; das Krankentaggeld deckt bis Tag 730, eine kürzere Wartefrist würde diese Deckung doppelt kaufen.",
"p"
],
[
"Nessier: Was ist zwingender Bestandteil des Vorschlags?",
"Prämienbefreiung nach 3 Monaten",
"s"
],
[
"Nessier: Was spricht gegen eine EU-Rente von 2'100?",
"lehrbuchsauber = Lücke Phase 4, lässt Phase 5 zu einem Drittel offen",
"p"
],
[
"Nessier: Was spricht gegen eine EU-Rente von 3'400?",
"schliesst alles, rund 60 % mehr Prämie, erzeugt Überdeckung in Phase 4",
"p"
]
]
}
];

/* Vorne steht die Frage, hinten die Antwort. Vorgelesen wird hier nichts. */
export const ALLE_ITEMS = KAPITEL.flatMap((k) =>
  k.w.map(([vorne, hinten, n], i) => ({
    id: `${k.id}:${i}`, kapitel: k.id, vorne, hinten, niveau: n,
  })));

/* Für die Übung „Vorsorgegrafik“: die Phasen in ihrer richtigen Reihenfolge. */
export const FAELLE = [
 {
  "id": "vbv-berger",
  "kapitel": "vbv-berger-loesung",
  "titel": "Familie Berger – Erwerbsunfähigkeit infolge Unfall",
  "aufgabe": "Erstellen Sie die Vorsorgegrafik für die Erwerbsunfähigkeit von Martin Berger infolge Unfall (IV-Grad 100 %).",
  "phasen": [
   {
    "phase": "Tag 1–2",
    "bezeichnung": "Karenzfrist UVG",
    "total": 9000,
    "luecke": 0,
    "deckung": 100
   },
   {
    "phase": "Tag 3–90",
    "bezeichnung": "Lohnfortzahlung",
    "total": 9000,
    "luecke": 0,
    "deckung": 100
   },
   {
    "phase": "Tag 91–720",
    "bezeichnung": "nur UVG-Taggeld",
    "total": 7200,
    "luecke": 1800,
    "deckung": 80
   },
   {
    "phase": "ab Tag 721",
    "bezeichnung": "Rentenphase",
    "total": 8100,
    "luecke": 900,
    "deckung": 90
   }
  ]
 },
 {
  "id": "vbv-nessier",
  "kapitel": "vbv-nessier-loesung",
  "titel": "Nessier-Lupf – Erwerbsunfähigkeit infolge Krankheit",
  "aufgabe": "Erstellen Sie die Vorsorgegrafik für die Erwerbsunfähigkeit von Tony Nessier infolge Krankheit (IV-Grad 100 %).",
  "phasen": [
   {
    "phase": "Tag 1–90",
    "bezeichnung": "Lohnfortzahlung",
    "total": 7500,
    "luecke": 0,
    "deckung": 100
   },
   {
    "phase": "Tag 91–365",
    "bezeichnung": "nur Krankentaggeld",
    "total": 6000,
    "luecke": 1500,
    "deckung": 80
   },
   {
    "phase": "Tag 366–730",
    "bezeichnung": "IV + KTG koordiniert",
    "total": 6000,
    "luecke": 1500,
    "deckung": 80
   },
   {
    "phase": "ab Tag 731",
    "bezeichnung": "Rentenphase mit Kinderrenten",
    "total": 5391,
    "luecke": 2109,
    "deckung": 72
   },
   {
    "phase": "ab Wegfall Kinderrenten",
    "bezeichnung": "Gilles 18 bzw. 25",
    "total": 4110,
    "luecke": 3390,
    "deckung": 55
   }
  ]
 }
];
