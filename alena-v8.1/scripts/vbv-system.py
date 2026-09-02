"""Baut die Systemkapitel für Versicherungen/Leben.

Grundlage sind die geprüften Kennzahlen 2026 (kennzahlen.json) und die
gesetzlichen Grundzüge. Die Kapitel ergänzen die beiden Fallkapitel.
"""
import json, io

K = json.load(open('kennzahlen.json', encoding='utf-8'))
CHF = lambda n: f"{n:,}".replace(',', "'")

kapitel = []


def kap(kid, titel, deutsch):
    k = {'id': kid, 'titel': titel, 'deutsch': deutsch, 'w': []}
    kapitel.append(k)
    return k


def add(k, vorne, hinten, niveau):
    k['w'].append([vorne, hinten, niveau])


# ================================================== Drei-Säulen-System
k = kap('vbv-system', 'Das Drei-Säulen-System', 'Aufbau, Zweck und Verfassungsauftrag')
add(k, 'Welche drei Säulen kennt die Schweizer Vorsorge?',
    '1. Säule: staatliche Vorsorge · 2. Säule: berufliche Vorsorge · 3. Säule: private Vorsorge', 'e')
add(k, 'Was ist der Zweck der 1. Säule?',
    'Existenzsicherung – sie soll den Grundbedarf decken', 'e')
add(k, 'Was ist der Zweck der 2. Säule?',
    'Fortsetzung der gewohnten Lebenshaltung zusammen mit der 1. Säule', 'e')
add(k, 'Was ist der Zweck der 3. Säule?',
    'Individuelle Ergänzung – schliesst die verbleibenden Lücken', 'e')
add(k, 'Wie viel sollen 1. und 2. Säule zusammen etwa decken?',
    'rund 60 % des letzten Lohnes – der Rest ist Sache der 3. Säule', 'm')
add(k, 'Welcher Verfassungsartikel regelt das Drei-Säulen-Konzept?',
    'Art. 111 BV', 'm')
add(k, 'Welche Versicherungen gehören zur 1. Säule?',
    'AHV, IV, EL, EO/MSE, ALV – dazu die obligatorische Unfallversicherung UVG als eigenständiger Zweig', 'm')
add(k, 'Was gehört zur 2. Säule?',
    'BVG (obligatorisch und überobligatorisch), UVG sowie die Freizügigkeitseinrichtungen', 'm')
add(k, 'Was unterscheidet Säule 3a von Säule 3b?',
    '3a ist gebunden mit Steuerabzug und Bezugssperre; 3b ist frei, ohne Abzug und jederzeit verfügbar', 'm')
add(k, 'Was heisst „gebundene Vorsorge“?',
    'Das Kapital ist bis frühestens fünf Jahre vor dem Referenzalter gesperrt – Ausnahmen sind gesetzlich geregelt', 'm')

# ================================================== Finanzierungsverfahren
k = kap('vbv-finanzierung', 'Finanzierungsverfahren', 'Umlage, Kapitaldeckung und Bedarfsdeckung')
add(k, 'Welche drei Finanzierungsverfahren muss man unterscheiden?',
    'Ausgabenumlageverfahren, Kapitaldeckungsverfahren und Bedarfsdeckungsverfahren', 'e')
add(k, 'Wie funktioniert das Ausgabenumlageverfahren?',
    'Die Beiträge der Erwerbstätigen finanzieren unmittelbar die laufenden Renten – eingenommenes Geld geht direkt wieder hinaus, es wird kein Kapital angespart', 's')
add(k, 'Welche Versicherungen laufen im Umlageverfahren?',
    'Die 1. Säule: AHV, IV, EO und ALV', 'e')
add(k, 'Was ist der Generationenvertrag?',
    'Die heute Erwerbstätigen zahlen die Renten der heutigen Rentner – im Vertrauen darauf, dass die nächste Generation dasselbe tut', 's')
add(k, 'Was ist die Schwäche des Umlageverfahrens?',
    'Es hängt vom Verhältnis Erwerbstätige zu Rentner ab – die Demografie trifft es unmittelbar', 's')
add(k, 'Wie funktioniert das Kapitaldeckungsverfahren?',
    'Jede versicherte Person spart ihr eigenes Alterskapital an; die Rente wird später aus diesem Kapital und seinen Zinsen bezahlt', 's')
add(k, 'Welche Versicherungen laufen im Kapitaldeckungsverfahren?',
    'Die 2. Säule (BVG) und die 3. Säule', 'e')
add(k, 'Was ist die Schwäche des Kapitaldeckungsverfahrens?',
    'Es hängt an Zins und Kapitalmarkt – und an der Lebenserwartung, weil dasselbe Kapital länger reichen muss', 's')
add(k, 'Wie funktioniert das Bedarfsdeckungsverfahren?',
    'Die Beiträge einer Periode decken die in derselben Periode anfallenden Schäden; es wird nur für laufende Fälle Kapital zurückgestellt', 's')
add(k, 'Wo kommt das Bedarfsdeckungsverfahren zur Anwendung?',
    'Bei den Risikoversicherungen – zum Beispiel im UVG und bei den Risikoleistungen des BVG', 's')
add(k, 'Was ist der dritte Beitragszahler?',
    'Der Zins auf dem angesparten Kapital – neben Arbeitnehmer und Arbeitgeber', 's')
add(k, 'Woran erkennt man das Verfahren einer Versicherung?',
    'Wird Kapital je Person angespart, ist es Kapitaldeckung; fliesst das Geld direkt an die Bezüger, ist es Umlage', 'p')

# ================================================== 1. Säule – AHV
k = kap('vbv-ahv', 'Erste Säule – AHV', 'Beiträge, Renten und Berechnung')
A = K['ahv']
add(k, 'Wofür stehen die Buchstaben AHV?', 'Alters- und Hinterlassenenversicherung', 'e')
add(k, 'Wie hoch ist der AHV/IV/EO-Beitrag insgesamt?',
    f"{A['beitrag_total']} (AHV {A['ahv']}, IV {A['iv']}, EO {A['eo']})", 'e')
add(k, 'Wie wird der AHV/IV/EO-Beitrag aufgeteilt?',
    f"je {A['je_haelfte']} Arbeitnehmer und Arbeitgeber", 'e')
add(k, 'Wie hoch sind die Lohnabzüge mit ALV zusammen?',
    f"{A['mit_alv_bis_hoechstlohn']} bis zum ALV-Höchstlohn, darüber nur noch {A['beitrag_total']}", 'm')
add(k, 'Ab wann ist man beitragspflichtig?',
    'Erwerbstätige ab dem 1. Januar nach dem 17. Geburtstag, Nichterwerbstätige ab dem 21.', 'm')
add(k, 'Wie hoch ist der Höchstsatz für Selbstständigerwerbende?',
    f"{A['selbstaendig_max']} – die sinkende Skala gilt unter {CHF(A['selbstaendig_sinkend_ab'])} Franken Einkommen", 'm')
add(k, 'Wie hoch ist der AHV-Mindestbeitrag im Jahr?', CHF(A['mindestbeitrag']), 'm')
add(k, 'Wie hoch ist der Höchstbeitrag für Nichterwerbstätige?',
    f"{CHF(A['hoechstbeitrag_nichterwerbstaetige'])} im Jahr", 'p')
add(k, 'Welcher Freibetrag gilt nach dem Referenzalter?',
    f"{CHF(A['freibetrag_rentner_jahr'])} im Jahr, also {CHF(1400)} im Monat", 'm')
add(k, 'Ab welchem Lohn werden Beiträge auf geringfügigen Löhnen erhoben?',
    f"über {CHF(A['geringfuegiger_lohn'])} im Kalenderjahr", 'p')
add(k, 'Wie hoch ist die minimale AHV-Altersrente?', f"{CHF(A['mindestrente'])} im Monat", 'e')
add(k, 'Wie hoch ist die maximale AHV-Altersrente?', f"{CHF(A['maximalrente'])} im Monat", 'e')
add(k, 'Wie hoch ist der Ehepaar-Plafond?',
    f"{CHF(A['plafond_ehepaar'])} im Monat – 150 % der Maximalrente", 'm')
add(k, 'Ab welchem durchschnittlichen Jahreseinkommen gibt es die Maximalrente?',
    CHF(A['maximalrente_ab_durchschnitt']), 'm')
add(k, 'Wie hoch ist die AHV-Kinderrente?',
    f"40 % der Altersrente, also {CHF(A['kinderrente_min'])} bis {CHF(A['kinderrente_max'])}", 'm')
add(k, 'Wovon hängt die Höhe der AHV-Rente ab?',
    'Von der Beitragsdauer und vom massgebenden durchschnittlichen Jahreseinkommen', 'm')
add(k, 'Was ist die Rentenskala 44?',
    'Die Skala für die vollständige Beitragsdauer von 44 Jahren – jedes fehlende Beitragsjahr kostet rund 1/44 der Rente', 's')
add(k, 'Was sind Erziehungsgutschriften?',
    'Ein fiktiver Einkommenszuschlag für Jahre mit Kindern unter 16 – dreifache minimale Altersrente pro Jahr', 's')
add(k, 'Was sind Betreuungsgutschriften?',
    'Ein Zuschlag für die Betreuung pflegebedürftiger Verwandter, wenn keine Erziehungsgutschrift läuft', 's')
add(k, 'Was ist das Splitting?',
    'Die während der Ehe erzielten Einkommen werden bei Scheidung oder Rentenfall hälftig auf beide Ehegatten aufgeteilt', 's')
add(k, 'Was ist eine Beitragslücke?',
    'Ein Jahr ohne Beiträge – es kürzt die Rente dauerhaft; nachzahlen lässt sich nur innerhalb von fünf Jahren', 's')

# ================================================== Flexibler Rücktritt
k = kap('vbv-fruehpensionierung', 'Frühpensionierung und Aufschub', 'Flexibler Rücktritt in allen Säulen')
FL = K['flexibel']
add(k, 'Wie hoch ist das Referenzalter?', '65 Jahre für Männer und Frauen', 'e')
add(k, 'Wie steht es 2026 beim Referenzalter der Frauen?',
    f"{FL['referenzalter_frauen_2026']} – es steigt bis 2028 schrittweise auf 65", 'm')
add(k, 'Ab wann kann die AHV-Rente vorbezogen werden?',
    f"ab {FL['vorbezug_ab']} Jahren; Frauen der Übergangsgeneration 1961–1969 ab {FL['vorbezug_frauen_uebergang_ab']}", 'm')
add(k, 'Wie stark wird die AHV-Rente bei einem Jahr Vorbezug gekürzt?', FL['kuerzung_1_jahr'], 'm')
add(k, 'Wie stark wird sie bei zwei Jahren Vorbezug gekürzt?', FL['kuerzung_2_jahre'], 'm')
add(k, 'Bleibt die Kürzung beim Vorbezug bestehen?',
    'Ja, lebenslang – auch nach Erreichen des Referenzalters', 's')
