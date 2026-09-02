/* ==========================================================================
   Alena – Versicherungen / Leben
   Quelle: geprüfte Schweizer Sozialversicherungs- und Vorsorgezahlen (Stand 2026)
   von ahv-iv.ch, bsv.admin.ch, bag.admin.ch, seco.admin.ch, ssk-csi.ch
   sowie die gesetzlichen Grundzüge (AHVG, IVG, EOG, AVIG, BVG, FZG, UVG, VVG, VAG, DBG, ZGB).
   Aufbau je Eintrag: [vorne, hinten, niveau]
   Niveau: e = Grundlagen, m = Fallwerte, s = Zusammenhänge, p = Prüfungsreif
   ========================================================================== */

export const NIVEAUS = [
  { id: 'e', name: 'Grundlagen',    beschreibung: 'Kennzahlen, Fristen, Ausgangslagen.' },
  { id: 'm', name: 'Fallwerte',     beschreibung: 'Renten, Phasen, Totale und Lücken.' },
  { id: 's', name: 'Zusammenhänge', beschreibung: 'Koordination, Kürzungen, Kontrollfragen.' },
  { id: 'p', name: 'Prüfungsreif',  beschreibung: 'Rechenwege, Stolpersteine, Beratung.' },
];

export const KENNZAHLEN = {
 "stand": "2026",
 "hinweis": "Belegt über ahv-iv.ch, bsv.admin.ch, bag.admin.ch, seco.admin.ch (Abruf 2026-09-02)",
 "ahv": {
  "beitrag_total": "10.6 %",
  "ahv": "8.7 %",
  "iv": "1.4 %",
  "eo": "0.5 %",
  "je_haelfte": "5.3 %",
  "mit_alv_bis_hoechstlohn": "12.8 %",
  "selbstaendig_max": "10.0 %",
  "selbstaendig_sinkend_ab": 60500,
  "mindestbeitrag": 530,
  "hoechstbeitrag_nichterwerbstaetige": 26500,
  "freibetrag_rentner_jahr": 16800,
  "geringfuegiger_lohn": 2500,
  "mindestrente": 1260,
  "maximalrente": 2520,
  "plafond_ehepaar": 3780,
  "maximalrente_ab_durchschnitt": 90720,
  "maximalrente_jahr": 30240,
  "kinderrente_min": 504,
  "kinderrente_max": 1008,
  "witwenrente_min": 1008,
  "witwenrente_max": 2016,
  "waisenrente_min": 504,
  "waisenrente_max": 1008,
  "plafond_waise_kind": 1512,
  "freibetrag_rentner_monat": 1400,
  "plafond_prozent": "150 %",
  "witwenrente_prozent": "80 %",
  "waisenrente_prozent": "40 %",
  "kinderrente_prozent": "40 %"
 },
 "flexibel": {
  "vorbezug_ab": 63,
  "vorbezug_frauen_uebergang_ab": 62,
  "kuerzung_1_jahr": "6.8 %",
  "kuerzung_18_monate": "10.2 %",
  "kuerzung_2_jahre": "13.6 %",
  "aufschub_min": 1,
  "aufschub_max": 5,
  "zuschlag_1_jahr": "5.2 %",
  "zuschlag_5_jahre": "31.5 %",
  "referenzalter_frauen_2026": "64 Jahre und 6 Monate",
  "uebergangsgeneration": "Jahrgänge 1961–1969",
  "referenzalter_65_ab": 2028
 },
 "iv": {
  "kein_anspruch_unter": "40 %",
  "stufenlos_bis": "69 %",
  "vollrente_ab": "70 %",
  "wartezeit": "12 Monate",
  "schritt_40_49": "25 % plus 2.5 Prozentpunkte je IV-Grad",
  "kinderrente_prozent": "40 %"
 },
 "eo": {
  "mutterschaft_wochen": 14,
  "mutterschaft_tage": 98,
  "prozent": "80 %",
  "hoechst_tag": 220,
  "anderer_elternteil_tage": 10,
  "anderer_elternteil_taggelder": 14,
  "rahmenfrist_monate": 6
 },
 "alv": {
  "beitrag": "2.2 %",
  "hoechstlohn": 148200,
  "hoechstlohn_monat": 12350,
  "taggeld_70": "70 %",
  "taggeld_80": "80 %",
  "grenze_80_prozent": 3797,
  "mindestbeitragszeit": "12 Monate in 2 Jahren",
  "rahmenfrist": "2 Jahre",
  "taggelder": "200, 260, 400 oder 520"
 },
 "bvg": {
  "eintrittsschwelle": 22680,
  "koordinationsabzug": 26460,
  "oberer_grenzbetrag": 90720,
  "max_koordinierter_lohn": 64260,
  "min_koordinierter_lohn": 3780,
  "mindestzinssatz": "1.25 %",
  "umwandlungssatz": "6.8 %",
  "altersgutschriften": "25–34: 7 % · 35–44: 10 % · 45–54: 15 % · 55–65: 18 %",
  "sparen_ab_alter": 24,
  "risiko_ab_alter": 17,
  "witwenrente_prozent": "60 %",
  "waisenrente_prozent": "20 %",
  "invalidenkinderrente_prozent": "20 %",
  "abfindung_jahresrenten": 3,
  "einkauf_sperrfrist_jahre": 3,
  "ehegatte_ab_alter": 45,
  "ehejahre": 5,
  "konkubinat_jahre": 5,
  "max_ahv_rente_jahr": 30240
 },
 "saeule3a": {
  "mit_pk": 7258,
  "ohne_pk_prozent": "20 %",
  "ohne_pk_max": 36288,
  "nachzahlung": {
   "grundlage": "Art. 30a–30c BVV 3, in Kraft seit 1. Januar 2025",
   "erstes_einkaufsjahr": 2026,
   "erste_luecke": 2025,
   "rueckwirkend_jahre": 10,
   "max_pro_jahr": 7258,
   "bedingungen": "AHV-pflichtiges Erwerbseinkommen im Einkaufsjahr und im nachzuzahlenden Jahr, ordentlicher Jahresbeitrag vollständig einbezahlt, Lücken vor 2025 zählen nicht"
  }
 },
 "uvg": {
  "hoechstverdienst": 148200,
  "taggeld": "80 % ab Tag 3",
  "invalidenrente": "80 %",
  "komplementaerrente": "90 %",
  "witwenrente": "40 %",
  "halbwaise": "15 %",
  "vollwaise": "25 %",
  "hinterlassene_max": "70 %",
  "geschiedene": "20 %",
  "integritaet_ab": "5 %",
  "nichtberufsunfall_ab_stunden": 8,
  "nachdeckung_tage": 31,
  "abredeversicherung_monate": 6
 },
 "ktg": {
  "ueblich_prozent": "80 %",
  "dauer": "720 oder 730 Tage innerhalb von 900 Tagen",
  "wartefristen": "30, 60 oder 90 Tage",
  "uebertrittsrecht_tage": 90
 },
 "system": {
  "verfassung": "Art. 111 BV",
  "deckung_1_und_2": "rund 60 %",
  "gebunden_bis": "fünf Jahre vor dem Referenzalter"
 },
 "el": {
  "vermoegensschwelle_alleinstehend": 100000,
  "vermoegensschwelle_ehepaar": 200000,
  "lebensbedarf_alleinstehend": 20670,
  "lebensbedarf_ehepaar": 31005,
  "kind_bis_10_erstes": 7590,
  "kind_bis_10_zweites": 6325,
  "kind_bis_10_drittes": 5270,
  "mietzinsmaximum_region1_allein": 18900,
  "mietzinsmaximum_region1_ehepaar": 22320,
  "nebenkosten_pauschale": 3480
 },
 "erbrecht": {
  "gilt_seit": "1. Januar 2023",
  "pflichtteil_nachkommen": "1/2 des gesetzlichen Erbanspruchs (vorher 3/4)",
  "pflichtteil_ehegatte": "1/2 des gesetzlichen Erbanspruchs (unverändert)",
  "pflichtteil_eltern": "aufgehoben",
  "freie_quote_mit_kindern": "bis zur Hälfte des Nachlasses (vorher 3/8)",
  "konkubinat": "kein gesetzliches Erbrecht"
 },
 "wef": {
  "mindestbetrag": 20000,
  "abstand_jahre": 5,
  "ab_alter_50": "Anspruch mit 50 oder die Hälfte des heutigen Guthabens",
  "zustimmung": "schriftliche Zustimmung des Ehegatten oder eingetragenen Partners",
  "nur": "selbst bewohntes Wohneigentum – keine Zweitwohnung"
 },
 "steuern": {
  "kapitalversicherung_steuerfrei": "Auszahlung nach dem 60. Altersjahr, Vertragsdauer mindestens fünf Jahre, Abschluss vor dem 66. Altersjahr und Finanzierung durch periodische Prämien (Art. 24 lit. b DBG)",
  "leibrente_bis_2024": "40 % Ertragsanteil",
  "leibrente_ab_2025": "Garantierte Leistungen nach dem technischen Zinssatz bei Vertragsabschluss, Überschussleistungen zu 70 % (Art. 22 Abs. 3 DBG)",
  "leibrente_umstellung_jahr": 2025,
  "leibrente_letztes_jahr_pauschal": 2024,
  "matrix": {
   "saeule2_rente": "Einkommenssteuer – zu 100 % zusammen mit dem übrigen Einkommen",
   "saeule2_kapital": "Kapitalleistungssteuer – gesondert vom übrigen Einkommen zum Sondersatz (Art. 38 DBG)",
   "saeule3a_gemischt": "Kapitalleistungssteuer",
   "saeule3a_tod_laufzeit": "Kapitalleistungssteuer",
   "saeule3a_eu_rente": "Einkommenssteuer",
   "saeule3a_todesfallversicherung": "Kapitalleistungssteuer",
   "saeule3b_eu_rente": "Einkommenssteuer – sie ersetzt Erwerbseinkommen",
   "saeule3b_todesfallkapital": "Kapitalleistungssteuer zum Vorsorgetarif (Art. 23 lit. b und Art. 38 DBG) – die Police ist nicht rückkaufsfähig",
   "saeule3b_gemischt": "Einkommenssteuerfrei unter den Bedingungen von Art. 24 lit. b DBG",
   "saeule3b_gemischt_tod": "Einkommenssteuerfrei, kantonale Erbschaftssteuer vorbehalten",
   "quellen": "ag.ch (Merkblätter Lebensversicherungen und freie Vorsorge 3b), kanton.baselland.ch (Steuerbuch), gr.ch (Steuerpraxis), ssk-csi.ch"
  }
 },
 "vvg": {
  "revision": "1. Januar 2022",
  "widerruf_tage": 14,
  "ordentliche_kuendigung": "auf Ende des dritten Jahres und danach jährlich",
  "verjaehrung_jahre": 5,
  "verjaehrung_ktg_kollektiv_jahre": 2
 },
 "vag": {
  "revision_inkraft": 2024,
  "begriff": "Art. 39a VAG: Lebensversicherungen, bei denen die Versicherungsnehmerin oder der Versicherungsnehmer im Sparprozess ein Verlustrisiko trägt, sowie Kapitalisations- und Tontinengeschäfte",
  "basisinformationsblatt": "Art. 39b–39e VAG",
  "informationspflicht": "Art. 39h VAG",
  "werbung": "Art. 39i VAG",
  "angemessenheitspruefung": "Art. 39j VAG",
  "dokumentation": "Art. 39k VAG",
  "avo_zusatz": "Art. 129m AVO: Tragbarkeit, Risiko und Laufzeit müssen zur Lebenssituation und zu den Anlagezielen passen",
  "herausgabefrist_arbeitstage": 10,
  "renditeszenarien": 3,
  "quellen": "fedlex.admin.ch (VAG/AVO), finma.ch, svv.ch, vbv.ch",
  "bib_umfang_fidlev": "Art. 89 FIDLEV: höchstens drei Seiten im Anlagegeschäft",
  "bib_inhalt": "Art. 39c VAG: Name der Versicherung und Identität des Versicherungsunternehmens, Art und Merkmale, Risiko- und Renditeprofil unter Angabe des höchsten Verlusts, Kosten, Bewilligungen und Genehmigungen"
 },
 "bvv3": {
  "grundlage": "Art. 2 BVV 3 (SR 831.461.3)",
  "erlebensfall": "der Vorsorgenehmer",
  "rang1": "der überlebende Ehegatte oder die überlebende eingetragene Partnerin oder der überlebende eingetragene Partner",
  "rang2": "die direkten Nachkommen, die in erheblichem Masse unterstützten Personen sowie die Person, die bis zum Tod fünf Jahre ununterbrochen eine Lebensgemeinschaft geführt hat oder für den Unterhalt gemeinsamer Kinder aufkommen muss",
  "rang3": "die Eltern",
  "rang4": "die Geschwister",
  "rang5": "die übrigen Erben",
  "lebensgemeinschaft_jahre": 5,
  "rang1_aenderbar": "nein – der erste Rang lässt sich weder streichen noch überspringen",
  "rang2_aenderbar": "Art. 2 Abs. 2 BVV 3: einzelne Begünstigte bezeichnen und ihre Ansprüche näher bestimmen, also aufteilen",
  "rang35_aenderbar": "Art. 2 Abs. 3 BVV 3: die Reihenfolge der Ränge drei bis fünf ändern und die Ansprüche näher bestimmen",
  "nachlass": "Das Guthaben fällt nicht in den Nachlass, zählt seit dem revidierten Erbrecht aber zur Pflichtteilsberechnungsmasse",
  "quellen": "fedlex.admin.ch (BVV 3), faq.bsv.admin.ch, ubs.com"
 }
};

