/* ==========================================================================
   Alena – Lernatelier: Fächer und Unterfächer
   Eine Stelle, an der steht, was es zu lernen gibt. Ein neues Unterfach
   braucht nur ein Datenmodul und einen Eintrag hier.

   Ein Datenmodul liefert:
     NIVEAUS      [{ id, name, beschreibung }]
     KAPITEL      [{ id, nr, titel, deutsch, w: [[vorne, hinten, niveau], …] }]
     ALLE_ITEMS   [{ id, kapitel, vorne, hinten, niveau, sprich? }]
     FAELLE       (freiwillig) [{ id, titel, phasen: [{ phase, bezeichnung }] }]
   ========================================================================== */

export const FAECHER = [
  {
    id: 'franzoesisch',
    name: 'Französisch',
    icon: '🇫🇷',
    unterfaecher: [{
      id: 'wortschatz',
      name: 'Wortschatz',
      titel: 'Le vocabulaire de base',
      beschreibung: 'Französisch Coaching, Dossier 3 – Listes de vocabulaire.',
      vorneName: 'Französisch',
      hintenName: 'Deutsch',
      modi: ['stufen', 'karteikarten', 'auswahl', 'tippen', 'satzbau', 'zuordnen', 'hoeren'],
      laden: () => import('/franz-daten.js'),
    }],
  },
  {
    id: 'versicherungen',
    name: 'Versicherungen',
    icon: '🛡️',
    unterfaecher: [{
      id: 'leben',
      name: 'Leben',
      titel: 'Vorsorgegrafiken',
      beschreibung: 'VBV/AFA – Modul Leben. Ansätze 2025, Skala 44.',
      vorneName: 'Frage',
      hintenName: 'Antwort',
      modi: ['stufen', 'karteikarten', 'auswahl', 'tippen', 'zuordnen', 'grafik'],
      laden: () => import('/vbv-daten.js'),
    }],
  },
];

export const findeFach = (id) => FAECHER.find((f) => f.id === id) || FAECHER[0];

export function findeUnterfach(fachId, unterId) {
  const fach = findeFach(fachId);
  return fach.unterfaecher.find((u) => u.id === unterId) || fach.unterfaecher[0];
}

/** Kurzform für die Anzeige: „Versicherungen · Leben“. */
export const wegweiser = (fachId, unterId) => {
  const f = findeFach(fachId);
  const u = findeUnterfach(fachId, unterId);
  return `${f.name} · ${u.name}`;
};