add(k, 'Wie lange kann die AHV-Rente aufgeschoben werden?',
    f"{FL['aufschub_min']} bis {FL['aufschub_max']} Jahre", 'm')
add(k, 'Wie hoch ist der Zuschlag bei fünf Jahren Aufschub?', FL['zuschlag_5_jahre'], 'm')
add(k, 'Was passiert mit der Beitragspflicht bei Frühpensionierung?',
    'Sie bleibt bis zum Referenzalter bestehen – als Nichterwerbstätiger, sofern kein Ehegatte genügend beiträgt', 's')
add(k, 'Was kostet die Frühpensionierung in der 2. Säule?',
    'Doppelt: Es fehlen Sparjahre samt Zins, und der Umwandlungssatz ist tiefer', 's')
add(k, 'Was ist der Kürzungsdreiklang der Frühpensionierung?',
    'Gekürzte AHV-Rente, kleineres Alterskapital mit tieferem Umwandlungssatz, und die Beitragspflicht läuft weiter', 'p')
add(k, 'Wie lässt sich eine Frühpensionierung überbrücken?',
    'Mit Kapital aus der Säule 3a oder 3b, mit einer BVG-Überbrückungsrente oder mit Teilpensionierung', 's')

# ================================================== IV
k = kap('vbv-iv', 'Erste Säule – IV', 'Invalidenversicherung und ihr Rentensystem')
I = K['iv']
add(k, 'Was ist der Grundsatz der IV?',
    'Eingliederung vor Rente', 'e')
add(k, 'Ab welchem Invaliditätsgrad besteht ein Rentenanspruch?', f"ab {I['kein_anspruch_unter']}", 'e')
add(k, 'Wie funktioniert das stufenlose Rentensystem?',
    f"40–49 %: 25 % einer ganzen Rente plus 2.5 Prozentpunkte je IV-Grad · 50–{I['stufenlos_bis']}: Rente gleich IV-Grad · ab {I['vollrente_ab']}: ganze Rente", 's')
add(k, 'Wie hoch ist die IV-Rente bei einem IV-Grad von 60 %?',
    '60 % einer ganzen Rente – zwischen 50 und 69 % entspricht die Rente dem IV-Grad', 'm')
add(k, 'Wie hoch ist die IV-Rente bei einem IV-Grad von 45 %?',
    '37.5 % – 25 % plus fünfmal 2.5 Prozentpunkte', 'p')
add(k, 'Wie lange dauert die Wartezeit bis zur IV-Rente?', I['wartezeit'], 'e')
add(k, 'Wie wird der Invaliditätsgrad ermittelt?',
    'Einkommensvergleich: Valideneinkommen gegen Invalideneinkommen', 's')
add(k, 'Wie hoch ist die IV-Kinderrente?', '40 % der IV-Rente', 'm')
add(k, 'Wann muss man sich bei der IV anmelden?',
    'Früh – die Rente wird frühestens sechs Monate nach der Anmeldung ausgerichtet', 's')
add(k, 'Welche Leistungen kennt die IV neben der Rente?',
    'Frühintervention, Integrationsmassnahmen, berufliche Massnahmen, Hilfsmittel, Taggelder und Hilflosenentschädigung', 's')
add(k, 'Was ist eine Hilflosenentschädigung?',
    'Eine Leistung für Personen, die für alltägliche Lebensverrichtungen dauernd auf Dritthilfe angewiesen sind', 's')

# ================================================== EO
k = kap('vbv-eo', 'Erste Säule – EO', 'Erwerbsersatz für Dienst und Elternschaft')
E = K['eo']
add(k, 'Wofür steht EO?', 'Erwerbsersatzordnung', 'e')
add(k, 'Wen entschädigt die EO?',
    'Dienstleistende in Militär, Zivilschutz und Zivildienst sowie Eltern über Mutterschafts- und Vaterschaftsentschädigung', 'e')
add(k, 'Wie lange dauert der Mutterschaftsurlaub?',
    f"{E['mutterschaft_wochen']} Wochen, also {E['mutterschaft_tage']} Taggelder", 'e')
add(k, 'Wie hoch ist die Mutterschaftsentschädigung?',
    f"{E['prozent']} des vorherigen Erwerbseinkommens, höchstens {CHF(E['hoechst_tag'])} pro Tag", 'e')
add(k, 'Wie lange dauert der Urlaub für den anderen Elternteil?',
    f"{E['anderer_elternteil_tage']} Arbeitstage, also {E['anderer_elternteil_taggelder']} Taggelder", 'm')
add(k, 'Innert welcher Frist muss dieser Urlaub bezogen werden?',
    f"innert {E['rahmenfrist_monate']} Monaten nach der Geburt", 'm')
add(k, 'Wie hoch ist die Entschädigung für den anderen Elternteil?',
    f"{E['prozent']}, höchstens {CHF(E['hoechst_tag'])} pro Tag", 'm')
add(k, 'Wie wird die EO finanziert?',
    f"Über den EO-Beitrag von {K['ahv']['eo']}, hälftig getragen – im Umlageverfahren", 'm')
add(k, 'Welche weiteren EO-Leistungen gibt es?',
    'Betreuungsentschädigung für schwer kranke Kinder und Adoptionsentschädigung', 's')

# ================================================== ALV
k = kap('vbv-alv', 'Erste Säule – ALV', 'Arbeitslosenversicherung')
AL = K['alv']
add(k, 'Wie hoch ist der ALV-Beitrag?',
    f"{AL['beitrag']} bis zum Höchstlohn von {CHF(AL['hoechstlohn'])}, je hälftig getragen", 'e')
add(k, 'Bis zu welchem Monatslohn gilt der ALV-Beitrag?', CHF(AL['hoechstlohn_monat']), 'm')
add(k, 'Wie hoch ist das ALV-Taggeld normalerweise?',
    f"{AL['taggeld_70']} des versicherten Verdienstes", 'e')
add(k, 'Wann beträgt das ALV-Taggeld 80 %?',
    f"bei Unterhaltspflicht gegenüber Kindern, bei einem versicherten Verdienst bis {CHF(AL['grenze_80_prozent'])} oder bei einer IV-Rente ab 40 %", 's')
add(k, 'Welche Mindestbeitragszeit ist nötig?', AL['mindestbeitragszeit'], 'm')
add(k, 'Wie lange dauert die Rahmenfrist für den Leistungsbezug?', AL['rahmenfrist'], 'm')
add(k, 'Wie viele Taggelder gibt es höchstens?',
    f"{AL['taggelder']} – je nach Beitragszeit, Alter und Unterhaltspflichten", 'm')
add(k, 'Welche weiteren Leistungen kennt die ALV?',
    'Kurzarbeitsentschädigung, Schlechtwetterentschädigung, Insolvenzentschädigung und arbeitsmarktliche Massnahmen', 's')
add(k, 'Ist man während der Arbeitslosigkeit unfallversichert?',
    'Ja – die ALV versichert Bezügerinnen und Bezüger bei der Suva gegen Unfall', 's')
add(k, 'Was passiert mit der 2. Säule bei Arbeitslosigkeit?',
    'Nur die Risiken Tod und Invalidität bleiben über die Auffangeinrichtung gedeckt; das Alterssparen läuft nicht weiter', 'p')

# ================================================== BVG Grundlagen
k = kap('vbv-bvg-grund', 'Zweite Säule – Grundlagen', 'Eintritt, Grenzbeträge und koordinierter Lohn')
B = K['bvg']
add(k, 'Wofür steht BVG?',
    'Bundesgesetz über die berufliche Alters-, Hinterlassenen- und Invalidenvorsorge', 'e')
add(k, 'Wie hoch ist die BVG-Eintrittsschwelle?', f"{CHF(B['eintrittsschwelle'])} im Jahr", 'e')
add(k, 'Wie hoch ist der Koordinationsabzug?', CHF(B['koordinationsabzug']), 'e')
add(k, 'Wie hoch ist der obere Grenzbetrag?', CHF(B['oberer_grenzbetrag']), 'e')
add(k, 'Wie hoch ist der maximale koordinierte Lohn?', CHF(B['max_koordinierter_lohn']), 'm')
add(k, 'Wie hoch ist der minimale koordinierte Lohn?', CHF(B['min_koordinierter_lohn']), 'm')
add(k, 'Wie wird der koordinierte Lohn berechnet?',
    f"AHV-Jahreslohn (höchstens {CHF(B['oberer_grenzbetrag'])}) minus Koordinationsabzug von {CHF(B['koordinationsabzug'])}", 's')
add(k, 'Warum gibt es den Koordinationsabzug?',
    'Er zieht ab, was die 1. Säule bereits deckt – die 2. Säule versichert nur den darüber liegenden Teil', 's')
add(k, 'Ab wann ist man für die Risiken versichert?',
    'Ab dem 1. Januar nach dem 17. Geburtstag', 'm')
add(k, 'Ab wann beginnt das Alterssparen im BVG?',
    'Ab dem 1. Januar nach dem 24. Geburtstag', 'm')
add(k, 'Wie hoch ist der BVG-Mindestzinssatz?', B['mindestzinssatz'], 'e')
add(k, 'Wie hoch ist der gesetzliche Umwandlungssatz?',
    f"{B['umwandlungssatz']} im Referenzalter, auf dem obligatorischen Altersguthaben", 'e')
add(k, 'Was ist das Obligatorium im BVG?',
    'Der gesetzliche Mindestumfang; was die Kasse darüber hinaus versichert, ist überobligatorisch', 'm')
add(k, 'Was ist eine umhüllende Vorsorgeeinrichtung?',
    'Eine Kasse, die Obligatorium und Überobligatorium in einem Topf führt und nur die Schattenrechnung getrennt nachweist', 'p')
add(k, 'Was ist die Schattenrechnung?',
    'Die parallele Rechnung des gesetzlichen Mindestguthabens – die Leistung darf nie darunter fallen', 'p')
add(k, 'Wer trägt die BVG-Beiträge?',
    'Der Arbeitgeber mindestens die Hälfte', 'm')

# ================================================== BVG Sparen
k = kap('vbv-bvg-sparen', 'Zweite Säule – Sparen', 'Altersgutschriften, Kapital und Bezug')
add(k, 'Wie hoch sind die Altersgutschriften nach Alter?',
    '25–34: 7 % · 35–44: 10 % · 45–54: 15 % · 55–65: 18 % des koordinierten Lohnes', 's')
add(k, 'Woraus besteht das Altersguthaben?',
    'Aus den Altersgutschriften, den eingebrachten Freizügigkeitsleistungen und den Zinsen darauf', 'm')