export const KAPITEL = [
{
"id": "vbv-system",
"nr": 1,
"titel": "Das Drei-Säulen-System",
"deutsch": "Aufbau, Zweck und Verfassungsauftrag",
"w": [
[
"Welche drei Säulen kennt die Schweizer Vorsorge?",
"1. Säule: staatliche Vorsorge · 2. Säule: berufliche Vorsorge · 3. Säule: private Vorsorge",
"e"
],
[
"Was ist der Zweck der 1. Säule?",
"Existenzsicherung – sie soll den Grundbedarf decken",
"e"
],
[
"Was ist der Zweck der 2. Säule?",
"Fortsetzung der gewohnten Lebenshaltung zusammen mit der 1. Säule",
"e"
],
[
"Was ist der Zweck der 3. Säule?",
"Individuelle Ergänzung – schliesst die verbleibenden Lücken",
"e"
],
[
"Wie viel sollen 1. und 2. Säule zusammen etwa decken?",
"rund 60 % des letzten Lohnes – der Rest ist Sache der 3. Säule",
"m"
],
[
"Welcher Verfassungsartikel regelt das Drei-Säulen-Konzept?",
"Art. 111 BV",
"m"
],
[
"Welche Versicherungen gehören zur 1. Säule?",
"AHV, IV, EL, EO/MSE, ALV – dazu die obligatorische Unfallversicherung UVG als eigenständiger Zweig",
"m"
],
[
"Was gehört zur 2. Säule?",
"BVG (obligatorisch und überobligatorisch), UVG sowie die Freizügigkeitseinrichtungen",
"m"
],
[
"Was unterscheidet Säule 3a von Säule 3b?",
"3a ist gebunden mit Steuerabzug und Bezugssperre; 3b ist frei, ohne Abzug und jederzeit verfügbar",
"m"
],
[
"Was heisst „gebundene Vorsorge“?",
"Das Kapital ist bis frühestens fünf Jahre vor dem Referenzalter gesperrt – Ausnahmen sind gesetzlich geregelt",
"m"
]
]
},
{
"id": "vbv-finanzierung",
"nr": 2,
"titel": "Finanzierungsverfahren",
"deutsch": "Umlage, Kapitaldeckung und Bedarfsdeckung",
"w": [
[
"Welche drei Finanzierungsverfahren muss man unterscheiden?",
"Ausgabenumlageverfahren, Kapitaldeckungsverfahren und Bedarfsdeckungsverfahren",
"e"
],
[
"Wie funktioniert das Ausgabenumlageverfahren?",
"Die Beiträge der Erwerbstätigen finanzieren unmittelbar die laufenden Renten – eingenommenes Geld geht direkt wieder hinaus, es wird kein Kapital angespart",
"s"
],
[
"Welche Versicherungen laufen im Umlageverfahren?",
"Die 1. Säule: AHV, IV, EO und ALV",
"e"
],
[
"Was ist der Generationenvertrag?",
"Die heute Erwerbstätigen zahlen die Renten der heutigen Rentner – im Vertrauen darauf, dass die nächste Generation dasselbe tut",
"s"
],
[
"Was ist die Schwäche des Umlageverfahrens?",
"Es hängt vom Verhältnis Erwerbstätige zu Rentner ab – die Demografie trifft es unmittelbar",
"s"
],
[
"Wie funktioniert das Kapitaldeckungsverfahren?",
"Jede versicherte Person spart ihr eigenes Alterskapital an; die Rente wird später aus diesem Kapital und seinen Zinsen bezahlt",
"s"
],
[
"Welche Versicherungen laufen im Kapitaldeckungsverfahren?",
"Die 2. Säule (BVG) und die 3. Säule",
"e"
],
[
"Was ist die Schwäche des Kapitaldeckungsverfahrens?",
"Es hängt an Zins und Kapitalmarkt – und an der Lebenserwartung, weil dasselbe Kapital länger reichen muss",
"s"
],
[
"Wie funktioniert das Bedarfsdeckungsverfahren?",
"Die Beiträge einer Periode decken die in derselben Periode anfallenden Schäden; es wird nur für laufende Fälle Kapital zurückgestellt",
"s"
],
[
"Wo kommt das Bedarfsdeckungsverfahren zur Anwendung?",
"Bei den Risikoversicherungen – zum Beispiel im UVG und bei den Risikoleistungen des BVG",
"s"
],
[
"Was ist der dritte Beitragszahler?",
"Der Zins auf dem angesparten Kapital – neben Arbeitnehmer und Arbeitgeber",
"s"
],
[
"Woran erkennt man das Verfahren einer Versicherung?",
"Wird Kapital je Person angespart, ist es Kapitaldeckung; fliesst das Geld direkt an die Bezüger, ist es Umlage",
"p"
]
]
},
{
"id": "vbv-ahv",
"nr": 3,
"titel": "Erste Säule – AHV",
"deutsch": "Beiträge, Renten und Berechnung",
"w": [
[
"Wofür stehen die Buchstaben AHV?",
"Alters- und Hinterlassenenversicherung",
"e"
],
[
"Wie hoch ist der AHV/IV/EO-Beitrag insgesamt?",
"10.6 % (AHV 8.7 %, IV 1.4 %, EO 0.5 %)",
"e"
],
[
"Wie wird der AHV/IV/EO-Beitrag aufgeteilt?",
"je 5.3 % Arbeitnehmer und Arbeitgeber",
"e"
],
[
"Wie hoch sind die Lohnabzüge mit ALV zusammen?",
"12.8 % bis zum ALV-Höchstlohn, darüber nur noch 10.6 %",
"m"
],
[
"Ab wann ist man beitragspflichtig?",
"Erwerbstätige ab dem 1. Januar nach dem 17. Geburtstag, Nichterwerbstätige ab dem 21.",
"m"
],
[
"Wie hoch ist der Höchstsatz für Selbstständigerwerbende?",
"10.0 % – die sinkende Skala gilt unter 60'500 Franken Einkommen",
"m"
],
[
"Wie hoch ist der AHV-Mindestbeitrag im Jahr?",
"530",
"m"
],
[
"Wie hoch ist der Höchstbeitrag für Nichterwerbstätige?",
"26'500 im Jahr",
"p"
],
[
"Welcher Freibetrag gilt nach dem Referenzalter?",
"16'800 im Jahr, also 1'400 im Monat",
"m"
],
[
"Ab welchem Lohn werden Beiträge auf geringfügigen Löhnen erhoben?",
"über 2'500 im Kalenderjahr",
"p"
],
[
"Wie hoch ist die minimale AHV-Altersrente?",
"1'260 im Monat",
"e"
],
[
"Wie hoch ist die maximale AHV-Altersrente?",
"2'520 im Monat",
"e"
],
[
"Wie hoch ist der Ehepaar-Plafond?",
"3'780 im Monat – 150 % der Maximalrente",
"m"
],
[
"Ab welchem durchschnittlichen Jahreseinkommen gibt es die Maximalrente?",
"90'720",
"m"
],
[
"Wie hoch ist die AHV-Kinderrente?",
"40 % der Altersrente, also 504 bis 1'008",
"m"
],
[
"Wovon hängt die Höhe der AHV-Rente ab?",
"Von der Beitragsdauer und vom massgebenden durchschnittlichen Jahreseinkommen",
"m"
],
[
"Was ist die Rentenskala 44?",
"Die Skala für die vollständige Beitragsdauer von 44 Jahren – jedes fehlende Beitragsjahr kostet rund 1/44 der Rente",
"s"
],
[
"Was sind Erziehungsgutschriften?",
"Ein fiktiver Einkommenszuschlag für Jahre mit Kindern unter 16 – dreifache minimale Altersrente pro Jahr",
"s"
],
[
"Was sind Betreuungsgutschriften?",
"Ein Zuschlag für die Betreuung pflegebedürftiger Verwandter, wenn keine Erziehungsgutschrift läuft",
"s"
],
[
"Was ist das Splitting?",
"Die während der Ehe erzielten Einkommen werden bei Scheidung oder Rentenfall hälftig auf beide Ehegatten aufgeteilt",
"s"
],
[
"Was ist eine Beitragslücke?",
"Ein Jahr ohne Beiträge – es kürzt die Rente dauerhaft; nachzahlen lässt sich nur innerhalb von fünf Jahren",
"s"
]
]
},
{
"id": "vbv-fruehpensionierung",
"nr": 4,
"titel": "Frühpensionierung und Aufschub",
"deutsch": "Flexibler Rücktritt in allen Säulen",
"w": [
[
"Wie hoch ist das Referenzalter?",
"65 Jahre für Männer und Frauen",
"e"
],
[
"Wie steht es 2026 beim Referenzalter der Frauen?",
"64 Jahre und 6 Monate – es steigt bis 2028 schrittweise auf 65",
"m"
],
[
"Ab wann kann die AHV-Rente vorbezogen werden?",
"ab 63 Jahren; Frauen der Übergangsgeneration 1961–1969 ab 62",
"m"
],
[
"Wie stark wird die AHV-Rente bei einem Jahr Vorbezug gekürzt?",
"6.8 %",
"m"
],
[
"Wie stark wird sie bei zwei Jahren Vorbezug gekürzt?",
"13.6 %",
"m"
],
[
"Bleibt die Kürzung beim Vorbezug bestehen?",
"Ja, lebenslang – auch nach Erreichen des Referenzalters",
"s"
],
[
"Wie lange kann die AHV-Rente aufgeschoben werden?",
"1 bis 5 Jahre",
"m"
],
[
"Wie hoch ist der Zuschlag bei fünf Jahren Aufschub?",
"31.5 %",
"m"
],
[
"Was passiert mit der Beitragspflicht bei Frühpensionierung?",
"Sie bleibt bis zum Referenzalter bestehen – als Nichterwerbstätiger, sofern kein Ehegatte genügend beiträgt",
"s"
],
[
"Was kostet die Frühpensionierung in der 2. Säule?",
"Doppelt: Es fehlen Sparjahre samt Zins, und der Umwandlungssatz ist tiefer",
"s"
],
[
"Was ist der Kürzungsdreiklang der Frühpensionierung?",
"Gekürzte AHV-Rente, kleineres Alterskapital mit tieferem Umwandlungssatz, und die Beitragspflicht läuft weiter",
"p"
],
[
"Wie lässt sich eine Frühpensionierung überbrücken?",
"Mit Kapital aus der Säule 3a oder 3b, mit einer BVG-Überbrückungsrente oder mit Teilpensionierung",
"s"
]
]
},
{
"id": "vbv-iv",
"nr": 5,
"titel": "Erste Säule – IV",
"deutsch": "Invalidenversicherung und ihr Rentensystem",
"w": [
[
"Was ist der Grundsatz der IV?",
"Eingliederung vor Rente",
"e"
],
[
"Ab welchem Invaliditätsgrad besteht ein Rentenanspruch?",
"ab 40 %",
"e"
],
[
"Wie funktioniert das stufenlose Rentensystem?",
"40–49 %: 25 % einer ganzen Rente plus 2.5 Prozentpunkte je IV-Grad · 50–69 %: Rente gleich IV-Grad · ab 70 %: ganze Rente",
"s"
],
[
"Wie hoch ist die IV-Rente bei einem IV-Grad von 60 %?",
"60 % einer ganzen Rente – zwischen 50 und 69 % entspricht die Rente dem IV-Grad",
"m"
],
[
"Wie hoch ist die IV-Rente bei einem IV-Grad von 45 %?",
"37.5 % – 25 % plus fünfmal 2.5 Prozentpunkte",
"p"
],
[
"Wie lange dauert die Wartezeit bis zur IV-Rente?",
"12 Monate",
"e"
],
[
"Wie wird der Invaliditätsgrad ermittelt?",
"Einkommensvergleich: Valideneinkommen gegen Invalideneinkommen",
"s"
],
[
"Wie hoch ist die IV-Kinderrente?",
"40 % der IV-Rente",
"m"
],
[
"Wann muss man sich bei der IV anmelden?",
"Früh – die Rente wird frühestens sechs Monate nach der Anmeldung ausgerichtet",
"s"
],
[
"Welche Leistungen kennt die IV neben der Rente?",
"Frühintervention, Integrationsmassnahmen, berufliche Massnahmen, Hilfsmittel, Taggelder und Hilflosenentschädigung",
"s"
],
[
"Was ist eine Hilflosenentschädigung?",
"Eine Leistung für Personen, die für alltägliche Lebensverrichtungen dauernd auf Dritthilfe angewiesen sind",
"s"
]
]
},
{
"id": "vbv-eo",
"nr": 6,
"titel": "Erste Säule – EO",
"deutsch": "Erwerbsersatz für Dienst und Elternschaft",
"w": [
[
"Wofür steht EO?",
"Erwerbsersatzordnung",
"e"
],
[
"Wen entschädigt die EO?",
"Dienstleistende in Militär, Zivilschutz und Zivildienst sowie Eltern über Mutterschafts- und Vaterschaftsentschädigung",
"e"
],
[
"Wie lange dauert der Mutterschaftsurlaub?",
"14 Wochen, also 98 Taggelder",
"e"
],
[
"Wie hoch ist die Mutterschaftsentschädigung?",
"80 % des vorherigen Erwerbseinkommens, höchstens 220 pro Tag",
"e"
],
[
"Wie lange dauert der Urlaub für den anderen Elternteil?",
"10 Arbeitstage, also 14 Taggelder",
"m"
],
[
"Innert welcher Frist muss dieser Urlaub bezogen werden?",
"innert 6 Monaten nach der Geburt",
"m"
],
[
"Wie hoch ist die Entschädigung für den anderen Elternteil?",
"80 %, höchstens 220 pro Tag",
"m"
],
[
"Wie wird die EO finanziert?",
"Über den EO-Beitrag von 0.5 %, hälftig getragen – im Umlageverfahren",
"m"
],
[
"Welche weiteren EO-Leistungen gibt es?",
"Betreuungsentschädigung für schwer kranke Kinder und Adoptionsentschädigung",
"s"
]
]
},
{
"id": "vbv-alv",
"nr": 7,
"titel": "Erste Säule – ALV",
"deutsch": "Arbeitslosenversicherung",
"w": [
[
"Wie hoch ist der ALV-Beitrag?",
"2.2 % bis zum Höchstlohn von 148'200, je hälftig getragen",
"e"
],
[
"Bis zu welchem Monatslohn gilt der ALV-Beitrag?",
"12'350",
"m"
],
[
"Wie hoch ist das ALV-Taggeld normalerweise?",
"70 % des versicherten Verdienstes",
"e"
],
[
"Wann beträgt das ALV-Taggeld 80 %?",
"bei Unterhaltspflicht gegenüber Kindern, bei einem versicherten Verdienst bis 3'797 oder bei einer IV-Rente ab 40 %",
"s"
],
[
"Welche Mindestbeitragszeit ist nötig?",
"12 Monate in 2 Jahren",
"m"
],
[
"Wie lange dauert die Rahmenfrist für den Leistungsbezug?",
"2 Jahre",
"m"
],
[
"Wie viele Taggelder gibt es höchstens?",
"200, 260, 400 oder 520 – je nach Beitragszeit, Alter und Unterhaltspflichten",
"m"
],
[
"Welche weiteren Leistungen kennt die ALV?",
"Kurzarbeitsentschädigung, Schlechtwetterentschädigung, Insolvenzentschädigung und arbeitsmarktliche Massnahmen",
"s"
],
[
"Ist man während der Arbeitslosigkeit unfallversichert?",
"Ja – die ALV versichert Bezügerinnen und Bezüger bei der Suva gegen Unfall",
"s"
],
[
"Was passiert mit der 2. Säule bei Arbeitslosigkeit?",
"Nur die Risiken Tod und Invalidität bleiben über die Auffangeinrichtung gedeckt; das Alterssparen läuft nicht weiter",
"p"
]
]
},
{
"id": "vbv-bvg-grund",
"nr": 8,
"titel": "Zweite Säule – Grundlagen",
"deutsch": "Eintritt, Grenzbeträge und koordinierter Lohn",
"w": [
[
"Wofür steht BVG?",
"Bundesgesetz über die berufliche Alters-, Hinterlassenen- und Invalidenvorsorge",
"e"
],
[
"Wie hoch ist die BVG-Eintrittsschwelle?",
"22'680 im Jahr",
"e"
],
[
"Wie hoch ist der Koordinationsabzug?",
"26'460",
"e"
],
[
"Wie hoch ist der obere Grenzbetrag?",
"90'720",
"e"
],
[
"Wie hoch ist der maximale koordinierte Lohn?",
"64'260",
"m"
],
[
"Wie hoch ist der minimale koordinierte Lohn?",
"3'780",
"m"
],
[
"Wie wird der koordinierte Lohn berechnet?",
"AHV-Jahreslohn (höchstens 90'720) minus Koordinationsabzug von 26'460",
"s"
],
[
"Warum gibt es den Koordinationsabzug?",
"Er zieht ab, was die 1. Säule bereits deckt – die 2. Säule versichert nur den darüber liegenden Teil",
"s"
],
[
"Ab wann ist man für die Risiken versichert?",
"Ab dem 1. Januar nach dem 17. Geburtstag",
"m"
],
[
"Ab wann beginnt das Alterssparen im BVG?",
"Ab dem 1. Januar nach dem 24. Geburtstag",
"m"
],
[
"Wie hoch ist der BVG-Mindestzinssatz?",
"1.25 %",
"e"
],
[
"Wie hoch ist der gesetzliche Umwandlungssatz?",
"6.8 % im Referenzalter, auf dem obligatorischen Altersguthaben",
"e"
],
[
"Was ist das Obligatorium im BVG?",
"Der gesetzliche Mindestumfang; was die Kasse darüber hinaus versichert, ist überobligatorisch",
"m"
],
[
"Was ist eine umhüllende Vorsorgeeinrichtung?",
"Eine Kasse, die Obligatorium und Überobligatorium in einem Topf führt und nur die Schattenrechnung getrennt nachweist",
"p"
],
[
"Was ist die Schattenrechnung?",
"Die parallele Rechnung des gesetzlichen Mindestguthabens – die Leistung darf nie darunter fallen",
"p"
],
[
"Wer trägt die BVG-Beiträge?",
"Der Arbeitgeber mindestens die Hälfte",
"m"
]
]
},
{
"id": "vbv-bvg-sparen",
"nr": 9,
"titel": "Zweite Säule – Sparen",
"deutsch": "Altersgutschriften, Kapital und Bezug",
"w": [
[
"Wie hoch sind die Altersgutschriften nach Alter?",
"25–34: 7 % · 35–44: 10 % · 45–54: 15 % · 55–65: 18 % des koordinierten Lohnes",
"s"
],
[
"Woraus besteht das Altersguthaben?",
"Aus den Altersgutschriften, den eingebrachten Freizügigkeitsleistungen und den Zinsen darauf",
"m"
],
[
"Wie wird aus dem Kapital eine Rente?",
"Altersguthaben mal Umwandlungssatz – im Obligatorium 6.8 %",
"m"
],
[
"Welche Bezugsformen gibt es im Alter?",
"Rente, Kapital oder eine Mischung – das Reglement bestimmt, was möglich ist",
"m"
],
[
"Welche Frist gilt für den Kapitalbezug?",
"Mindestens ein Viertel des obligatorischen Guthabens kann immer als Kapital bezogen werden; für mehr gilt die Anmeldefrist des Reglements",
"s"
],
[
"Was ist ein Einkauf in die Pensionskasse?",
"Eine freiwillige Einzahlung zur Schliessung der Beitragslücke – im Einzahlungsjahr vom steuerbaren Einkommen abziehbar",
"s"
],
[
"Welche Sperrfrist gilt nach einem Einkauf?",
"Drei Jahre – innerhalb dieser Frist darf das Guthaben nicht als Kapital bezogen werden",
"s"
],
[
"Wofür darf Vorsorgegeld vorbezogen werden?",
"Für selbst bewohntes Wohneigentum, für den Schritt in die Selbstständigkeit und beim endgültigen Verlassen der Schweiz",
"m"
],
[
"Was ist eine Freizügigkeitsleistung?",
"Das Guthaben, das beim Stellenwechsel in die neue Vorsorgeeinrichtung mitgeht",
"m"
],
[
"Was passiert mit dem Guthaben ohne neue Stelle?",
"Es geht auf ein Freizügigkeitskonto oder eine Freizügigkeitspolice",
"m"
],
[
"Was ist die Auffangeinrichtung?",
"Die gesetzliche Einrichtung für Arbeitslose, für Betriebe ohne Anschluss und für kontaktlose Guthaben",
"s"
],
[
"Was geschieht bei Scheidung mit dem Guthaben?",
"Das während der Ehe geäufnete Guthaben wird hälftig geteilt",
"s"
]
]
},
{
"id": "vbv-bvg-risiko",
"nr": 10,
"titel": "Zweite Säule – Risiko",
"deutsch": "Invalidität und Todesfall in der Pensionskasse",
"w": [
[
"Welche Risiken deckt die 2. Säule neben dem Alter?",
"Invalidität und Tod",
"e"
],
[
"Wie hoch ist die BVG-Invalidenrente im Obligatorium?",
"Das projizierte Altersguthaben bis zum Referenzalter, ohne Zinsen, mal Umwandlungssatz",
"s"
],
[
"Ab welchem Invaliditätsgrad zahlt das BVG?",
"Ab 40 % – das BVG folgt dem IV-Entscheid und dem stufenlosen System",
"m"
],
[
"Wie hoch ist die BVG-Invalidenkinderrente?",
"20 % der Invalidenrente",
"m"
],
[
"Wie hoch ist die BVG-Witwen- oder Witwerrente?",
"60 % der Invaliden- oder Altersrente",
"m"
],
[
"Wie hoch ist die BVG-Waisenrente?",
"20 % der Invaliden- oder Altersrente",
"m"
],
[
"Wann hat der überlebende Ehegatte Anspruch?",
"Mit Kind, oder ab 45 Jahren und mindestens fünf Ehejahren – sonst eine einmalige Abfindung von drei Jahresrenten",
"s"
],
[
"Was ist die Prämienbefreiung im BVG?",
"Nach der reglementarischen Wartefrist läuft das Alterssparen weiter, ohne dass Beiträge bezahlt werden",
"m"
],
[
"Welche Wartefrist gilt üblicherweise für die BVG-Invalidenrente?",
"Gemäss Reglement, üblich 720 oder 730 Tage – manche Kassen nennen 24 Monate",
"m"
],
[
"Was ist eine Begünstigungserklärung?",
"Die schriftliche Meldung, wer im Todesfall Anspruch hat – wichtig für Konkubinatspartner",
"s"
],
[
"Wer kann im Konkubinat begünstigt werden?",
"Der Partner nach mindestens fünf Jahren Lebensgemeinschaft oder bei gemeinsamen Kindern – wenn das Reglement es vorsieht und die Meldung vorliegt",
"p"
]
]
},
{
"id": "vbv-saeule3",
"nr": 11,
"titel": "Dritte Säule",
"deutsch": "Gebundene und freie private Vorsorge",
"w": [
[
"Wie hoch ist der maximale 3a-Beitrag mit Pensionskasse?",
"7'258 im Jahr",
"e"
],
[
"Wie hoch ist der maximale 3a-Beitrag ohne Pensionskasse?",
"20 % des Erwerbseinkommens, höchstens 36'288",
"e"
],
[
"Wer darf in die Säule 3a einzahlen?",
"Wer ein AHV-pflichtiges Erwerbseinkommen erzielt",
"m"
],
[
"Wann darf 3a-Kapital bezogen werden?",
"Frühestens fünf Jahre vor dem Referenzalter, spätestens bei dessen Erreichen – bei Weiterarbeit bis fünf Jahre danach",
"m"
],
[
"Welche vorzeitigen Bezugsgründe gibt es in der Säule 3a?",
"Wohneigentum zum Eigenbedarf, Aufnahme einer selbstständigen Tätigkeit, Wechsel der Selbstständigkeit, definitive Ausreise, Einkauf in die Pensionskasse und volle IV-Rente",
"s"
],
[
"Zu welchem Satz wird 3a-Kapital ausbezahlt besteuert?",
"Getrennt vom übrigen Einkommen zu einem reduzierten Satz",
"m"
],
[
"Warum lohnt sich gestaffelter Bezug?",
"Mehrere Konten in verschiedenen Jahren beziehen bricht die Progression der Kapitalauszahlungssteuer",
"s"
],
[
"Was unterscheidet 3a bei der Bank von 3a bei der Versicherung?",
"Die Bank führt ein Konto ohne Verpflichtung; die Versicherung bindet eine Prämie, deckt dafür Tod und Erwerbsunfähigkeit mit ab",
"s"
],
[
"Was ist die Prämienbefreiung in der Säule 3a?",
"Bei Erwerbsunfähigkeit übernimmt die Versicherung die Prämie – das Sparziel bleibt bestehen",
"s"
],
[
"Was ist eine Summenversicherung?",
"Eine Versicherung, die eine vereinbarte Summe zahlt, unabhängig vom tatsächlichen Schaden – sie wird nicht an andere Leistungen angerechnet",
"s"
],
[
"Wie ist die Begünstigung in der Säule 3a geregelt?",
"Gesetzlich vorgegeben: zuerst der überlebende Ehegatte, dann die Nachkommen; innerhalb der Gruppen darf umgestellt werden",
"s"
],
[
"Was gehört zur Säule 3b?",
"Alle freie Vorsorge: Sparkonten, Wertschriften, Lebensversicherungen ohne Bindung, Wohneigentum",
"m"
]
]
},
{
"id": "vbv-uvg",
"nr": 12,
"titel": "Unfallversicherung UVG",
"deutsch": "Deckung, Leistungen und Grenzen",
"w": [
[
"Wer ist obligatorisch nach UVG versichert?",
"Alle Arbeitnehmenden in der Schweiz – Selbstständige nur freiwillig",
"e"
],
[
"Ab welcher Arbeitszeit ist man auch gegen Nichtberufsunfälle versichert?",
"Ab mindestens acht Stunden pro Woche beim selben Arbeitgeber",
"m"
],
[
"Bis zu welchem Jahresverdienst versichert das UVG?",
"148'200",
"e"
],
[
"Wie hoch ist das Taggeld nach UVG und ab wann läuft es?",
"80 % ab Tag 3",
"e"
],
[
"Wer zahlt in den ersten zwei Tagen?",
"Der Arbeitgeber – die zwei Karenztage sind Sache der Lohnfortzahlung",
"m"
],
[
"Wie hoch ist die UVG-Invalidenrente bei Vollinvalidität?",
"80 % des versicherten Verdienstes",
"e"
],
[
"Was ist eine Komplementärrente?",
"Die UVG-Rente wird so gekürzt, dass IV und UVG zusammen 90 % des versicherten Verdienstes nicht übersteigen",
"s"
],
[
"Wie hoch ist die UVG-Witwen- oder Witwerrente?",
"40 %",
"m"
],
[
"Wie hoch ist die UVG-Halbwaisenrente?",
"15 %",
"m"
],
[
"Wie hoch ist die UVG-Vollwaisenrente?",
"25 %",
"m"
],
[
"Wie hoch dürfen die UVG-Hinterlassenenrenten zusammen sein?",
"höchstens 70 % des versicherten Verdienstes",
"s"
],
[
"Was erhält der geschiedene Ehegatte im UVG?",
"20 %, höchstens jedoch der geschuldete Unterhaltsbeitrag",
"p"
],
[
"Was ist eine Integritätsentschädigung?",
"Eine einmalige Kapitalleistung für dauernde Schädigung – erst ab 5 % Integritätseinbusse",
"s"
],
[
"Wer trägt die UVG-Prämien?",
"Berufsunfall der Arbeitgeber, Nichtberufsunfall in der Regel der Arbeitnehmer",
"m"
],
[
"Was ist die UVG-Abredeversicherung?",
"Die Verlängerung des Unfallschutzes über die 31 Tage nach dem letzten Arbeitstag hinaus, für höchstens sechs Monate",
"s"
],
[
"Wie lange läuft die UVG-Nachdeckung ohne Abrede?",
"31 Tage nach dem Ende des Lohnanspruchs",
"m"
],
[
"Was ist ein Berufsunfall?",
"Ein Unfall bei der Arbeit oder in der Arbeitspause auf dem Betriebsgelände – der Arbeitsweg zählt beim Nichtberufsunfall",
"s"
]
]
},
{
"id": "vbv-ktg",
"nr": 13,
"titel": "Krankentaggeld",
"deutsch": "KTG nach VVG und KVG",
"w": [
[
"Ist eine Krankentaggeldversicherung obligatorisch?",
"Nein – sie ist freiwillig; viele Gesamtarbeitsverträge schreiben sie aber vor",
"e"
],
[
"Was deckt die Krankentaggeldversicherung?",
"Den Erwerbsausfall bei krankheitsbedingter Arbeitsunfähigkeit",
"e"
],
[
"Wie hoch ist ein Krankentaggeld üblicherweise?",
"80 % des Lohnes",
"e"
],
[
"Wie lange läuft ein Krankentaggeld üblicherweise?",
"720 oder 730 Tage innerhalb von 900 Tagen",
"m"
],
[
"Welche Wartefristen sind üblich?",
"30, 60 oder 90 Tage – je länger die Wartefrist, desto tiefer die Prämie",
"m"
],
[
"Was ist der Unterschied zwischen KTG nach VVG und nach KVG?",
"VVG: Schadenversicherung, individuell gestaltbar, mit Gesundheitsprüfung und Vorbehalten · KVG: Sozialversicherung, Aufnahme ohne Vorbehalt, aber deutlich engere Leistungen",
"s"
],
[
"Was ersetzt die Krankentaggeldversicherung beim Arbeitgeber?",
"Die gesetzliche Lohnfortzahlungspflicht nach Berner, Basler oder Zürcher Skala",
"s"
],
[
"Was ist das Übertrittsrecht?",
"Das Recht, beim Austritt aus dem Kollektivvertrag ohne neue Gesundheitsprüfung in eine Einzelversicherung zu wechseln – üblich innert 90 Tagen",
"s"
],
[
"Warum kürzt der Krankentaggeldversicherer bei einer IV-Rente?",
"Als Schadenversicherung darf er zusammen mit der IV den Erwerbsausfall nicht übersteigen – das Überentschädigungsverbot",
"p"
],
[
"Was ist die Lücke zwischen Taggeld und Rente?",
"Setzt die IV erst nach 12 Monaten ein und läuft das Taggeld 720 Tage, deckt das Taggeld die Zeit ab – endet es aber vor dem Rentenentscheid, entsteht eine echte Lücke",
"p"
]
]
},
{
"id": "vbv-renten",
"nr": 14,
"titel": "Welche Renten gibt es?",
"deutsch": "Die Rentenarten aller Säulen im Überblick",
"w": [
[
"Welche Renten kennt die AHV?",
"Altersrente, Kinderrente zur Altersrente, Witwen- und Witwerrente, Waisenrente",
"e"
],
[
"Welche Renten kennt die IV?",
"Invalidenrente und Kinderrente zur Invalidenrente – dazu Taggelder und Hilflosenentschädigung",
"e"
],
[
"Welche Renten kennt das BVG?",
"Altersrente, Invalidenrente, Kinderrente zur Alters- und Invalidenrente, Ehegattenrente und Waisenrente",
"m"
],
[
"Welche Renten kennt das UVG?",
"Invalidenrente, Komplementärrente, Witwen- und Witwerrente, Waisenrente – dazu Hilflosenentschädigung und Integritätsentschädigung",
"m"
],
[
"Welche Rente ist keine Rente?",
"Die Integritätsentschädigung – sie ist eine einmalige Kapitalleistung",
"p"
],
[
"Wie hoch ist die AHV-Witwenrente?",
"80 % der Altersrente",
"m"
],
[
"Was erhalten Vollwaisen aus der AHV?",
"Zwei Waisenrenten – zusammen aber höchstens 60 % der Altersrente",
"m"
],
[
"Wie hoch ist die BVG-Ehegattenrente?",
"60 % der Alters- oder Invalidenrente",
"m"
],
[
"Wie hoch ist die Waisenrente in der 2. Säule?",
"20 % der Alters- oder Invalidenrente",
"m"
],
[
"Wie hoch ist die UVG-Witwenrente?",
"40 % des versicherten Verdienstes",
"m"
],
[
"Bis wann laufen Kinder- und Waisenrenten?",
"Bis 18, bei Ausbildung bis höchstens 25",
"e"
],
[
"Welche Renten werden der Teuerung angepasst?",
"Die Renten der 1. Säule alle zwei Jahre nach dem Mischindex; im BVG nur die Risikorenten nach gesetzlicher Vorgabe, Altersrenten nur nach Möglichkeit der Kasse",
"p"
]
]
},
{
"id": "vbv-kuerzungen",
"nr": 15,
"titel": "Kürzungen und Koordination",
"deutsch": "Wann welche Säule kürzt",
"w": [
[
"Was ist Überentschädigung?",
"Wenn die Leistungen mehrerer Versicherungen zusammen den tatsächlichen Erwerbsausfall übersteigen",
"e"
],
[
"Warum darf überhaupt gekürzt werden?",
"Sozialversicherungen sind Schadenversicherungen – sie sollen den Ausfall decken, nicht darüber hinaus bereichern",
"s"
],
[
"Wo liegt die Überentschädigungsgrenze im BVG?",
"90 % des mutmasslich entgangenen Verdienstes (BVG Art. 34a, BVV 2 Art. 24)",
"s"
],
[
"Wo liegt die Grenze bei der UVG-Komplementärrente?",
"90 % des versicherten Verdienstes für IV und UVG zusammen (UVG Art. 20 Abs. 2)",
"s"
],
[
"Welche Reihenfolge gilt bei der Koordination?",
"Zuerst zahlt die 1. Säule, dann ergänzt das UVG, zuletzt kürzt oder ergänzt die Pensionskasse",
"s"
],
[
"Welche Leistungen werden nie gekürzt?",
"Summenversicherungen der Säule 3 – sie sind unabhängig vom Schaden",
"s"
],
[
"Wird die Integritätsentschädigung angerechnet?",
"Nein – sie entschädigt die dauernde Schädigung, nicht den Erwerbsausfall",
"p"
],
[
"Wird das Einkommen des Ehegatten angerechnet?",
"Nein – massgebend ist allein der mutmasslich entgangene Verdienst der versicherten Person",
"s"
],
[
"Was passiert mit der BVG-Rente, wenn IV und UVG die 90 % erreichen?",
"Sie wird gekürzt, unter Umständen auf null – die Pensionskasse zahlt nur, was zur Grenze noch fehlt",
"p"
],
[
"Warum ist der Unfall meist besser gedeckt als die Krankheit?",
"Weil das UVG eine Invalidenrente von 80 % kennt; bei Krankheit tragen IV und BVG allein, das ergibt deutlich weniger",
"p"
],
[
"Wann kürzt die AHV oder IV wegen Selbstverschulden?",
"Bei Grobfahrlässigkeit gibt es im UVG Kürzungen der Taggelder bei Nichtberufsunfall; die AHV/IV kürzt bei vorsätzlicher Herbeiführung",
"p"
],
[
"Was ist die Kürzung wegen Vorbezug?",
"Keine Koordination, sondern eine versicherungstechnische Kürzung – die Rente wird länger ausbezahlt und deshalb tiefer angesetzt",
"p"
]
]
},
{
"id": "vbv-el",
"nr": 16,
"titel": "Ergänzungsleistungen",
"deutsch": "Wenn Rente und Einkommen nicht reichen",
"w": [
[
"Was sind Ergänzungsleistungen?",
"Bedarfsleistungen der 1. Säule – sie decken die Lücke zwischen anerkannten Ausgaben und anrechenbaren Einnahmen",
"e"
],
[
"Wer hat Anspruch auf Ergänzungsleistungen?",
"Wer eine Rente der AHV oder IV oder eine Hinterlassenenrente bezieht und in der Schweiz wohnt",
"e"
],
[
"Sind Ergänzungsleistungen Sozialhilfe?",
"Nein – es ist ein gesetzlicher Anspruch, keine Fürsorge und nicht rückzahlbar zu Lebzeiten",
"s"
],
[
"Welche Vermögensschwelle gilt für Alleinstehende?",
"100'000 – darüber besteht kein Anspruch",
"m"
],
[
"Welche Vermögensschwelle gilt für Ehepaare?",
"200'000",
"m"
],
[
"Wie hoch ist der anerkannte Lebensbedarf für Alleinstehende?",
"20'670 im Jahr",
"m"
],
[
"Wie hoch ist der anerkannte Lebensbedarf für Ehepaare?",
"31'005 im Jahr",
"m"
],
[
"Wie hoch ist das Mietzinsmaximum in Region 1 für Alleinstehende?",
"18'900 im Jahr, dazu eine Nebenkostenpauschale von 3'480",
"p"
],
[
"Wie wird die Ergänzungsleistung berechnet?",
"Anerkannte Ausgaben minus anrechenbare Einnahmen – die Differenz wird ausbezahlt",
"s"
],
[
"Warum sind Ergänzungsleistungen für die Beratung wichtig?",
"Sie zeigen, wo die Existenzsicherung endet – wer darüber hinaus etwas will, braucht 2. und 3. Säule",
"s"
]
]
},
{
"id": "vbv-hinterlassene",
"nr": 17,
"titel": "Hinterlassenenleistungen",
"deutsch": "Witwen-, Witwer- und Waisenrenten in allen Säulen",
"w": [
[
"Wann erhält eine Witwe eine AHV-Witwenrente?",
"Mit einem oder mehreren Kindern bei der Verwitwung – oder ohne Kinder ab 45 Jahren und mindestens fünf Ehejahren",
"s"
],
[
"Wann erhält ein Witwer eine AHV-Witwerrente?",
"Grundsätzlich nur, wenn er bei der Verwitwung Kinder hat",
"s"
],
[
"Wie hoch ist die AHV-Witwen- und Witwerrente?",
"80 % der Altersrente, also 1'008 bis 2'016",
"m"
],
[
"Wie hoch ist die AHV-Waisenrente?",
"40 % der Altersrente – Vollwaisen erhalten zwei Renten, zusammen höchstens 1'512",
"m"
],
[
"Wann erlischt der Anspruch auf eine Witwenrente?",
"Bei Wiederverheiratung oder beim Tod – mit dem eigenen Rentenalter geht sie in die Altersrente über, ausbezahlt wird die höhere",
"s"
],
[
"Wie hoch ist die Ehegattenrente in der 2. Säule?",
"60 % der Alters- oder Invalidenrente",
"m"
],
[
"Welche Voraussetzungen gelten für die BVG-Ehegattenrente?",
"Ein Kind zu versorgen, oder mindestens 45 Jahre alt und 5 Ehejahre – sonst eine Abfindung von 3 Jahresrenten",
"s"
],
[
"Wie hoch ist die Waisenrente der Pensionskasse?",
"20 % der Alters- oder Invalidenrente",
"m"
],
[
"Wie hoch sind die UVG-Hinterlassenenrenten?",
"Witwe oder Witwer 40 %, Halbwaisen 15 %, Vollwaisen 25 % – zusammen höchstens 70 %",
"s"
],
[
"Was erhält der Konkubinatspartner aus der AHV?",
"Nichts – die AHV kennt keine Leistung für Konkubinatspartner",
"s"
],
[
"Was erhält der Konkubinatspartner aus der 2. Säule?",
"Nur wenn das Reglement es vorsieht und eine Begünstigungserklärung vorliegt – üblich nach 5 Jahren Lebensgemeinschaft oder bei gemeinsamen Kindern",
"p"
],
[
"Wie ist die eingetragene Partnerschaft gestellt?",
"Wie die Ehe – der überlebende Partner gilt als Witwer",
"m"
],
[
"Welche Lücke entsteht im Konkubinat?",
"Keine Witwenrente aus der AHV, meist keine aus der Pensionskasse, kein gesetzliches Erbrecht – die Absicherung muss über Säule 3 und ein Testament laufen",
"p"
],
[
"Bis wann laufen Waisenrenten?",
"Bis 18, bei Ausbildung längstens bis 25",
"e"
],
[
"Was ist der Unterschied zwischen Kinderrente und Waisenrente?",
"Die Kinderrente läuft zur Alters- oder Invalidenrente einer lebenden Person, die Waisenrente nach deren Tod",
"s"
]
]
},
{
"id": "vbv-produkte",
"nr": 18,
"titel": "Produkte der Lebensversicherung",
"deutsch": "Risiko, Kapital, Rente und Fonds",
"w": [
[
"Was ist eine reine Risikoversicherung?",
"Sie zahlt nur im Todesfall innerhalb der Laufzeit; wird das Ende erlebt, gibt es keine Leistung und keinen Rückkaufswert",
"e"
],
[
"Was ist eine Erlebensfallversicherung?",
"Sie zahlt die vereinbarte Summe, wenn der Versicherte den Ablauf erlebt – reines Sparen",
"m"
],
[
"Was ist eine gemischte Versicherung?",
"Todesfall und Erlebensfall in einem Vertrag – sie zahlt in jedem Fall, entweder bei Ablauf oder vorher beim Tod",
"e"
],
[
"Aus welchen zwei Teilen besteht eine gemischte Lebensversicherung?",
"Aus einem Risikoteil, der den Todesfall deckt, und einem Sparteil, der das Erlebensfallkapital aufbaut",
"e"
],
[
"Wofür wird die Prämie einer gemischten Lebensversicherung verwendet?",
"Für die Risikoprämie, die Sparprämie und den Kostenanteil",
"e"
],
[
"Was geschieht mit der Sparprämie?",
"Sie wird zum technischen Zins angelegt und bildet mit den Überschüssen das Erlebensfallkapital",
"m"
],
[
"Was deckt der Risikoteil einer gemischten Versicherung ab?",
"Die Differenz zwischen der versicherten Todesfallsumme und dem bereits angesparten Kapital – die Risikosumme",
"s"
],
[
"Wie verschiebt sich das Verhältnis der beiden Teile über die Laufzeit?",
"Das Sparkapital wächst, damit sinkt die zu deckende Risikosumme – der Sparteil gewinnt an Gewicht",
"p"
],
[
"Was leistet die gemischte Versicherung beim Tod vor Ablauf?",
"Die vereinbarte Todesfallsumme, unabhängig davon, wie viel bereits angespart ist",
"m"
],
[
"Was leistet sie am Ende der Laufzeit?",
"Das garantierte Erlebensfallkapital und die bis dahin zugeteilten Überschüsse",
"m"
],
[
"Warum ist die gemischte Versicherung teurer als eine reine Risikoversicherung?",
"Weil die Prämie beides enthält: den Risikoschutz und das Sparen",
"s"
],
[
"Warum liegt der Rückkaufswert am Anfang unter den einbezahlten Prämien?",
"Weil Abschlusskosten, Verwaltungskosten und Risikoprämien schon verbraucht sind und nur der Rest angespart wurde",
"p"
],
[
"Was spricht dafür, Sparen und Versichern zu trennen?",
"Der reine Risikoschutz ist günstiger und das Sparen bleibt frei anlegbar; dafür fehlen Prämienbefreiung und Verbindlichkeit",
"p"
],
[
"Was ist eine fondsgebundene Lebensversicherung?",
"Der Sparteil wird in Anlagefonds investiert; die Chance auf mehr Rendite trägt die versicherte Person, ebenso das Anlagerisiko",
"m"
],
[
"Was ist eine Leibrentenversicherung?",
"Sie zahlt lebenslang eine Rente – die Versicherung trägt das Langleberisiko",
"m"
],
[
"Was unterscheidet die aufgeschobene von der sofort beginnenden Rente?",
"Bei der aufgeschobenen wird zuerst angespart, dann fliesst die Rente; die sofort beginnende startet direkt nach der Einmalprämie",
"s"
],
[
"Was ist eine Rückgewähr bei der Leibrente?",
"Beim frühen Tod erhalten die Hinterbliebenen das noch nicht verrentete Kapital zurück – ohne Rückgewähr verfällt es",
"s"
],
[
"Was ist ein Rückkaufswert?",
"Der Betrag, den die Versicherung bei vorzeitiger Auflösung auszahlt – er entsteht nur bei Verträgen mit Sparteil",
"m"
],
[
"Warum hat eine Risikoversicherung keinen Rückkaufswert?",
"Weil die ganze Prämie für das Risiko und die Kosten verbraucht wird – es wird nichts angespart",
"s"
],
[
"Was ist die prämienfreie Umwandlung?",
"Statt den Vertrag zurückzukaufen, wird er auf eine tiefere Summe ohne weitere Prämien gestellt – der Schutz bleibt reduziert bestehen",
"s"
],
[
"Was ist die Überschussbeteiligung?",
"Der Anteil der versicherten Person am Zins-, Risiko- und Kostengewinn der Versicherung – garantiert ist sie nicht",
"s"
],
[
"Was ist der technische Zins?",
"Der Zinssatz, mit dem die Versicherung die garantierten Leistungen kalkuliert – je tiefer er ist, desto höher die Prämie",
"p"
],
[
"Welches Produkt passt zur Absicherung junger Familien?",
"Eine reine Risikoversicherung – viel Schutz für wenig Prämie; gespart wird getrennt davon",
"s"
],
[
"Was ist eine Prämienbefreiung als Zusatzdeckung?",
"Bei Erwerbsunfähigkeit übernimmt die Versicherung die Prämie weiter – der Vertrag läuft, als würde einbezahlt",
"m"
],
[
"Was ist eine Erwerbsunfähigkeitsrente als Zusatzdeckung?",
"Eine vereinbarte Rente bei Erwerbsunfähigkeit, nach einer gewählten Wartefrist bis zum Endalter",
"m"
],
[
"Warum ist die Wartefrist der wichtigste Hebel bei der EU-Rente?",
"Sie muss zur bestehenden Deckung passen: Wo Krankentaggeld bis Tag 730 läuft, kauft eine kürzere Wartefrist dieselbe Deckung zweimal",
"p"
]
]
},
{
"id": "vbv-qualifiziert",
"nr": 19,
"titel": "Qualifizierte Lebensversicherung",
"deutsch": "Verhaltensregeln beim Verkauf von Policen mit Anlagerisiko",
"w": [
[
"Was ist eine qualifizierte Lebensversicherung?",
"Eine Lebensversicherung, bei der die versicherte Person im Sparprozess ein Verlustrisiko trägt – dazu Kapitalisations- und Tontinengeschäfte",
"e"
],
[
"Wo steht der Begriff der qualifizierten Lebensversicherung?",
"Art. 39a VAG – dort wird sie über das Verlustrisiko im Sparprozess definiert",
"m"
],
[
"Was unterscheidet die klassische von der qualifizierten Lebensversicherung?",
"Bei der klassischen garantiert die Versicherung die Leistung und trägt das Anlagerisiko; bei der qualifizierten trägt es die Kundschaft im Sparprozess",
"e"
],
[
"Welche Produkte gelten typischerweise als qualifiziert?",
"Fonds- und anteilgebundene Policen ohne Kapitalgarantie sowie Kapitalisations- und Tontinengeschäfte",
"m"
],
[
"Welche Produkte gelten nicht als qualifiziert?",
"Klassische Policen mit garantiertem Kapital und Überschussbeteiligung sowie reine Risikoversicherungen ohne Sparteil",
"m"
],
[
"Seit wann gelten die Regeln zur qualifizierten Lebensversicherung?",
"Mit dem revidierten VAG seit dem 1. Januar 2024",
"m"
],
[
"Warum gibt es für diese Produkte eigene Verhaltensregeln?",
"Weil die Kundschaft hier wie eine Anlegerin Risiko trägt – das VAG zieht damit mit dem FIDLEG im Anlagegeschäft gleich",
"s"
],
[
"Was ist die Angemessenheitsprüfung?",
"Vor der Empfehlung werden Kenntnisse und Erfahrungen der Kundschaft mit solchen Produkten erhoben und daran gemessen, ob sie die Risiken versteht",
"e"
],
[
"Womit muss sich die Kundschaft qualifizieren?",
"Nicht mit Vermögen, sondern mit Kenntnissen und Erfahrung – zusätzlich müssen Tragbarkeit, Risiko und Laufzeit zur Lebenssituation und zu den Anlagezielen passen",
"s"
],
[
"Welcher Artikel regelt die Angemessenheitsprüfung?",
"Art. 39j VAG",
"p"
],
[
"Was ist zu tun, wenn das Produkt nicht angemessen ist?",
"Vom Abschluss abraten – und diese Abratung dokumentieren",
"s"
],
[
"Wann entfällt die Angemessenheitsprüfung?",
"Wenn die Kundschaft von sich aus ohne persönliche Beratung abschliesst; darauf ist sie ausdrücklich hinzuweisen",
"p"
],
[
"Was unterscheidet Angemessenheits- und Eignungsprüfung?",
"Die Angemessenheit fragt nur nach Kenntnissen und Erfahrung, die Eignung zusätzlich nach den finanziellen Verhältnissen und den Anlagezielen im Gesamtbild",
"s"
],
[
"Welche Unterlage ist vor dem Abschluss abzugeben?",
"Das Basisinformationsblatt – kostenlos und so rechtzeitig, dass es noch gelesen werden kann",
"e"
],
[
"Was ist beim Abschluss zu dokumentieren?",
"Welche Police abgeschlossen wurde, welche Kenntnisse erhoben wurden, das Ergebnis der Prüfung und eine allfällige Abratung",
"m"
],
[
"Innert welcher Frist ist die Dokumentation herauszugeben?",
"Auf Verlangen innert 10 Arbeitstagen",
"p"
],
[
"Was gilt für Entschädigungen von Dritten?",
"Sie sind vor dem Abschluss offenzulegen – Art und Umfang müssen bekannt sein",
"s"
],
[
"Welche Rolle spielt die Ausbildung des Vermittlers dabei?",
"Wer solche Policen vermittelt, braucht auch Wissen über Anlagen – Fachkenntnis ist Voraussetzung für die Registrierung",
"p"
]
]
},
{
"id": "vbv-bib",
"nr": 20,
"titel": "Das Basisinformationsblatt",
"deutsch": "Was der Kundschaft vor dem Abschluss gezeigt werden muss",
"w": [
[
"Wofür steht die Abkürzung BIB?",
"Basisinformationsblatt",
"e"
],
[
"Für welche Produkte braucht es ein Basisinformationsblatt?",
"Für jede qualifizierte Lebensversicherung – also für Policen mit Verlustrisiko im Sparprozess",
"e"
],
[
"Wann muss das Basisinformationsblatt abgegeben werden?",
"Vor dem Vertragsschluss, kostenlos und rechtzeitig genug, um es in Ruhe zu lesen",
"m"
],
[
"Welche fünf Angaben muss das Basisinformationsblatt enthalten?",
"Name der Versicherung und Identität des Unternehmens, Art und Merkmale, Risiko- und Renditeprofil mit dem höchstmöglichen Verlust, die Kosten sowie Bewilligungen und Genehmigungen",
"m"
],
[
"Was steht im Basisinformationsblatt zu den Anlagen?",
"Worin der Sparteil angelegt wird – etwa Aktien oder Obligationen – und in welchen Währungen; daraus ergeben sich Kurs- und Währungsrisiko",
"m"
],
[
"Warum gehören die Kosten unbedingt ins Basisinformationsblatt?",
"Weil sie die Rendite unmittelbar schmälern – erst der Kostenausweis macht zwei Produkte vergleichbar",
"s"
],
[
"Was muss zum Verlust ausgewiesen werden?",
"Der höchstmögliche Verlust – die Kundschaft soll sehen, was im schlechtesten Fall bleibt",
"m"
],
[
"Was muss die Beispielrechnung zeigen?",
"Mindestens 3 Renditeszenarien – günstig, mittel und ungünstig – mit ihrer Wirkung auf Auszahlung und Rückkaufswert",
"m"
],
[
"Wie muss das Basisinformationsblatt geschrieben sein?",
"Leicht verständlich und in klarer Sprache – es soll auch ohne Vorwissen lesbar sein",
"e"
],
[
"Wie lang darf ein Basisinformationsblatt sein?",
"Kurz: im Anlagegeschäft schreibt die Finanzdienstleistungsverordnung höchstens drei Seiten vor, im Versicherungsrecht steht die Verständlichkeit im Vordergrund",
"p"
],
[
"Warum muss sich das Basisinformationsblatt von Werbung abheben?",
"Weil es eine Entscheidungsgrundlage ist und keine Verkaufshilfe – es ist ein eigenständiges Dokument",
"s"
],
[
"Wozu dient das Basisinformationsblatt überhaupt?",
"Es macht Produkte vergleichbar: dieselben Angaben in derselben Ordnung, auch über Anbieter hinweg",
"s"
],
[
"Wer bleibt für das Basisinformationsblatt verantwortlich?",
"Die Versicherung – auch wenn sie das Erstellen an qualifizierte Dritte auslagert",
"s"
],
[
"Was gilt für gleichwertige ausländische Dokumente?",
"Sie werden anerkannt, wenn sie dieselben Angaben in gleicher Qualität liefern",
"p"
],
[
"Was ist bei Änderungen am Produkt zu tun?",
"Das Basisinformationsblatt regelmässig überprüfen und bei wesentlichen Änderungen anpassen",
"s"
],
[
"Welcher Fehler passiert im Verkaufsgespräch am häufigsten?",
"Das Blatt wird erst mit der Police mitgeschickt – dann kam es zu spät, um die Entscheidung zu tragen",
"p"
]
]
},
{
"id": "vbv-beguenstigung-3a",
"nr": 21,
"titel": "Begünstigung in der Säule 3a",
"deutsch": "Die Reihenfolge nach BVV 3 und was sich daran ändern lässt",
"w": [
[
"Welche Verordnung regelt die Begünstigung in der Säule 3a?",
"Art. 2 BVV 3 (SR 831.461.3)",
"e"
],
[
"Wer ist im Erlebensfall begünstigt?",
"Der Vorsorgenehmer selbst – die Leistung geht an ihn",
"e"
],
[
"Wer steht im Todesfall an erster Stelle?",
"Der überlebende Ehegatte oder die überlebende eingetragene Partnerin beziehungsweise der Partner",
"e"
],
[
"Wer steht an zweiter Stelle?",
"Die direkten Nachkommen, die in erheblichem Masse unterstützten Personen und die Person aus der Lebensgemeinschaft",
"m"
],
[
"Welche Bedingungen gelten für die Lebensgemeinschaft?",
"Bis zum Tod 5 Jahre ununterbrochen zusammengelebt – oder für den Unterhalt gemeinsamer Kinder aufkommen",
"m"
],
[
"Wer steht an dritter, vierter und fünfter Stelle?",
"Die Eltern, dann die Geschwister, dann die übrigen Erben",
"e"
],
[
"Nenne die Reihenfolge im Todesfall vollständig.",
"1. Ehegatte oder eingetragener Partner, 2. Nachkommen, unterstützte Personen und Lebensgemeinschaft, 3. Eltern, 4. Geschwister, 5. übrige Erben",
"m"
],
[
"Was gilt, wenn in einem Rang niemand vorhanden ist?",
"Erst dann rückt der nächste Rang nach – solange ein Rang besetzt ist, kommen die folgenden nicht zum Zug",
"s"
],
[
"Wie viel Spielraum besteht beim ersten Rang?",
"Keiner – der überlebende Ehegatte oder eingetragene Partner lässt sich weder streichen noch überspringen",
"s"
],
[
"Was lässt sich beim zweiten Rang bestimmen?",
"Einzelne Begünstigte lassen sich bezeichnen und ihre Ansprüche näher bestimmen – der Betrag darf also aufgeteilt werden",
"s"
],
[
"Was lässt sich bei den Rängen drei bis fünf ändern?",
"Dort darf die Reihenfolge selbst geändert und die Ansprüche näher bestimmt werden",
"p"
],
[
"Fasse den Spielraum über alle Ränge zusammen.",
"Rang 1 unveränderlich, Rang 2 aufteilbar und näher bestimmbar, Ränge 3 bis 5 auch in der Reihenfolge änderbar",
"p"
],
[
"In welcher Form wird die Begünstigung geändert?",
"Schriftlich gegenüber der Vorsorgestiftung oder der Versicherung – ein Testament allein genügt nicht",
"p"
],
[
"Warum muss eine Lebenspartnerin gemeldet werden?",
"Weil die Stiftung sie sonst nicht kennt – ohne Meldung geht sie leer aus, obwohl das Gesetz sie zulässt",
"s"
],
[
"Fällt das Guthaben der Säule 3a in den Nachlass?",
"Nein – die begünstigten Personen haben einen eigenen Anspruch; das Guthaben zählt aber zur Pflichtteilsberechnungsmasse",
"p"
],
[
"Wie unterscheidet sich die Begünstigung in der Säule 3b?",
"Dort ist sie frei – jede Person kann begünstigt werden, die Pflichtteile bleiben vorbehalten",
"s"
],
[
"Was ist im Konkubinat der häufigste Irrtum?",
"Zu glauben, der Partner sei automatisch begünstigt – ohne Meldung erhält er aus der Säule 3a nichts",
"s"
]
]
},
{
"id": "vbv-3a-praxis",
"nr": 22,
"titel": "Säule 3a in der Praxis",
"deutsch": "Anbieter, Bezug und Gestaltung",
"w": [
[
"Welche zwei Anbieterarten gibt es in der Säule 3a?",
"Banken mit einer Vorsorgestiftung und Versicherungen mit einer Vorsorgepolice",
"e"
],
[
"Was spricht für die Banklösung?",
"Volle Flexibilität – Einzahlung frei wählbar, keine Verpflichtung, keine Abschlusskosten",
"m"
],
[
"Was spricht für die Versicherungslösung?",
"Sie deckt Tod und Erwerbsunfähigkeit mit ab und führt das Sparziel dank Prämienbefreiung auch dann zu Ende",
"m"
],
[
"Was ist der Nachteil der Versicherungslösung?",
"Die Prämie ist verbindlich, und ein vorzeitiger Rückkauf ist meist mit Verlust verbunden",
"s"
],
[
"Was ist eine Wertschriftenlösung in der Säule 3a?",
"Das Guthaben wird in Fonds angelegt statt verzinst – mehr Renditechance, dafür Schwankungen",
"m"
],
[
"Warum lohnen sich mehrere 3a-Konten?",
"Weil sie in verschiedenen Jahren gestaffelt bezogen werden können und so die Progression der Kapitalauszahlungssteuer brechen",
"s"
],
[
"Wie viele 3a-Konten sind sinnvoll?",
"So viele, wie sich in getrennten Jahren beziehen lassen – meist drei bis fünf, je nach Kapital und Kanton",
"p"
],
[
"Darf ein 3a-Konto teilweise bezogen werden?",
"Nein – ein Konto wird immer vollständig aufgelöst; deshalb die Staffelung über mehrere Konten",
"s"
],
[
"Wann muss die Säule 3a spätestens bezogen werden?",
"Beim Erreichen des Referenzalters – bei nachgewiesener Weiterarbeit längstens fünf Jahre danach",
"m"
],
[
"Darf man nach dem Referenzalter noch einzahlen?",
"Ja, solange ein AHV-pflichtiges Erwerbseinkommen erzielt wird und der Bezug aufgeschoben ist",
"s"
],
[
"Können fehlende 3a-Beiträge nachgezahlt werden?",
"Ja, seit dem 1. Januar 2025 – erstmals im Steuerjahr 2026 rückwirkend für 2025, danach bis 10 Jahre zurück",
"p"
],
[
"Welche Bedingungen gelten für einen 3a-Einkauf?",
"AHV-pflichtiges Erwerbseinkommen im Einkaufsjahr und im nachzuzahlenden Jahr, ordentlicher Jahresbeitrag vollständig einbezahlt, Lücken vor 2025 zählen nicht",
"p"
],
[
"Wie viel darf pro Jahr zusätzlich eingekauft werden?",
"Höchstens der kleine Beitrag, also 7'258 – zusätzlich zum vollen ordentlichen Jahresbeitrag",
"p"
],
[
"Können Lücken aus der Zeit vor der Neuerung nachgezahlt werden?",
"Nein – nur Beitragsjahre ab 2025 zählen; ältere Lücken bleiben für immer offen",
"s"
],
[
"Wie hoch ist der 3a-Abzug für Selbstständige ohne Pensionskasse?",
"20 % des Erwerbseinkommens, höchstens 36'288",
"e"
]
]
},
{
"id": "vbv-3b-praxis",
"nr": 23,
"titel": "Säule 3b in der Praxis",
"deutsch": "Freie Vorsorge und ihre Gestaltung",
"w": [
[
"Was gehört alles zur Säule 3b?",
"Sparkonten, Wertschriften, freie Lebensversicherungen, Wohneigentum – jede Ersparnis ohne gesetzliche Bindung",
"e"
],
[
"Was ist der Hauptvorteil der Säule 3b?",
"Volle Verfügbarkeit und freie Begünstigung – kein Sperrfrist, keine Vorschriften zur Auszahlung",
"m"
],
[
"Was ist der Hauptnachteil der Säule 3b?",
"Kein Steuerabzug auf den Einzahlungen",
"m"
],
[
"Wie wird eine 3b-Lebensversicherung während der Laufzeit besteuert?",
"Der Rückkaufswert zählt zum steuerbaren Vermögen",
"s"
],
[
"Wann ist die Kapitalleistung einer rückkaufsfähigen Kapitalversicherung steuerfrei?",
"Auszahlung nach dem 60. Altersjahr, Vertragsdauer mindestens fünf Jahre, Abschluss vor dem 66. Altersjahr und Finanzierung durch periodische Prämien (Art. 24 lit. b DBG)",
"p"
],
[
"Für wen ist die Säule 3b besonders interessant?",
"Für alle, die über den 3a-Maximalbetrag hinaus sparen, und für Personen ohne AHV-pflichtiges Erwerbseinkommen",
"s"
],
[
"Was ist der Vorteil der freien Begünstigung in der Säule 3b?",
"Der Konkubinatspartner kann direkt begünstigt werden – die Leistung fällt nicht in den Nachlass, die Pflichtteile bleiben aber zu beachten",
"p"
],
[
"Warum ist eine 3b-Police auch im Konkurs interessant?",
"Eine Police mit begünstigtem Ehegatten oder Nachkommen ist der Zwangsvollstreckung teilweise entzogen",
"p"
],
[
"Was ist der Unterschied zwischen 3a und 3b bei der Verfügbarkeit?",
"3a ist bis fünf Jahre vor dem Referenzalter gesperrt, 3b jederzeit verfügbar",
"e"
]
]
},
{
"id": "vbv-steuern",
"nr": 24,
"titel": "Steuern in der Vorsorge",
"deutsch": "Einzahlen, halten, beziehen",
"w": [
[
"Wie werden 3a-Einzahlungen besteuert?",
"Sie sind vom steuerbaren Einkommen abziehbar",
"e"
],
[
"Wie wird 3a-Guthaben während der Laufzeit besteuert?",
"Gar nicht – weder Einkommens- noch Vermögenssteuer",
"m"
],
[
"Wie wird 3a-Kapital bei der Auszahlung besteuert?",
"Getrennt vom übrigen Einkommen zu einem reduzierten Satz – kantonal unterschiedlich",
"m"
],
[
"Wie werden Einkäufe in die Pensionskasse besteuert?",
"Sie sind im Einzahlungsjahr voll vom Einkommen abziehbar",
"m"
],
[
"Wie werden Renten aus AHV und Pensionskasse besteuert?",
"Zu 100 % als Einkommen",
"m"
],
[
"Wie wird eine Leibrente aus der Säule 3b besteuert?",
"Bis 2024 pauschal 40 % Ertragsanteil. Seit 2025 gilt: Garantierte Leistungen nach dem technischen Zinssatz bei Vertragsabschluss, Überschussleistungen zu 70 % (Art. 22 Abs. 3 DBG)",
"p"
],
[
"Welche Sperrfrist gilt nach einem Pensionskassen-Einkauf?",
"3 Jahre bis zu einem Kapitalbezug – sonst wird der Abzug nachträglich aufgerechnet",
"s"
],
[
"Warum lohnt sich Einkaufen in Etappen?",
"Mehrere Einkäufe in verschiedenen Jahren wirken stärker als ein grosser, weil sie die Progression jedes Jahr neu brechen",
"s"
],
[
"Was ist bei Kapitalbezug und Einkauf im selben Zeitraum zu beachten?",
"Einkauf und Kapitalbezug innerhalb der Sperrfrist gelten als Steuerumgehung – der Abzug wird verweigert",
"p"
],
[
"Wie werden Todesfallleistungen aus der Säule 3a besteuert?",
"Als Kapitalleistung aus Vorsorge beim Empfänger, getrennt und zum reduzierten Satz",
"s"
],
[
"Sind Leistungen aus einer reinen Risikoversicherung der Säule 3b steuerbar?",
"Ja – die Police ist nicht rückkaufsfähig, deshalb wird die Todesfallsumme mit der Kapitalleistungssteuer zum Vorsorgetarif erfasst",
"p"
]
]
},
{
"id": "vbv-steuermatrix",
"nr": 25,
"titel": "Besteuerung nach Säule und Leistung",
"deutsch": "Welche Steuer trifft welche Leistung",
"w": [
[
"Welche drei Steuerarten sind hier zu unterscheiden?",
"Die Einkommenssteuer, die Kapitalleistungssteuer zum Sondersatz und die kantonale Erbschaftssteuer",
"e"
],
[
"Wie wird eine Rente aus der 2. Säule besteuert?",
"Einkommenssteuer – zu 100 % zusammen mit dem übrigen Einkommen",
"e"
],
[
"Wie wird eine Kapitalleistung aus der 2. Säule besteuert?",
"Kapitalleistungssteuer – gesondert vom übrigen Einkommen zum Sondersatz (Art. 38 DBG)",
"e"
],
[
"Wie wird die Ablaufleistung einer gemischten Lebensversicherung der Säule 3a besteuert?",
"Kapitalleistungssteuer",
"m"
],
[
"Wie wird der Tod während der Laufzeit bei einer gemischten 3a-Police besteuert?",
"Ebenfalls mit der Kapitalleistungssteuer – die Leistung fällt nicht in den Nachlass",
"m"
],
[
"Wie wird eine reine Erwerbsunfähigkeitsrente aus der Säule 3a besteuert?",
"Einkommenssteuer",
"m"
],
[
"Wie wird eine reine Todesfallversicherung der Säule 3a besteuert?",
"Kapitalleistungssteuer",
"m"
],
[
"Wie wird eine reine Erwerbsunfähigkeitsrente aus der Säule 3b besteuert?",
"Einkommenssteuer – sie ersetzt Erwerbseinkommen",
"m"
],
[
"Wie wird eine reine Todesfallkapitalversicherung der Säule 3b besteuert?",
"Mit der Kapitalleistungssteuer zum Vorsorgetarif – die Police ist nicht rückkaufsfähig",
"m"
],
[
"Wie wird die Ablaufleistung einer gemischten Lebensversicherung der Säule 3b besteuert?",
"Steuerfrei, sofern die Bedingungen erfüllt sind",
"m"
],
[
"Welche Bedingungen machen die 3b-Kapitalversicherung steuerfrei?",
"Auszahlung nach dem 60. Altersjahr, Vertragsdauer mindestens fünf Jahre, Abschluss vor dem 66. Altersjahr und Finanzierung durch periodische Prämien (Art. 24 lit. b DBG)",
"p"
],
[
"Wie wird der Tod während der Laufzeit bei einer gemischten 3b-Police behandelt?",
"Einkommenssteuerfrei, kantonale Erbschaftssteuer vorbehalten",
"p"
],
[
"Wo liegt der Unterschied zwischen 3a und 3b im Todesfall?",
"In der Säule 3a fällt die Kapitalleistungssteuer an; in der Säule 3b bleibt die Leistung einkommenssteuerfrei, dafür kann die Erbschaftssteuer greifen",
"s"
],
[
"Was haben alle Renten gemeinsam?",
"Sie werden als Einkommen besteuert – gleich aus welcher Säule sie stammen",
"s"
],
[
"Was haben alle Kapitalleistungen aus gebundener Vorsorge gemeinsam?",
"Sie werden gesondert vom übrigen Einkommen zum Sondersatz besteuert",
"s"
],
[
"Warum ist die reine Risikoversicherung der Säule 3b nicht steuerfrei?",
"Weil die Steuerfreiheit nur rückkaufsfähigen Kapitalversicherungen zusteht – eine reine Risikoversicherung hat keinen Rückkaufswert",
"p"
],
[
"Woran erkennt man, ob Kapitalleistungssteuer oder Steuerfreiheit gilt?",
"An der Bindung: gebundene Vorsorge wird beim Bezug besteuert, die freie 3b-Kapitalversicherung bleibt unter Bedingungen frei",
"p"
],
[
"Merksatz zur ganzen Übersicht?",
"Renten als Einkommen, Kapital gesondert – nur die rückkaufsfähige 3b-Kapitalversicherung fällt heraus",
"s"
]
]
},
{
"id": "vbv-beguenstigung",
"nr": 26,
"titel": "Begünstigung und Erbrecht",
"deutsch": "Wer bekommt was im Todesfall",
"w": [
[
"Was ist eine Begünstigungsklausel?",
"Die Bestimmung, wer die Todesfallleistung erhält – sie geht dem Erbrecht vor, weil die Leistung nicht in den Nachlass fällt",
"e"
],
[
"Wo ist die Begünstigung in der Säule 3a geregelt?",
"In der BVV 3 – sie gibt die Reihenfolge zwingend vor, anders als in der frei gestaltbaren Säule 3b",
"s"
],
[
"Wie ist die Begünstigung in der Säule 3b geordnet?",
"Frei – jede Person kann begünstigt werden, die Pflichtteile bleiben aber vorbehalten",
"m"
],
[
"Seit wann gilt das revidierte Erbrecht?",
"1. Januar 2023",
"m"
],
[
"Wie hoch ist der Pflichtteil der Nachkommen?",
"1/2 des gesetzlichen Erbanspruchs (vorher 3/4)",
"s"
],
[
"Wie hoch ist der Pflichtteil des Ehegatten?",
"1/2 des gesetzlichen Erbanspruchs (unverändert)",
"s"
],
[
"Was hat sich beim Pflichtteil der Eltern geändert?",
"Er ist aufgehoben – Eltern haben seit 2023 keinen Pflichtteil mehr",
"s"
],
[
"Wie gross ist die frei verfügbare Quote bei Nachkommen?",
"bis zur Hälfte des Nachlasses (vorher 3/8)",
"p"
],
[
"Welche Erbrechte hat ein Konkubinatspartner?",
"Keine – ohne Testament oder Erbvertrag erbt er nichts",
"s"
],
[
"Welche drei Schritte schützen einen Konkubinatspartner ohne Kosten?",
"Begünstigungserklärung bei der Pensionskasse einreichen, Begünstigung in der Säule 3a melden, Testament errichten",
"s"
],
[
"Was ist ein Vorsorgeauftrag?",
"Die Bestimmung, wer bei eigener Urteilsunfähigkeit die persönlichen und finanziellen Angelegenheiten übernimmt",
"m"
],
[
"Was ist eine Patientenverfügung?",
"Die Festlegung, welchen medizinischen Massnahmen man bei Urteilsunfähigkeit zustimmt",
"m"
]
]
},
{
"id": "vbv-wef",
"nr": 27,
"titel": "Wohneigentumsförderung",
"deutsch": "Vorbezug und Verpfändung",
"w": [
[
"Welche zwei Wege der Wohneigentumsförderung gibt es?",
"Vorbezug und Verpfändung des Vorsorgeguthabens",
"e"
],
[
"Wie hoch ist der Mindestbetrag für einen Vorbezug?",
"20'000",
"m"
],
[
"Wie oft darf vorbezogen werden?",
"alle 5 Jahre",
"m"
],
[
"Was gilt ab Alter 50?",
"Anspruch mit 50 oder die Hälfte des heutigen Guthabens",
"p"
],
[
"Wofür darf Vorsorgegeld eingesetzt werden?",
"Für Kauf oder Bau, für die Rückzahlung von Hypotheken oder für Anteilscheine – nur beim selbst bewohnten Wohneigentum",
"m"
],
[
"Welche Zustimmung ist nötig?",
"schriftliche Zustimmung des Ehegatten oder eingetragenen Partners",
"m"
],
[
"Was ist der Unterschied zwischen Vorbezug und Verpfändung?",
"Der Vorbezug nimmt Geld aus der Vorsorge und kürzt die Leistungen; die Verpfändung lässt das Guthaben stehen und dient nur als Sicherheit",
"s"
],
[
"Welche Steuerfolge hat ein Vorbezug?",
"Er wird wie eine Kapitalleistung aus Vorsorge besteuert – bei Rückzahlung wird die Steuer zinslos zurückerstattet",
"s"
],
[
"Wann muss ein Vorbezug zurückbezahlt werden?",
"Beim Verkauf der Liegenschaft – freiwillig ist die Rückzahlung jederzeit bis drei Jahre vor dem Referenzalter möglich",
"s"
],
[
"Welche Lücke reisst ein Vorbezug?",
"Er kürzt Alters- und oft auch Risikoleistungen – diese Lücke gehört in der Beratung berechnet und abgesichert",
"p"
]
]
},
{
"id": "vbv-vvg",
"nr": 28,
"titel": "Der Versicherungsvertrag",
"deutsch": "VVG: Abschluss, Pflichten und Fristen",
"w": [
[
"Wofür steht VVG?",
"Versicherungsvertragsgesetz",
"e"
],
[
"Wie kommt ein Versicherungsvertrag zustande?",
"Durch Antrag und Annahme – die Police ist nur die Beurkundung, nicht der Vertragsschluss",
"m"
],
[
"Wie lange gilt das Widerrufsrecht?",
"14 Tage seit dem Antrag oder der Annahme – ausgenommen sind Kollektivverträge der Personenversicherung",
"m"
],
[
"Wann kann ein längerfristiger Vertrag ordentlich gekündigt werden?",
"auf Ende des dritten Jahres und danach jährlich",
"s"
],
[
"Wie lange dauert die Verjährung von Ansprüchen?",
"5 Jahre – beim kollektiven Krankentaggeld 2 Jahre",
"s"
],
[
"Seit wann gilt das revidierte VVG?",
"1. Januar 2022",
"m"
],
[
"Was ist die Anzeigepflicht?",
"Die Pflicht, alle für die Risikobeurteilung erheblichen Gefahrstatsachen wahrheitsgetreu zu melden – gefragt wird schriftlich",
"s"
],
[
"Was passiert bei einer Anzeigepflichtverletzung?",
"Die Versicherung kann den Vertrag innert vier Wochen ab Kenntnis kündigen; die Leistungspflicht entfällt, soweit ein Zusammenhang besteht",
"p"
],
[
"Was geschieht bei Prämienverzug?",
"Mahnung mit 14 Tagen Frist; danach ruht die Leistungspflicht, und nach zwei Monaten gilt der Vertrag als aufgehoben, wenn die Prämie nicht eingefordert wird",
"p"
],
[
"Was ist ein Vorbehalt?",
"Der schriftliche Ausschluss einer bestimmten bestehenden Gesundheitsbeeinträchtigung von der Deckung",
"s"
],
[
"Was ist der Unterschied zwischen Schaden- und Summenversicherung?",
"Die Schadenversicherung ersetzt den tatsächlichen Schaden und wird koordiniert; die Summenversicherung zahlt die vereinbarte Summe unabhängig davon",
"s"
]
]
},
{
"id": "vbv-risikopruefung",
"nr": 29,
"titel": "Risikoprüfung",
"deutsch": "Gesundheitsprüfung und ihre Folgen",
"w": [
[
"Wozu dient die Gesundheitsprüfung?",
"Zur Einschätzung des Risikos – damit gleiche Risiken gleiche Prämien tragen",
"e"
],
[
"Welche Ergebnisse kann eine Risikoprüfung haben?",
"Annahme zu normalen Bedingungen, Annahme mit Prämienzuschlag, Annahme mit Vorbehalt, Zurückstellung oder Ablehnung",
"s"
],
[
"Was ist ein Prämienzuschlag?",
"Ein Aufschlag für ein erhöhtes Risiko – die Deckung bleibt vollständig",
"m"
],
[
"Wann braucht es eine ärztliche Untersuchung?",
"Ab bestimmten Versicherungssummen oder bei Auffälligkeiten in der Gesundheitserklärung",
"m"
],
[
"Warum gibt es im BVG-Obligatorium keine Gesundheitsprüfung?",
"Weil es ein Obligatorium ist – geprüft werden darf nur der überobligatorische Teil",
"s"
],
[
"Wie lange darf ein BVG-Vorbehalt dauern?",
"Höchstens fünf Jahre, und nur im überobligatorischen Teil",
"p"
],
[
"Was ist das Übertrittsrecht im Krankentaggeld?",
"Der Wechsel vom Kollektiv- in den Einzelvertrag ohne neue Gesundheitsprüfung – üblich innert 90 Tagen",
"s"
],
[
"Warum ist der frühe Abschluss ein Argument?",
"Weil die Gesundheit mit den Jahren selten besser wird – ein Vorbehalt heute schliesst die Deckung für morgen aus",
"s"
]
]
},
{
"id": "vbv-beratung",
"nr": 30,
"titel": "Beratung und Aufsicht",
"deutsch": "Pflichten des Vermittlers",
"w": [
[
"Wer beaufsichtigt die Versicherungen in der Schweiz?",
"Die FINMA – die Eidgenössische Finanzmarktaufsicht",
"e"
],
[
"Wofür steht VAG?",
"Versicherungsaufsichtsgesetz",
"e"
],
[
"Was unterscheidet gebundene von ungebundenen Vermittlern?",
"Gebundene arbeiten für eine Versicherung, ungebundene im Auftrag der Kundschaft – Makler müssen ihre Ungebundenheit offenlegen",
"s"
],
[
"Was muss der Vermittler vor Vertragsabschluss offenlegen?",
"Identität und Adresse, Art der Bindung, wer die Entschädigung bezahlt, Umgang mit Interessenkonflikten und die zuständige Ombudsstelle",
"p"
],
[
"Was gehört in ein Beratungsprotokoll?",
"Bedürfnisse und Ziele der Kundschaft, die geprüften Lösungen, die Empfehlung und ihre Begründung",
"s"
],
[
"Warum ist das Beratungsprotokoll wichtig?",
"Es ist der Nachweis, dass die Empfehlung zur Situation passte – ohne Protokoll steht Aussage gegen Aussage",
"s"
],
[
"Welche Weiterbildungspflicht gilt für Vermittler?",
"Vermittler müssen die geforderten Mindeststandards an Aus- und Weiterbildung nachweisen und im FINMA-Register eingetragen sein",
"m"
],
[
"Welche Sorgfaltspflicht gilt bei der Bedarfsanalyse?",
"Die Empfehlung muss auf einer erhobenen Ausgangslage beruhen – Alter, Familie, Einkommen, bestehende Deckungen und Ziele",
"s"
],
[
"Was ist der Ablauf einer Vorsorgeberatung?",
"Situation erheben, Lücken berechnen, Ziele festlegen, Lösungen vergleichen, empfehlen und begründen, umsetzen, periodisch überprüfen",
"s"
]
]
},
{
"id": "vbv-analyse",
"nr": 31,
"titel": "Vorsorgeanalyse",
"deutsch": "Lücken erkennen und rechnen",
"w": [
[
"Welche drei Risiken deckt eine Vorsorgeanalyse ab?",
"Alter, Invalidität und Tod",
"e"
],
[
"Was steht im Vorsorgeausweis?",
"Versicherter Lohn, Altersguthaben, voraussichtliche Altersrente, Invaliden- und Hinterlassenenleistungen sowie das Einkaufspotenzial",
"s"
],
[
"Wie wird eine Vorsorgelücke berechnet?",
"Bedarf minus die Summe der Leistungen aus 1. und 2. Säule – die Differenz ist die Lücke",
"m"
],
[
"Welcher Bedarf wird üblicherweise angesetzt?",
"80 bis 100 % des bisherigen Einkommens, je nach Lebenssituation",
"m"
],
[
"Was ist der IK-Auszug?",
"Der Auszug aus dem individuellen Konto der AHV – er zeigt alle gemeldeten Einkommen und deckt Beitragslücken auf",
"s"
],
[
"Wie oft sollte eine Vorsorgeanalyse überprüft werden?",
"Bei jedem Lebensereignis – Heirat, Geburt, Stellenwechsel, Wohneigentum, Scheidung – und sonst alle paar Jahre",
"m"
],
[
"Warum ist der Todesfall im Konkubinat der schwerste Fall?",
"Weil dort alle drei Ebenen fehlen: keine AHV-Witwenrente, meist keine Pensionskassenrente, kein gesetzliches Erbrecht",
"p"
],
[
"Warum ist die Krankheit meist schlechter gedeckt als der Unfall?",
"Weil das UVG eine Invalidenrente von 80 % kennt; bei Krankheit tragen IV und Pensionskasse allein",
"s"
],
[
"Was ist bei Teilzeitarbeit besonders zu prüfen?",
"Der Koordinationsabzug trifft kleine Pensen hart – der versicherte Lohn fällt überproportional tief aus",
"p"
]
]
},
{
"id": "vbv-begriffe",
"nr": 32,
"titel": "Wichtige Begriffe",
"deutsch": "Was in der Prüfung genau unterschieden wird",
"w": [
[
"Was ist der versicherte Verdienst?",
"Die Rechnungsgrundlage des UVG – der AHV-Lohn bis zum Höchstverdienst",
"m"
],
[
"Was ist der koordinierte Lohn?",
"Die Rechnungsgrundlage des BVG – der AHV-Lohn abzüglich Koordinationsabzug, begrenzt nach oben und unten",
"m"
],
[
"Was ist der mutmasslich entgangene Verdienst?",
"Was die versicherte Person ohne den Schadenfall verdient hätte – die Bezugsgrösse der BVG-Überentschädigung",
"s"
],
[
"Was ist das massgebende durchschnittliche Jahreseinkommen?",
"Die Rechnungsgrundlage der AHV-Rente – das aufgewertete Durchschnittseinkommen samt Gutschriften",
"s"
],
[
"Was ist der Unterschied zwischen Arbeitsunfähigkeit und Erwerbsunfähigkeit?",
"Arbeitsunfähigkeit bezieht sich auf den bisherigen Beruf, Erwerbsunfähigkeit auf jede zumutbare Tätigkeit",
"p"
],
[
"Was ist der Deckungsgrad einer Pensionskasse?",
"Das Verhältnis von Vorsorgevermögen zu Vorsorgekapital – unter 100 % besteht eine Unterdeckung",
"s"
],
[
"Was ist eine Teilliquidation?",
"Die anteilige Aufteilung des Vorsorgevermögens, wenn ein grösserer Teil des Bestands die Kasse verlässt",
"p"
],
[
"Was ist das Freizügigkeitsgesetz?",
"Das FZG regelt, was beim Stellenwechsel mit dem Guthaben geschieht",
"m"
],
[
"Was ist der Sicherheitsfonds BVG?",
"Er sichert die gesetzlichen Leistungen bei Zahlungsunfähigkeit einer Vorsorgeeinrichtung und gleicht ungünstige Altersstrukturen aus",
"s"
],
[
"Was ist die 2. Säule plus?",
"Der überobligatorische Teil der beruflichen Vorsorge – frei gestaltbar, ohne gesetzlichen Mindestzins und Mindestumwandlungssatz",
"p"
],
[
"Was ist eine Kaderlösung 1e?",
"Ein Vorsorgeplan für Lohnbestandteile über einer gesetzlichen Grenze, bei dem die versicherte Person die Anlagestrategie selbst wählt und das Risiko trägt",
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
export const FAELLE = [];