add(k, 'Wie wird aus dem Kapital eine Rente?',
    f"Altersguthaben mal Umwandlungssatz – im Obligatorium {K['bvg']['umwandlungssatz']}", 'm')
add(k, 'Welche Bezugsformen gibt es im Alter?',
    'Rente, Kapital oder eine Mischung – das Reglement bestimmt, was möglich ist', 'm')
add(k, 'Welche Frist gilt für den Kapitalbezug?',
    'Mindestens ein Viertel des obligatorischen Guthabens kann immer als Kapital bezogen werden; für mehr gilt die Anmeldefrist des Reglements', 's')
add(k, 'Was ist ein Einkauf in die Pensionskasse?',
    'Eine freiwillige Einzahlung zur Schliessung der Beitragslücke – im Einzahlungsjahr vom steuerbaren Einkommen abziehbar', 's')
add(k, 'Welche Sperrfrist gilt nach einem Einkauf?',
    'Drei Jahre – innerhalb dieser Frist darf das Guthaben nicht als Kapital bezogen werden', 's')
add(k, 'Wofür darf Vorsorgegeld vorbezogen werden?',
    'Für selbst bewohntes Wohneigentum, für den Schritt in die Selbstständigkeit und beim endgültigen Verlassen der Schweiz', 'm')
add(k, 'Was ist eine Freizügigkeitsleistung?',
    'Das Guthaben, das beim Stellenwechsel in die neue Vorsorgeeinrichtung mitgeht', 'm')
add(k, 'Was passiert mit dem Guthaben ohne neue Stelle?',
    'Es geht auf ein Freizügigkeitskonto oder eine Freizügigkeitspolice', 'm')
add(k, 'Was ist die Auffangeinrichtung?',
    'Die gesetzliche Einrichtung für Arbeitslose, für Betriebe ohne Anschluss und für kontaktlose Guthaben', 's')
add(k, 'Was geschieht bei Scheidung mit dem Guthaben?',
    'Das während der Ehe geäufnete Guthaben wird hälftig geteilt', 's')

# ================================================== BVG Risiko
k = kap('vbv-bvg-risiko', 'Zweite Säule – Risiko', 'Invalidität und Todesfall in der Pensionskasse')
add(k, 'Welche Risiken deckt die 2. Säule neben dem Alter?',
    'Invalidität und Tod', 'e')
add(k, 'Wie hoch ist die BVG-Invalidenrente im Obligatorium?',
    'Das projizierte Altersguthaben bis zum Referenzalter, ohne Zinsen, mal Umwandlungssatz', 's')
add(k, 'Ab welchem Invaliditätsgrad zahlt das BVG?',
    'Ab 40 % – das BVG folgt dem IV-Entscheid und dem stufenlosen System', 'm')
add(k, 'Wie hoch ist die BVG-Invalidenkinderrente?',
    '20 % der Invalidenrente', 'm')
add(k, 'Wie hoch ist die BVG-Witwen- oder Witwerrente?',
    '60 % der Invaliden- oder Altersrente', 'm')
add(k, 'Wie hoch ist die BVG-Waisenrente?',
    '20 % der Invaliden- oder Altersrente', 'm')
add(k, 'Wann hat der überlebende Ehegatte Anspruch?',
    'Mit Kind, oder ab 45 Jahren und mindestens fünf Ehejahren – sonst eine einmalige Abfindung von drei Jahresrenten', 's')
add(k, 'Was ist die Prämienbefreiung im BVG?',
    'Nach der reglementarischen Wartefrist läuft das Alterssparen weiter, ohne dass Beiträge bezahlt werden', 'm')
add(k, 'Welche Wartefrist gilt üblicherweise für die BVG-Invalidenrente?',
    'Gemäss Reglement, üblich 720 oder 730 Tage – manche Kassen nennen 24 Monate', 'm')
add(k, 'Was ist eine Begünstigungserklärung?',
    'Die schriftliche Meldung, wer im Todesfall Anspruch hat – wichtig für Konkubinatspartner', 's')
add(k, 'Wer kann im Konkubinat begünstigt werden?',
    'Der Partner nach mindestens fünf Jahren Lebensgemeinschaft oder bei gemeinsamen Kindern – wenn das Reglement es vorsieht und die Meldung vorliegt', 'p')

# ================================================== 3. Säule
k = kap('vbv-saeule3', 'Dritte Säule', 'Gebundene und freie private Vorsorge')
S = K['saeule3a']
add(k, 'Wie hoch ist der maximale 3a-Beitrag mit Pensionskasse?', f"{CHF(S['mit_pk'])} im Jahr", 'e')
add(k, 'Wie hoch ist der maximale 3a-Beitrag ohne Pensionskasse?',
    f"{S['ohne_pk_prozent']} des Erwerbseinkommens, höchstens {CHF(S['ohne_pk_max'])}", 'e')
add(k, 'Wer darf in die Säule 3a einzahlen?',
    'Wer ein AHV-pflichtiges Erwerbseinkommen erzielt', 'm')
add(k, 'Wann darf 3a-Kapital bezogen werden?',
    'Frühestens fünf Jahre vor dem Referenzalter, spätestens bei dessen Erreichen – bei Weiterarbeit bis fünf Jahre danach', 'm')
add(k, 'Welche vorzeitigen Bezugsgründe gibt es in der Säule 3a?',
    'Wohneigentum zum Eigenbedarf, Aufnahme einer selbstständigen Tätigkeit, Wechsel der Selbstständigkeit, definitive Ausreise, Einkauf in die Pensionskasse und volle IV-Rente', 's')
add(k, 'Zu welchem Satz wird 3a-Kapital ausbezahlt besteuert?',
    'Getrennt vom übrigen Einkommen zu einem reduzierten Satz', 'm')
add(k, 'Warum lohnt sich gestaffelter Bezug?',
    'Mehrere Konten in verschiedenen Jahren beziehen bricht die Progression der Kapitalauszahlungssteuer', 's')
add(k, 'Was unterscheidet 3a bei der Bank von 3a bei der Versicherung?',
    'Die Bank führt ein Konto ohne Verpflichtung; die Versicherung bindet eine Prämie, deckt dafür Tod und Erwerbsunfähigkeit mit ab', 's')
add(k, 'Was ist die Prämienbefreiung in der Säule 3a?',
    'Bei Erwerbsunfähigkeit übernimmt die Versicherung die Prämie – das Sparziel bleibt bestehen', 's')
add(k, 'Was ist eine Summenversicherung?',
    'Eine Versicherung, die eine vereinbarte Summe zahlt, unabhängig vom tatsächlichen Schaden – sie wird nicht an andere Leistungen angerechnet', 's')
add(k, 'Wie ist die Begünstigung in der Säule 3a geregelt?',
    'Gesetzlich vorgegeben: zuerst der überlebende Ehegatte, dann die Nachkommen; innerhalb der Gruppen darf umgestellt werden', 's')
add(k, 'Was gehört zur Säule 3b?',
    'Alle freie Vorsorge: Sparkonten, Wertschriften, Lebensversicherungen ohne Bindung, Wohneigentum', 'm')

# ================================================== UVG
k = kap('vbv-uvg', 'Unfallversicherung UVG', 'Deckung, Leistungen und Grenzen')
U = K['uvg']
add(k, 'Wer ist obligatorisch nach UVG versichert?',
    'Alle Arbeitnehmenden in der Schweiz – Selbstständige nur freiwillig', 'e')
add(k, 'Ab welcher Arbeitszeit ist man auch gegen Nichtberufsunfälle versichert?',
    'Ab mindestens acht Stunden pro Woche beim selben Arbeitgeber', 'm')
add(k, 'Bis zu welchem Jahresverdienst versichert das UVG?', f"{CHF(U['hoechstverdienst'])}", 'e')
add(k, 'Wie hoch ist das Taggeld nach UVG und ab wann läuft es?', U['taggeld'], 'e')
add(k, 'Wer zahlt in den ersten zwei Tagen?',
    'Der Arbeitgeber – die zwei Karenztage sind Sache der Lohnfortzahlung', 'm')
add(k, 'Wie hoch ist die UVG-Invalidenrente bei Vollinvalidität?',
    f"{U['invalidenrente']} des versicherten Verdienstes", 'e')
add(k, 'Was ist eine Komplementärrente?',
    f"Die UVG-Rente wird so gekürzt, dass IV und UVG zusammen {U['komplementaerrente']} des versicherten Verdienstes nicht übersteigen", 's')
add(k, 'Wie hoch ist die UVG-Witwen- oder Witwerrente?', U['witwenrente'], 'm')
add(k, 'Wie hoch ist die UVG-Halbwaisenrente?', U['halbwaise'], 'm')
add(k, 'Wie hoch ist die UVG-Vollwaisenrente?', U['vollwaise'], 'm')
add(k, 'Wie hoch dürfen die UVG-Hinterlassenenrenten zusammen sein?',
    f"höchstens {U['hinterlassene_max']} des versicherten Verdienstes", 's')
add(k, 'Was erhält der geschiedene Ehegatte im UVG?',
    f"{U['geschiedene']}, höchstens jedoch der geschuldete Unterhaltsbeitrag", 'p')
add(k, 'Was ist eine Integritätsentschädigung?',
    f"Eine einmalige Kapitalleistung für dauernde Schädigung – erst ab {U['integritaet_ab']} Integritätseinbusse", 's')
add(k, 'Wer trägt die UVG-Prämien?',
    'Berufsunfall der Arbeitgeber, Nichtberufsunfall in der Regel der Arbeitnehmer', 'm')
add(k, 'Was ist die UVG-Abredeversicherung?',
    'Die Verlängerung des Unfallschutzes über die 31 Tage nach dem letzten Arbeitstag hinaus, für höchstens sechs Monate', 's')
add(k, 'Wie lange läuft die UVG-Nachdeckung ohne Abrede?',
    '31 Tage nach dem Ende des Lohnanspruchs', 'm')
add(k, 'Was ist ein Berufsunfall?',
    'Ein Unfall bei der Arbeit oder in der Arbeitspause auf dem Betriebsgelände – der Arbeitsweg zählt beim Nichtberufsunfall', 's')

# ================================================== KTG
k = kap('vbv-ktg', 'Krankentaggeld', 'KTG nach VVG und KVG')
add(k, 'Ist eine Krankentaggeldversicherung obligatorisch?',
    'Nein – sie ist freiwillig; viele Gesamtarbeitsverträge schreiben sie aber vor', 'e')
add(k, 'Was deckt die Krankentaggeldversicherung?',
    'Den Erwerbsausfall bei krankheitsbedingter Arbeitsunfähigkeit', 'e')
add(k, 'Wie hoch ist ein Krankentaggeld üblicherweise?',
    '80 % des Lohnes', 'e')
add(k, 'Wie lange läuft ein Krankentaggeld üblicherweise?',
    '720 oder 730 Tage innerhalb von 900 Tagen', 'm')
add(k, 'Welche Wartefristen sind üblich?',
    '30, 60 oder 90 Tage – je länger die Wartefrist, desto tiefer die Prämie', 'm')
add(k, 'Was ist der Unterschied zwischen KTG nach VVG und nach KVG?',
    'VVG: Schadenversicherung, individuell gestaltbar, mit Gesundheitsprüfung und Vorbehalten · KVG: Sozialversicherung, Aufnahme ohne Vorbehalt, aber deutlich engere Leistungen', 's')
add(k, 'Was ersetzt die Krankentaggeldversicherung beim Arbeitgeber?',
    'Die gesetzliche Lohnfortzahlungspflicht nach Berner, Basler oder Zürcher Skala', 's')
add(k, 'Was ist das Übertrittsrecht?',
    'Das Recht, beim Austritt aus dem Kollektivvertrag ohne neue Gesundheitsprüfung in eine Einzelversicherung zu wechseln – üblich innert 90 Tagen', 's')
add(k, 'Warum kürzt der Krankentaggeldversicherer bei einer IV-Rente?',
    'Als Schadenversicherung darf er zusammen mit der IV den Erwerbsausfall nicht übersteigen – das Überentschädigungsverbot', 'p')
add(k, 'Was ist die Lücke zwischen Taggeld und Rente?',
    'Setzt die IV erst nach 12 Monaten ein und läuft das Taggeld 720 Tage, deckt das Taggeld die Zeit ab – endet es aber vor dem Rentenentscheid, entsteht eine echte Lücke', 'p')

# ================================================== Rentenübersicht
k = kap('vbv-renten', 'Welche Renten gibt es?', 'Die Rentenarten aller Säulen im Überblick')
add(k, 'Welche Renten kennt die AHV?',
    'Altersrente, Kinderrente zur Altersrente, Witwen- und Witwerrente, Waisenrente', 'e')
add(k, 'Welche Renten kennt die IV?',
    'Invalidenrente und Kinderrente zur Invalidenrente – dazu Taggelder und Hilflosenentschädigung', 'e')
add(k, 'Welche Renten kennt das BVG?',
    'Altersrente, Invalidenrente, Kinderrente zur Alters- und Invalidenrente, Ehegattenrente und Waisenrente', 'm')
add(k, 'Welche Renten kennt das UVG?',
    'Invalidenrente, Komplementärrente, Witwen- und Witwerrente, Waisenrente – dazu Hilflosenentschädigung und Integritätsentschädigung', 'm')
add(k, 'Welche Rente ist keine Rente?',
    'Die Integritätsentschädigung – sie ist eine einmalige Kapitalleistung', 'p')
add(k, 'Wie hoch ist die AHV-Witwenrente?', '80 % der Altersrente', 'm')
add(k, 'Was erhalten Vollwaisen aus der AHV?',
    'Zwei Waisenrenten – zusammen aber höchstens 60 % der Altersrente', 'm')
add(k, 'Wie hoch ist die BVG-Ehegattenrente?', '60 % der Alters- oder Invalidenrente', 'm')
add(k, 'Wie hoch ist die Waisenrente in der 2. Säule?', '20 % der Alters- oder Invalidenrente', 'm')
add(k, 'Wie hoch ist die UVG-Witwenrente?', '40 % des versicherten Verdienstes', 'm')
add(k, 'Bis wann laufen Kinder- und Waisenrenten?',
    'Bis 18, bei Ausbildung bis höchstens 25', 'e')
add(k, 'Welche Renten werden der Teuerung angepasst?',
    'Die Renten der 1. Säule alle zwei Jahre nach dem Mischindex; im BVG nur die Risikorenten nach gesetzlicher Vorgabe, Altersrenten nur nach Möglichkeit der Kasse', 'p')

# ================================================== Kürzungen
k = kap('vbv-kuerzungen', 'Kürzungen und Koordination', 'Wann welche Säule kürzt')
add(k, 'Was ist Überentschädigung?',
    'Wenn die Leistungen mehrerer Versicherungen zusammen den tatsächlichen Erwerbsausfall übersteigen', 'e')
add(k, 'Warum darf überhaupt gekürzt werden?',
    'Sozialversicherungen sind Schadenversicherungen – sie sollen den Ausfall decken, nicht darüber hinaus bereichern', 's')
add(k, 'Wo liegt die Überentschädigungsgrenze im BVG?',
    '90 % des mutmasslich entgangenen Verdienstes (BVG Art. 34a, BVV 2 Art. 24)', 's')
add(k, 'Wo liegt die Grenze bei der UVG-Komplementärrente?',
    '90 % des versicherten Verdienstes für IV und UVG zusammen (UVG Art. 20 Abs. 2)', 's')
add(k, 'Welche Reihenfolge gilt bei der Koordination?',
    'Zuerst zahlt die 1. Säule, dann ergänzt das UVG, zuletzt kürzt oder ergänzt die Pensionskasse', 's')
add(k, 'Welche Leistungen werden nie gekürzt?',
    'Summenversicherungen der Säule 3 – sie sind unabhängig vom Schaden', 's')
add(k, 'Wird die Integritätsentschädigung angerechnet?',
    'Nein – sie entschädigt die dauernde Schädigung, nicht den Erwerbsausfall', 'p')
add(k, 'Wird das Einkommen des Ehegatten angerechnet?',
    'Nein – massgebend ist allein der mutmasslich entgangene Verdienst der versicherten Person', 's')
add(k, 'Was passiert mit der BVG-Rente, wenn IV und UVG die 90 % erreichen?',
    'Sie wird gekürzt, unter Umständen auf null – die Pensionskasse zahlt nur, was zur Grenze noch fehlt', 'p')
add(k, 'Warum ist der Unfall meist besser gedeckt als die Krankheit?',
    'Weil das UVG eine Invalidenrente von 80 % kennt; bei Krankheit tragen IV und BVG allein, das ergibt deutlich weniger', 'p')
add(k, 'Wann kürzt die AHV oder IV wegen Selbstverschulden?',
    'Bei Grobfahrlässigkeit gibt es im UVG Kürzungen der Taggelder bei Nichtberufsunfall; die AHV/IV kürzt bei vorsätzlicher Herbeiführung', 'p')
add(k, 'Was ist die Kürzung wegen Vorbezug?',
    'Keine Koordination, sondern eine versicherungstechnische Kürzung – die Rente wird länger ausbezahlt und deshalb tiefer angesetzt', 'p')


# ================================================== Ergänzungsleistungen
k = kap('vbv-el', 'Ergänzungsleistungen', 'Wenn Rente und Einkommen nicht reichen')
EL = K['el']
add(k, 'Was sind Ergänzungsleistungen?',
    'Bedarfsleistungen der 1. Säule – sie decken die Lücke zwischen anerkannten Ausgaben und anrechenbaren Einnahmen', 'e')
add(k, 'Wer hat Anspruch auf Ergänzungsleistungen?',
    'Wer eine Rente der AHV oder IV oder eine Hinterlassenenrente bezieht und in der Schweiz wohnt', 'e')
add(k, 'Sind Ergänzungsleistungen Sozialhilfe?',
    'Nein – es ist ein gesetzlicher Anspruch, keine Fürsorge und nicht rückzahlbar zu Lebzeiten', 's')
add(k, 'Welche Vermögensschwelle gilt für Alleinstehende?',
    f"{CHF(EL['vermoegensschwelle_alleinstehend'])} – darüber besteht kein Anspruch", 'm')
add(k, 'Welche Vermögensschwelle gilt für Ehepaare?', CHF(EL['vermoegensschwelle_ehepaar']), 'm')
add(k, 'Wie hoch ist der anerkannte Lebensbedarf für Alleinstehende?',
    f"{CHF(EL['lebensbedarf_alleinstehend'])} im Jahr", 'm')
add(k, 'Wie hoch ist der anerkannte Lebensbedarf für Ehepaare?',
    f"{CHF(EL['lebensbedarf_ehepaar'])} im Jahr", 'm')
add(k, 'Wie hoch ist das Mietzinsmaximum in Region 1 für Alleinstehende?',
    f"{CHF(EL['mietzinsmaximum_region1_allein'])} im Jahr, dazu eine Nebenkostenpauschale von {CHF(EL['nebenkosten_pauschale'])}", 'p')
add(k, 'Wie wird die Ergänzungsleistung berechnet?',
    'Anerkannte Ausgaben minus anrechenbare Einnahmen – die Differenz wird ausbezahlt', 's')
add(k, 'Warum sind Ergänzungsleistungen für die Beratung wichtig?',
    'Sie zeigen, wo die Existenzsicherung endet – wer darüber hinaus etwas will, braucht 2. und 3. Säule', 's')

# ================================================== Hinterlassene
k = kap('vbv-hinterlassene', 'Hinterlassenenleistungen', 'Witwen-, Witwer- und Waisenrenten in allen Säulen')
add(k, 'Wann erhält eine Witwe eine AHV-Witwenrente?',
    'Mit einem oder mehreren Kindern bei der Verwitwung – oder ohne Kinder ab 45 Jahren und mindestens fünf Ehejahren', 's')
add(k, 'Wann erhält ein Witwer eine AHV-Witwerrente?',
    'Grundsätzlich nur, wenn er bei der Verwitwung Kinder hat', 's')
add(k, 'Wie hoch ist die AHV-Witwen- und Witwerrente?',
    f"{K['ahv']['witwenrente_prozent']} der Altersrente, also {CHF(K['ahv']['witwenrente_min'])} bis {CHF(K['ahv']['witwenrente_max'])}", 'm')
add(k, 'Wie hoch ist die AHV-Waisenrente?',
    f"{K['ahv']['waisenrente_prozent']} der Altersrente – Vollwaisen erhalten zwei Renten, zusammen höchstens {CHF(K['ahv']['plafond_waise_kind'])}", 'm')
add(k, 'Wann erlischt der Anspruch auf eine Witwenrente?',
    'Bei Wiederverheiratung oder beim Tod – mit dem eigenen Rentenalter geht sie in die Altersrente über, ausbezahlt wird die höhere', 's')
add(k, 'Wie hoch ist die Ehegattenrente in der 2. Säule?',
    f"{K['bvg']['witwenrente_prozent']} der Alters- oder Invalidenrente", 'm')
add(k, 'Welche Voraussetzungen gelten für die BVG-Ehegattenrente?',
    f"Ein Kind zu versorgen, oder mindestens {K['bvg']['ehegatte_ab_alter']} Jahre alt und {K['bvg']['ehejahre']} Ehejahre – sonst eine Abfindung von {K['bvg']['abfindung_jahresrenten']} Jahresrenten", 's')
add(k, 'Wie hoch ist die Waisenrente der Pensionskasse?',
    f"{K['bvg']['waisenrente_prozent']} der Alters- oder Invalidenrente", 'm')
add(k, 'Wie hoch sind die UVG-Hinterlassenenrenten?',
    f"Witwe oder Witwer {K['uvg']['witwenrente']}, Halbwaisen {K['uvg']['halbwaise']}, Vollwaisen {K['uvg']['vollwaise']} – zusammen höchstens {K['uvg']['hinterlassene_max']}", 's')
add(k, 'Was erhält der Konkubinatspartner aus der AHV?',
    'Nichts – die AHV kennt keine Leistung für Konkubinatspartner', 's')
add(k, 'Was erhält der Konkubinatspartner aus der 2. Säule?',
    f"Nur wenn das Reglement es vorsieht und eine Begünstigungserklärung vorliegt – üblich nach {K['bvg']['konkubinat_jahre']} Jahren Lebensgemeinschaft oder bei gemeinsamen Kindern", 'p')
add(k, 'Wie ist die eingetragene Partnerschaft gestellt?',
    'Wie die Ehe – der überlebende Partner gilt als Witwer', 'm')
add(k, 'Welche Lücke entsteht im Konkubinat?',
    'Keine Witwenrente aus der AHV, meist keine aus der Pensionskasse, kein gesetzliches Erbrecht – die Absicherung muss über Säule 3 und ein Testament laufen', 'p')
add(k, 'Bis wann laufen Waisenrenten?', 'Bis 18, bei Ausbildung längstens bis 25', 'e')
add(k, 'Was ist der Unterschied zwischen Kinderrente und Waisenrente?',
    'Die Kinderrente läuft zur Alters- oder Invalidenrente einer lebenden Person, die Waisenrente nach deren Tod', 's')

# ================================================== Produkte
k = kap('vbv-produkte', 'Produkte der Lebensversicherung', 'Risiko, Kapital, Rente und Fonds')
add(k, 'Was ist eine reine Risikoversicherung?',
    'Sie zahlt nur im Todesfall innerhalb der Laufzeit; wird das Ende erlebt, gibt es keine Leistung und keinen Rückkaufswert', 'e')
add(k, 'Was ist eine Erlebensfallversicherung?',
    'Sie zahlt die vereinbarte Summe, wenn der Versicherte den Ablauf erlebt – reines Sparen', 'm')
add(k, 'Was ist eine gemischte Versicherung?',
    'Todesfall und Erlebensfall in einem Vertrag – sie zahlt in jedem Fall, entweder bei Ablauf oder vorher beim Tod', 'e')
add(k, 'Aus welchen zwei Teilen besteht eine gemischte Lebensversicherung?',
    'Aus einem Risikoteil, der den Todesfall deckt, und einem Sparteil, der das Erlebensfallkapital aufbaut', 'e')
add(k, 'Wofür wird die Prämie einer gemischten Lebensversicherung verwendet?',
    'Für die Risikoprämie, die Sparprämie und den Kostenanteil', 'e')
add(k, 'Was geschieht mit der Sparprämie?',
    'Sie wird zum technischen Zins angelegt und bildet mit den Überschüssen das Erlebensfallkapital', 'm')
add(k, 'Was deckt der Risikoteil einer gemischten Versicherung ab?',
    'Die Differenz zwischen der versicherten Todesfallsumme und dem bereits angesparten Kapital – die Risikosumme', 's')
add(k, 'Wie verschiebt sich das Verhältnis der beiden Teile über die Laufzeit?',
    'Das Sparkapital wächst, damit sinkt die zu deckende Risikosumme – der Sparteil gewinnt an Gewicht', 'p')
add(k, 'Was leistet die gemischte Versicherung beim Tod vor Ablauf?',
    'Die vereinbarte Todesfallsumme, unabhängig davon, wie viel bereits angespart ist', 'm')
add(k, 'Was leistet sie am Ende der Laufzeit?',
    'Das garantierte Erlebensfallkapital und die bis dahin zugeteilten Überschüsse', 'm')
add(k, 'Warum ist die gemischte Versicherung teurer als eine reine Risikoversicherung?',
    'Weil die Prämie beides enthält: den Risikoschutz und das Sparen', 's')
add(k, 'Warum liegt der Rückkaufswert am Anfang unter den einbezahlten Prämien?',
    'Weil Abschlusskosten, Verwaltungskosten und Risikoprämien schon verbraucht sind und nur der Rest angespart wurde', 'p')
add(k, 'Was spricht dafür, Sparen und Versichern zu trennen?',
    'Der reine Risikoschutz ist günstiger und das Sparen bleibt frei anlegbar; dafür fehlen Prämienbefreiung und Verbindlichkeit', 'p')
add(k, 'Was ist eine fondsgebundene Lebensversicherung?',
    'Der Sparteil wird in Anlagefonds investiert; die Chance auf mehr Rendite trägt die versicherte Person, ebenso das Anlagerisiko', 'm')
add(k, 'Was ist eine Leibrentenversicherung?',
    'Sie zahlt lebenslang eine Rente – die Versicherung trägt das Langleberisiko', 'm')
add(k, 'Was unterscheidet die aufgeschobene von der sofort beginnenden Rente?',
    'Bei der aufgeschobenen wird zuerst angespart, dann fliesst die Rente; die sofort beginnende startet direkt nach der Einmalprämie', 's')
add(k, 'Was ist eine Rückgewähr bei der Leibrente?',
    'Beim frühen Tod erhalten die Hinterbliebenen das noch nicht verrentete Kapital zurück – ohne Rückgewähr verfällt es', 's')
add(k, 'Was ist ein Rückkaufswert?',
    'Der Betrag, den die Versicherung bei vorzeitiger Auflösung auszahlt – er entsteht nur bei Verträgen mit Sparteil', 'm')
add(k, 'Warum hat eine Risikoversicherung keinen Rückkaufswert?',
    'Weil die ganze Prämie für das Risiko und die Kosten verbraucht wird – es wird nichts angespart', 's')
add(k, 'Was ist die prämienfreie Umwandlung?',
    'Statt den Vertrag zurückzukaufen, wird er auf eine tiefere Summe ohne weitere Prämien gestellt – der Schutz bleibt reduziert bestehen', 's')
add(k, 'Was ist die Überschussbeteiligung?',
    'Der Anteil der versicherten Person am Zins-, Risiko- und Kostengewinn der Versicherung – garantiert ist sie nicht', 's')
add(k, 'Was ist der technische Zins?',
    'Der Zinssatz, mit dem die Versicherung die garantierten Leistungen kalkuliert – je tiefer er ist, desto höher die Prämie', 'p')
add(k, 'Welches Produkt passt zur Absicherung junger Familien?',
    'Eine reine Risikoversicherung – viel Schutz für wenig Prämie; gespart wird getrennt davon', 's')
add(k, 'Was ist eine Prämienbefreiung als Zusatzdeckung?',
    'Bei Erwerbsunfähigkeit übernimmt die Versicherung die Prämie weiter – der Vertrag läuft, als würde einbezahlt', 'm')
add(k, 'Was ist eine Erwerbsunfähigkeitsrente als Zusatzdeckung?',
    'Eine vereinbarte Rente bei Erwerbsunfähigkeit, nach einer gewählten Wartefrist bis zum Endalter', 'm')
add(k, 'Warum ist die Wartefrist der wichtigste Hebel bei der EU-Rente?',
    'Sie muss zur bestehenden Deckung passen: Wo Krankentaggeld bis Tag 730 läuft, kauft eine kürzere Wartefrist dieselbe Deckung zweimal', 'p')

# ========================================= Qualifizierte Lebensversicherung
k = kap('vbv-qualifiziert', 'Qualifizierte Lebensversicherung',
        'Verhaltensregeln beim Verkauf von Policen mit Anlagerisiko')
VG = K['vag']
add(k, 'Was ist eine qualifizierte Lebensversicherung?',
    'Eine Lebensversicherung, bei der die versicherte Person im Sparprozess ein Verlustrisiko trägt – '
    'dazu Kapitalisations- und Tontinengeschäfte', 'e')
add(k, 'Wo steht der Begriff der qualifizierten Lebensversicherung?',
    VG['begriff'].split(':')[0] + ' – dort wird sie über das Verlustrisiko im Sparprozess definiert', 'm')
add(k, 'Was unterscheidet die klassische von der qualifizierten Lebensversicherung?',
    'Bei der klassischen garantiert die Versicherung die Leistung und trägt das Anlagerisiko; '
    'bei der qualifizierten trägt es die Kundschaft im Sparprozess', 'e')
add(k, 'Welche Produkte gelten typischerweise als qualifiziert?',
    'Fonds- und anteilgebundene Policen ohne Kapitalgarantie sowie Kapitalisations- und Tontinengeschäfte', 'm')
add(k, 'Welche Produkte gelten nicht als qualifiziert?',
    'Klassische Policen mit garantiertem Kapital und Überschussbeteiligung sowie reine Risikoversicherungen ohne Sparteil', 'm')
add(k, 'Seit wann gelten die Regeln zur qualifizierten Lebensversicherung?',
    f"Mit dem revidierten VAG seit dem 1. Januar {VG['revision_inkraft']}", 'm')
add(k, 'Warum gibt es für diese Produkte eigene Verhaltensregeln?',
    'Weil die Kundschaft hier wie eine Anlegerin Risiko trägt – das VAG zieht damit mit dem FIDLEG im Anlagegeschäft gleich', 's')
add(k, 'Was ist die Angemessenheitsprüfung?',
    'Vor der Empfehlung werden Kenntnisse und Erfahrungen der Kundschaft mit solchen Produkten erhoben und '
    'daran gemessen, ob sie die Risiken versteht', 'e')
add(k, 'Womit muss sich die Kundschaft qualifizieren?',
    'Nicht mit Vermögen, sondern mit Kenntnissen und Erfahrung – zusätzlich müssen Tragbarkeit, Risiko und '
    'Laufzeit zur Lebenssituation und zu den Anlagezielen passen', 's')
add(k, 'Welcher Artikel regelt die Angemessenheitsprüfung?',
    VG['angemessenheitspruefung'], 'p')
add(k, 'Was ist zu tun, wenn das Produkt nicht angemessen ist?',
    'Vom Abschluss abraten – und diese Abratung dokumentieren', 's')
add(k, 'Wann entfällt die Angemessenheitsprüfung?',
    'Wenn die Kundschaft von sich aus ohne persönliche Beratung abschliesst; darauf ist sie ausdrücklich hinzuweisen', 'p')
add(k, 'Was unterscheidet Angemessenheits- und Eignungsprüfung?',
    'Die Angemessenheit fragt nur nach Kenntnissen und Erfahrung, die Eignung zusätzlich nach den '
    'finanziellen Verhältnissen und den Anlagezielen im Gesamtbild', 's')
add(k, 'Welche Unterlage ist vor dem Abschluss abzugeben?',
    'Das Basisinformationsblatt – kostenlos und so rechtzeitig, dass es noch gelesen werden kann', 'e')
add(k, 'Was ist beim Abschluss zu dokumentieren?',
    'Welche Police abgeschlossen wurde, welche Kenntnisse erhoben wurden, das Ergebnis der Prüfung und eine '
    'allfällige Abratung', 'm')
add(k, 'Innert welcher Frist ist die Dokumentation herauszugeben?',
    f"Auf Verlangen innert {VG['herausgabefrist_arbeitstage']} Arbeitstagen", 'p')
add(k, 'Was gilt für Entschädigungen von Dritten?',
    'Sie sind vor dem Abschluss offenzulegen – Art und Umfang müssen bekannt sein', 's')
add(k, 'Welche Rolle spielt die Ausbildung des Vermittlers dabei?',
    'Wer solche Policen vermittelt, braucht auch Wissen über Anlagen – Fachkenntnis ist Voraussetzung für die Registrierung', 'p')

# ================================================== Basisinformationsblatt
k = kap('vbv-bib', 'Das Basisinformationsblatt',
        'Was der Kundschaft vor dem Abschluss gezeigt werden muss')
add(k, 'Wofür steht die Abkürzung BIB?', 'Basisinformationsblatt', 'e')
add(k, 'Für welche Produkte braucht es ein Basisinformationsblatt?',
    'Für jede qualifizierte Lebensversicherung – also für Policen mit Verlustrisiko im Sparprozess', 'e')
add(k, 'Wann muss das Basisinformationsblatt abgegeben werden?',
    'Vor dem Vertragsschluss, kostenlos und rechtzeitig genug, um es in Ruhe zu lesen', 'm')
add(k, 'Welche fünf Angaben muss das Basisinformationsblatt enthalten?',
    'Name der Versicherung und Identität des Unternehmens, Art und Merkmale, Risiko- und Renditeprofil '
    'mit dem höchstmöglichen Verlust, die Kosten sowie Bewilligungen und Genehmigungen', 'm')
add(k, 'Was steht im Basisinformationsblatt zu den Anlagen?',
    'Worin der Sparteil angelegt wird – etwa Aktien oder Obligationen – und in welchen Währungen; '
    'daraus ergeben sich Kurs- und Währungsrisiko', 'm')
add(k, 'Warum gehören die Kosten unbedingt ins Basisinformationsblatt?',
    'Weil sie die Rendite unmittelbar schmälern – erst der Kostenausweis macht zwei Produkte vergleichbar', 's')
add(k, 'Was muss zum Verlust ausgewiesen werden?',
    'Der höchstmögliche Verlust – die Kundschaft soll sehen, was im schlechtesten Fall bleibt', 'm')
add(k, 'Was muss die Beispielrechnung zeigen?',
    f"Mindestens {VG['renditeszenarien']} Renditeszenarien – günstig, mittel und ungünstig – mit ihrer "
    'Wirkung auf Auszahlung und Rückkaufswert', 'm')
add(k, 'Wie muss das Basisinformationsblatt geschrieben sein?',
    'Leicht verständlich und in klarer Sprache – es soll auch ohne Vorwissen lesbar sein', 'e')
add(k, 'Wie lang darf ein Basisinformationsblatt sein?',
    'Kurz: im Anlagegeschäft schreibt die Finanzdienstleistungsverordnung höchstens drei Seiten vor, '
    'im Versicherungsrecht steht die Verständlichkeit im Vordergrund', 'p')
add(k, 'Warum muss sich das Basisinformationsblatt von Werbung abheben?',
    'Weil es eine Entscheidungsgrundlage ist und keine Verkaufshilfe – es ist ein eigenständiges Dokument', 's')
add(k, 'Wozu dient das Basisinformationsblatt überhaupt?',
    'Es macht Produkte vergleichbar: dieselben Angaben in derselben Ordnung, auch über Anbieter hinweg', 's')
add(k, 'Wer bleibt für das Basisinformationsblatt verantwortlich?',
    'Die Versicherung – auch wenn sie das Erstellen an qualifizierte Dritte auslagert', 's')
add(k, 'Was gilt für gleichwertige ausländische Dokumente?',
    'Sie werden anerkannt, wenn sie dieselben Angaben in gleicher Qualität liefern', 'p')
add(k, 'Was ist bei Änderungen am Produkt zu tun?',
    'Das Basisinformationsblatt regelmässig überprüfen und bei wesentlichen Änderungen anpassen', 's')
add(k, 'Welcher Fehler passiert im Verkaufsgespräch am häufigsten?',
    'Das Blatt wird erst mit der Police mitgeschickt – dann kam es zu spät, um die Entscheidung zu tragen', 'p')

# ============================================ Begünstigung in der Säule 3a
k = kap('vbv-beguenstigung-3a', 'Begünstigung in der Säule 3a',
        'Die Reihenfolge nach BVV 3 und was sich daran ändern lässt')
B3 = K['bvv3']
add(k, 'Welche Verordnung regelt die Begünstigung in der Säule 3a?',
    B3['grundlage'], 'e')
add(k, 'Wer ist im Erlebensfall begünstigt?',
    'Der Vorsorgenehmer selbst – die Leistung geht an ihn', 'e')
add(k, 'Wer steht im Todesfall an erster Stelle?',
    'Der überlebende Ehegatte oder die überlebende eingetragene Partnerin beziehungsweise der Partner', 'e')
add(k, 'Wer steht an zweiter Stelle?',
    'Die direkten Nachkommen, die in erheblichem Masse unterstützten Personen und die Person aus der '
    'Lebensgemeinschaft', 'm')
add(k, 'Welche Bedingungen gelten für die Lebensgemeinschaft?',
    f"Bis zum Tod {B3['lebensgemeinschaft_jahre']} Jahre ununterbrochen zusammengelebt – oder für den "
    'Unterhalt gemeinsamer Kinder aufkommen', 'm')
add(k, 'Wer steht an dritter, vierter und fünfter Stelle?',
    'Die Eltern, dann die Geschwister, dann die übrigen Erben', 'e')
add(k, 'Nenne die Reihenfolge im Todesfall vollständig.',
    '1. Ehegatte oder eingetragener Partner, 2. Nachkommen, unterstützte Personen und Lebensgemeinschaft, '
    '3. Eltern, 4. Geschwister, 5. übrige Erben', 'm')
add(k, 'Was gilt, wenn in einem Rang niemand vorhanden ist?',
    'Erst dann rückt der nächste Rang nach – solange ein Rang besetzt ist, kommen die folgenden nicht zum Zug', 's')
add(k, 'Wie viel Spielraum besteht beim ersten Rang?',
    'Keiner – der überlebende Ehegatte oder eingetragene Partner lässt sich weder streichen noch überspringen', 's')
add(k, 'Was lässt sich beim zweiten Rang bestimmen?',
    'Einzelne Begünstigte lassen sich bezeichnen und ihre Ansprüche näher bestimmen – der Betrag darf also '
    'aufgeteilt werden', 's')
add(k, 'Was lässt sich bei den Rängen drei bis fünf ändern?',
    'Dort darf die Reihenfolge selbst geändert und die Ansprüche näher bestimmt werden', 'p')
add(k, 'Fasse den Spielraum über alle Ränge zusammen.',
    'Rang 1 unveränderlich, Rang 2 aufteilbar und näher bestimmbar, Ränge 3 bis 5 auch in der Reihenfolge änderbar', 'p')
add(k, 'In welcher Form wird die Begünstigung geändert?',
    'Schriftlich gegenüber der Vorsorgestiftung oder der Versicherung – ein Testament allein genügt nicht', 'p')
add(k, 'Warum muss eine Lebenspartnerin gemeldet werden?',
    'Weil die Stiftung sie sonst nicht kennt – ohne Meldung geht sie leer aus, obwohl das Gesetz sie zulässt', 's')
add(k, 'Fällt das Guthaben der Säule 3a in den Nachlass?',
    'Nein – die begünstigten Personen haben einen eigenen Anspruch; das Guthaben zählt aber zur '
    'Pflichtteilsberechnungsmasse', 'p')
add(k, 'Wie unterscheidet sich die Begünstigung in der Säule 3b?',
    'Dort ist sie frei – jede Person kann begünstigt werden, die Pflichtteile bleiben vorbehalten', 's')
add(k, 'Was ist im Konkubinat der häufigste Irrtum?',
    'Zu glauben, der Partner sei automatisch begünstigt – ohne Meldung erhält er aus der Säule 3a nichts', 's')

# ================================================== Säule 3a vertieft
k = kap('vbv-3a-praxis', 'Säule 3a in der Praxis', 'Anbieter, Bezug und Gestaltung')
S3 = K['saeule3a']
add(k, 'Welche zwei Anbieterarten gibt es in der Säule 3a?',
    'Banken mit einer Vorsorgestiftung und Versicherungen mit einer Vorsorgepolice', 'e')
add(k, 'Was spricht für die Banklösung?',
    'Volle Flexibilität – Einzahlung frei wählbar, keine Verpflichtung, keine Abschlusskosten', 'm')
add(k, 'Was spricht für die Versicherungslösung?',
    'Sie deckt Tod und Erwerbsunfähigkeit mit ab und führt das Sparziel dank Prämienbefreiung auch dann zu Ende', 'm')
add(k, 'Was ist der Nachteil der Versicherungslösung?',
    'Die Prämie ist verbindlich, und ein vorzeitiger Rückkauf ist meist mit Verlust verbunden', 's')
add(k, 'Was ist eine Wertschriftenlösung in der Säule 3a?',
    'Das Guthaben wird in Fonds angelegt statt verzinst – mehr Renditechance, dafür Schwankungen', 'm')
add(k, 'Warum lohnen sich mehrere 3a-Konten?',
    'Weil sie in verschiedenen Jahren gestaffelt bezogen werden können und so die Progression der Kapitalauszahlungssteuer brechen', 's')
add(k, 'Wie viele 3a-Konten sind sinnvoll?',
    'So viele, wie sich in getrennten Jahren beziehen lassen – meist drei bis fünf, je nach Kapital und Kanton', 'p')
add(k, 'Darf ein 3a-Konto teilweise bezogen werden?',
    'Nein – ein Konto wird immer vollständig aufgelöst; deshalb die Staffelung über mehrere Konten', 's')
add(k, 'Wann muss die Säule 3a spätestens bezogen werden?',
    'Beim Erreichen des Referenzalters – bei nachgewiesener Weiterarbeit längstens fünf Jahre danach', 'm')
add(k, 'Darf man nach dem Referenzalter noch einzahlen?',
    'Ja, solange ein AHV-pflichtiges Erwerbseinkommen erzielt wird und der Bezug aufgeschoben ist', 's')
NZ = S3['nachzahlung']
add(k, 'Können fehlende 3a-Beiträge nachgezahlt werden?',
    f"Ja, seit dem 1. Januar {NZ['erste_luecke']} – erstmals im Steuerjahr {NZ['erstes_einkaufsjahr']} "
    f"rückwirkend für {NZ['erste_luecke']}, danach bis {NZ['rueckwirkend_jahre']} Jahre zurück", 'p')
add(k, 'Welche Bedingungen gelten für einen 3a-Einkauf?',
    NZ['bedingungen'], 'p')
add(k, 'Wie viel darf pro Jahr zusätzlich eingekauft werden?',
    f"Höchstens der kleine Beitrag, also {CHF(NZ['max_pro_jahr'])} – zusätzlich zum vollen ordentlichen Jahresbeitrag", 'p')
add(k, 'Können Lücken aus der Zeit vor der Neuerung nachgezahlt werden?',
    f"Nein – nur Beitragsjahre ab {NZ['erste_luecke']} zählen; ältere Lücken bleiben für immer offen", 's')
add(k, 'Wie hoch ist der 3a-Abzug für Selbstständige ohne Pensionskasse?',
    f"{S3['ohne_pk_prozent']} des Erwerbseinkommens, höchstens {CHF(S3['ohne_pk_max'])}", 'e')

# ================================================== Säule 3b vertieft
k = kap('vbv-3b-praxis', 'Säule 3b in der Praxis', 'Freie Vorsorge und ihre Gestaltung')
add(k, 'Was gehört alles zur Säule 3b?',
    'Sparkonten, Wertschriften, freie Lebensversicherungen, Wohneigentum – jede Ersparnis ohne gesetzliche Bindung', 'e')
add(k, 'Was ist der Hauptvorteil der Säule 3b?',
    'Volle Verfügbarkeit und freie Begünstigung – kein Sperrfrist, keine Vorschriften zur Auszahlung', 'm')
add(k, 'Was ist der Hauptnachteil der Säule 3b?',
    'Kein Steuerabzug auf den Einzahlungen', 'm')
add(k, 'Wie wird eine 3b-Lebensversicherung während der Laufzeit besteuert?',
    'Der Rückkaufswert zählt zum steuerbaren Vermögen', 's')
add(k, 'Wann ist die Kapitalleistung einer rückkaufsfähigen Kapitalversicherung steuerfrei?',
    K['steuern']['kapitalversicherung_steuerfrei'], 'p')
add(k, 'Für wen ist die Säule 3b besonders interessant?',
    'Für alle, die über den 3a-Maximalbetrag hinaus sparen, und für Personen ohne AHV-pflichtiges Erwerbseinkommen', 's')
add(k, 'Was ist der Vorteil der freien Begünstigung in der Säule 3b?',
    'Der Konkubinatspartner kann direkt begünstigt werden – die Leistung fällt nicht in den Nachlass, die Pflichtteile bleiben aber zu beachten', 'p')
add(k, 'Warum ist eine 3b-Police auch im Konkurs interessant?',
    'Eine Police mit begünstigtem Ehegatten oder Nachkommen ist der Zwangsvollstreckung teilweise entzogen', 'p')
add(k, 'Was ist der Unterschied zwischen 3a und 3b bei der Verfügbarkeit?',
    '3a ist bis fünf Jahre vor dem Referenzalter gesperrt, 3b jederzeit verfügbar', 'e')

# ================================================== Steuern
k = kap('vbv-steuern', 'Steuern in der Vorsorge', 'Einzahlen, halten, beziehen')
ST = K['steuern']
add(k, 'Wie werden 3a-Einzahlungen besteuert?',
    'Sie sind vom steuerbaren Einkommen abziehbar', 'e')
add(k, 'Wie wird 3a-Guthaben während der Laufzeit besteuert?',
    'Gar nicht – weder Einkommens- noch Vermögenssteuer', 'm')
add(k, 'Wie wird 3a-Kapital bei der Auszahlung besteuert?',
    'Getrennt vom übrigen Einkommen zu einem reduzierten Satz – kantonal unterschiedlich', 'm')
add(k, 'Wie werden Einkäufe in die Pensionskasse besteuert?',
    'Sie sind im Einzahlungsjahr voll vom Einkommen abziehbar', 'm')
add(k, 'Wie werden Renten aus AHV und Pensionskasse besteuert?',
    'Zu 100 % als Einkommen', 'm')
add(k, 'Wie wird eine Leibrente aus der Säule 3b besteuert?',
    f"Bis 2024 pauschal {ST['leibrente_bis_2024']}. Seit 2025 gilt: {ST['leibrente_ab_2025']}", 'p')
add(k, 'Welche Sperrfrist gilt nach einem Pensionskassen-Einkauf?',
    f"{K['bvg']['einkauf_sperrfrist_jahre']} Jahre bis zu einem Kapitalbezug – sonst wird der Abzug nachträglich aufgerechnet", 's')
add(k, 'Warum lohnt sich Einkaufen in Etappen?',
    'Mehrere Einkäufe in verschiedenen Jahren wirken stärker als ein grosser, weil sie die Progression jedes Jahr neu brechen', 's')
add(k, 'Was ist bei Kapitalbezug und Einkauf im selben Zeitraum zu beachten?',
    'Einkauf und Kapitalbezug innerhalb der Sperrfrist gelten als Steuerumgehung – der Abzug wird verweigert', 'p')
add(k, 'Wie werden Todesfallleistungen aus der Säule 3a besteuert?',
    'Als Kapitalleistung aus Vorsorge beim Empfänger, getrennt und zum reduzierten Satz', 's')
add(k, 'Sind Leistungen aus einer reinen Risikoversicherung der Säule 3b steuerbar?',
    'Die Todesfallsumme unterliegt je nach Kanton der Erbschaftssteuer – Ehegatten und meist Nachkommen sind befreit', 'p')

# ================================================== Begünstigung und Erbrecht
k = kap('vbv-beguenstigung', 'Begünstigung und Erbrecht', 'Wer bekommt was im Todesfall')
ER = K['erbrecht']
add(k, 'Was ist eine Begünstigungsklausel?',
    'Die Bestimmung, wer die Todesfallleistung erhält – sie geht dem Erbrecht vor, weil die Leistung nicht in den Nachlass fällt', 'e')
add(k, 'Wo ist die Begünstigung in der Säule 3a geregelt?',
    'In der BVV 3 – sie gibt die Reihenfolge zwingend vor, anders als in der frei gestaltbaren Säule 3b', 's')
add(k, 'Wie ist die Begünstigung in der Säule 3b geordnet?',
    'Frei – jede Person kann begünstigt werden, die Pflichtteile bleiben aber vorbehalten', 'm')
add(k, 'Seit wann gilt das revidierte Erbrecht?', ER['gilt_seit'], 'm')
add(k, 'Wie hoch ist der Pflichtteil der Nachkommen?', ER['pflichtteil_nachkommen'], 's')
add(k, 'Wie hoch ist der Pflichtteil des Ehegatten?', ER['pflichtteil_ehegatte'], 's')
add(k, 'Was hat sich beim Pflichtteil der Eltern geändert?',
    'Er ist aufgehoben – Eltern haben seit 2023 keinen Pflichtteil mehr', 's')
add(k, 'Wie gross ist die frei verfügbare Quote bei Nachkommen?',
    ER['freie_quote_mit_kindern'], 'p')
add(k, 'Welche Erbrechte hat ein Konkubinatspartner?',
    'Keine – ohne Testament oder Erbvertrag erbt er nichts', 's')
add(k, 'Welche drei Schritte schützen einen Konkubinatspartner ohne Kosten?',
    'Begünstigungserklärung bei der Pensionskasse einreichen, Begünstigung in der Säule 3a melden, Testament errichten', 's')
add(k, 'Was ist ein Vorsorgeauftrag?',
    'Die Bestimmung, wer bei eigener Urteilsunfähigkeit die persönlichen und finanziellen Angelegenheiten übernimmt', 'm')
add(k, 'Was ist eine Patientenverfügung?',
    'Die Festlegung, welchen medizinischen Massnahmen man bei Urteilsunfähigkeit zustimmt', 'm')

# ================================================== WEF
k = kap('vbv-wef', 'Wohneigentumsförderung', 'Vorbezug und Verpfändung')
W = K['wef']
add(k, 'Welche zwei Wege der Wohneigentumsförderung gibt es?',
    'Vorbezug und Verpfändung des Vorsorgeguthabens', 'e')
add(k, 'Wie hoch ist der Mindestbetrag für einen Vorbezug?', CHF(W['mindestbetrag']), 'm')
add(k, 'Wie oft darf vorbezogen werden?', f"alle {W['abstand_jahre']} Jahre", 'm')
add(k, 'Was gilt ab Alter 50?', W['ab_alter_50'], 'p')
add(k, 'Wofür darf Vorsorgegeld eingesetzt werden?',
    'Für Kauf oder Bau, für die Rückzahlung von Hypotheken oder für Anteilscheine – nur beim selbst bewohnten Wohneigentum', 'm')
add(k, 'Welche Zustimmung ist nötig?', W['zustimmung'], 'm')
add(k, 'Was ist der Unterschied zwischen Vorbezug und Verpfändung?',
    'Der Vorbezug nimmt Geld aus der Vorsorge und kürzt die Leistungen; die Verpfändung lässt das Guthaben stehen und dient nur als Sicherheit', 's')
add(k, 'Welche Steuerfolge hat ein Vorbezug?',
    'Er wird wie eine Kapitalleistung aus Vorsorge besteuert – bei Rückzahlung wird die Steuer zinslos zurückerstattet', 's')
add(k, 'Wann muss ein Vorbezug zurückbezahlt werden?',
    'Beim Verkauf der Liegenschaft – freiwillig ist die Rückzahlung jederzeit bis drei Jahre vor dem Referenzalter möglich', 's')
add(k, 'Welche Lücke reisst ein Vorbezug?',
    'Er kürzt Alters- und oft auch Risikoleistungen – diese Lücke gehört in der Beratung berechnet und abgesichert', 'p')

# ================================================== Versicherungsvertrag
k = kap('vbv-vvg', 'Der Versicherungsvertrag', 'VVG: Abschluss, Pflichten und Fristen')
V = K['vvg']
add(k, 'Wofür steht VVG?', 'Versicherungsvertragsgesetz', 'e')
add(k, 'Wie kommt ein Versicherungsvertrag zustande?',
    'Durch Antrag und Annahme – die Police ist nur die Beurkundung, nicht der Vertragsschluss', 'm')
add(k, 'Wie lange gilt das Widerrufsrecht?',
    f"{V['widerruf_tage']} Tage seit dem Antrag oder der Annahme – ausgenommen sind Kollektivverträge der Personenversicherung", 'm')
add(k, 'Wann kann ein längerfristiger Vertrag ordentlich gekündigt werden?',
    f"{V['ordentliche_kuendigung']}", 's')
add(k, 'Wie lange dauert die Verjährung von Ansprüchen?',
    f"{V['verjaehrung_jahre']} Jahre – beim kollektiven Krankentaggeld {V['verjaehrung_ktg_kollektiv_jahre']} Jahre", 's')
add(k, 'Seit wann gilt das revidierte VVG?', V['revision'], 'm')
add(k, 'Was ist die Anzeigepflicht?',
    'Die Pflicht, alle für die Risikobeurteilung erheblichen Gefahrstatsachen wahrheitsgetreu zu melden – gefragt wird schriftlich', 's')
add(k, 'Was passiert bei einer Anzeigepflichtverletzung?',
    'Die Versicherung kann den Vertrag innert vier Wochen ab Kenntnis kündigen; die Leistungspflicht entfällt, soweit ein Zusammenhang besteht', 'p')
add(k, 'Was geschieht bei Prämienverzug?',
    'Mahnung mit 14 Tagen Frist; danach ruht die Leistungspflicht, und nach zwei Monaten gilt der Vertrag als aufgehoben, wenn die Prämie nicht eingefordert wird', 'p')
add(k, 'Was ist ein Vorbehalt?',
    'Der schriftliche Ausschluss einer bestimmten bestehenden Gesundheitsbeeinträchtigung von der Deckung', 's')
add(k, 'Was ist der Unterschied zwischen Schaden- und Summenversicherung?',
    'Die Schadenversicherung ersetzt den tatsächlichen Schaden und wird koordiniert; die Summenversicherung zahlt die vereinbarte Summe unabhängig davon', 's')

# ================================================== Risikoprüfung
k = kap('vbv-risikopruefung', 'Risikoprüfung', 'Gesundheitsprüfung und ihre Folgen')
add(k, 'Wozu dient die Gesundheitsprüfung?',
    'Zur Einschätzung des Risikos – damit gleiche Risiken gleiche Prämien tragen', 'e')
add(k, 'Welche Ergebnisse kann eine Risikoprüfung haben?',
    'Annahme zu normalen Bedingungen, Annahme mit Prämienzuschlag, Annahme mit Vorbehalt, Zurückstellung oder Ablehnung', 's')
add(k, 'Was ist ein Prämienzuschlag?',
    'Ein Aufschlag für ein erhöhtes Risiko – die Deckung bleibt vollständig', 'm')
add(k, 'Wann braucht es eine ärztliche Untersuchung?',
    'Ab bestimmten Versicherungssummen oder bei Auffälligkeiten in der Gesundheitserklärung', 'm')
add(k, 'Warum gibt es im BVG-Obligatorium keine Gesundheitsprüfung?',
    'Weil es ein Obligatorium ist – geprüft werden darf nur der überobligatorische Teil', 's')
add(k, 'Wie lange darf ein BVG-Vorbehalt dauern?',
    'Höchstens fünf Jahre, und nur im überobligatorischen Teil', 'p')
add(k, 'Was ist das Übertrittsrecht im Krankentaggeld?',
    f"Der Wechsel vom Kollektiv- in den Einzelvertrag ohne neue Gesundheitsprüfung – üblich innert {K['ktg']['uebertrittsrecht_tage']} Tagen", 's')
add(k, 'Warum ist der frühe Abschluss ein Argument?',
    'Weil die Gesundheit mit den Jahren selten besser wird – ein Vorbehalt heute schliesst die Deckung für morgen aus', 's')

# ================================================== Beratung und Aufsicht
k = kap('vbv-beratung', 'Beratung und Aufsicht', 'Pflichten des Vermittlers')
add(k, 'Wer beaufsichtigt die Versicherungen in der Schweiz?',
    'Die FINMA – die Eidgenössische Finanzmarktaufsicht', 'e')
add(k, 'Wofür steht VAG?', 'Versicherungsaufsichtsgesetz', 'e')
add(k, 'Was unterscheidet gebundene von ungebundenen Vermittlern?',
    'Gebundene arbeiten für eine Versicherung, ungebundene im Auftrag der Kundschaft – Makler müssen ihre Ungebundenheit offenlegen', 's')
add(k, 'Was muss der Vermittler vor Vertragsabschluss offenlegen?',
    'Identität und Adresse, Art der Bindung, wer die Entschädigung bezahlt, Umgang mit Interessenkonflikten und die zuständige Ombudsstelle', 'p')
add(k, 'Was gehört in ein Beratungsprotokoll?',
    'Bedürfnisse und Ziele der Kundschaft, die geprüften Lösungen, die Empfehlung und ihre Begründung', 's')
add(k, 'Warum ist das Beratungsprotokoll wichtig?',
    'Es ist der Nachweis, dass die Empfehlung zur Situation passte – ohne Protokoll steht Aussage gegen Aussage', 's')
add(k, 'Welche Weiterbildungspflicht gilt für Vermittler?',
    'Vermittler müssen die geforderten Mindeststandards an Aus- und Weiterbildung nachweisen und im FINMA-Register eingetragen sein', 'm')
add(k, 'Welche Sorgfaltspflicht gilt bei der Bedarfsanalyse?',
    'Die Empfehlung muss auf einer erhobenen Ausgangslage beruhen – Alter, Familie, Einkommen, bestehende Deckungen und Ziele', 's')
add(k, 'Was ist der Ablauf einer Vorsorgeberatung?',
    'Situation erheben, Lücken berechnen, Ziele festlegen, Lösungen vergleichen, empfehlen und begründen, umsetzen, periodisch überprüfen', 's')

# ================================================== Vorsorgeanalyse
k = kap('vbv-analyse', 'Vorsorgeanalyse', 'Lücken erkennen und rechnen')
add(k, 'Welche drei Risiken deckt eine Vorsorgeanalyse ab?',
    'Alter, Invalidität und Tod', 'e')
add(k, 'Was steht im Vorsorgeausweis?',
    'Versicherter Lohn, Altersguthaben, voraussichtliche Altersrente, Invaliden- und Hinterlassenenleistungen sowie das Einkaufspotenzial', 's')
add(k, 'Wie wird eine Vorsorgelücke berechnet?',
    'Bedarf minus die Summe der Leistungen aus 1. und 2. Säule – die Differenz ist die Lücke', 'm')
add(k, 'Welcher Bedarf wird üblicherweise angesetzt?',
    '80 bis 100 % des bisherigen Einkommens, je nach Lebenssituation', 'm')
add(k, 'Was ist der IK-Auszug?',
    'Der Auszug aus dem individuellen Konto der AHV – er zeigt alle gemeldeten Einkommen und deckt Beitragslücken auf', 's')
add(k, 'Wie oft sollte eine Vorsorgeanalyse überprüft werden?',
    'Bei jedem Lebensereignis – Heirat, Geburt, Stellenwechsel, Wohneigentum, Scheidung – und sonst alle paar Jahre', 'm')
add(k, 'Warum ist der Todesfall im Konkubinat der schwerste Fall?',
    'Weil dort alle drei Ebenen fehlen: keine AHV-Witwenrente, meist keine Pensionskassenrente, kein gesetzliches Erbrecht', 'p')
add(k, 'Warum ist die Krankheit meist schlechter gedeckt als der Unfall?',
    'Weil das UVG eine Invalidenrente von 80 % kennt; bei Krankheit tragen IV und Pensionskasse allein', 's')
add(k, 'Was ist bei Teilzeitarbeit besonders zu prüfen?',
    'Der Koordinationsabzug trifft kleine Pensen hart – der versicherte Lohn fällt überproportional tief aus', 'p')

# ================================================== Begriffe
k = kap('vbv-begriffe', 'Wichtige Begriffe', 'Was in der Prüfung genau unterschieden wird')
add(k, 'Was ist der versicherte Verdienst?',
    'Die Rechnungsgrundlage des UVG – der AHV-Lohn bis zum Höchstverdienst', 'm')
add(k, 'Was ist der koordinierte Lohn?',
    'Die Rechnungsgrundlage des BVG – der AHV-Lohn abzüglich Koordinationsabzug, begrenzt nach oben und unten', 'm')
add(k, 'Was ist der mutmasslich entgangene Verdienst?',
    'Was die versicherte Person ohne den Schadenfall verdient hätte – die Bezugsgrösse der BVG-Überentschädigung', 's')
add(k, 'Was ist das massgebende durchschnittliche Jahreseinkommen?',
    'Die Rechnungsgrundlage der AHV-Rente – das aufgewertete Durchschnittseinkommen samt Gutschriften', 's')
add(k, 'Was ist der Unterschied zwischen Arbeitsunfähigkeit und Erwerbsunfähigkeit?',
    'Arbeitsunfähigkeit bezieht sich auf den bisherigen Beruf, Erwerbsunfähigkeit auf jede zumutbare Tätigkeit', 'p')
add(k, 'Was ist der Deckungsgrad einer Pensionskasse?',
    'Das Verhältnis von Vorsorgevermögen zu Vorsorgekapital – unter 100 % besteht eine Unterdeckung', 's')
add(k, 'Was ist eine Teilliquidation?',
    'Die anteilige Aufteilung des Vorsorgevermögens, wenn ein grösserer Teil des Bestands die Kasse verlässt', 'p')
add(k, 'Was ist das Freizügigkeitsgesetz?',
    'Das FZG regelt, was beim Stellenwechsel mit dem Guthaben geschieht', 'm')
add(k, 'Was ist der Sicherheitsfonds BVG?',
    'Er sichert die gesetzlichen Leistungen bei Zahlungsunfähigkeit einer Vorsorgeeinrichtung und gleicht ungünstige Altersstrukturen aus', 's')
add(k, 'Was ist die 2. Säule plus?',
    'Der überobligatorische Teil der beruflichen Vorsorge – frei gestaltbar, ohne gesetzlichen Mindestzins und Mindestumwandlungssatz', 'p')
add(k, 'Was ist eine Kaderlösung 1e?',
    'Ein Vorsorgeplan für Lohnbestandteile über einer gesetzlichen Grenze, bei dem die versicherte Person die Anlagestrategie selbst wählt und das Risiko trägt', 'p')

# ------------------------------------------------------------------ Ausgabe
for i, k in enumerate(kapitel, 1):
    k['nr'] = i

json.dump(kapitel, io.open('system.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"{len(kapitel)} Kapitel, {sum(len(k['w']) for k in kapitel)} Einträge")
for k in kapitel:
    stufen = {}
    for _, _, n in k['w']:
        stufen[n] = stufen.get(n, 0) + 1
    print(f"{len(k['w']):3d}  {k['id']:24s} {k['titel']:34s} " +
          ' '.join(f'{n}:{c}' for n, c in sorted(stufen.items())))
