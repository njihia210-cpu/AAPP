/* ==========================================================================
   Alena – Ziele
   Reine Logik, damit Oberfläche, Dashboard und Server dasselbe rechnen.
   ========================================================================== */

export const STATUS = [
  { id: 'offen',     label: 'Offen',     kurz: 'Offen',     ton: 'neutral' },
  { id: 'aktiv',     label: 'In Arbeit', kurz: 'In Arbeit', ton: 'aktiv' },
  { id: 'pendent',   label: 'Pendent',   kurz: 'Pendent',   ton: 'warten' },
  { id: 'geschafft', label: 'Geschafft', kurz: 'Geschafft', ton: 'gut' },
  { id: 'verworfen', label: 'Verworfen', kurz: 'Verworfen', ton: 'aus' },
];

export const STATUS_IDS = STATUS.map((s) => s.id);
export const istStatus = (id) => STATUS_IDS.includes(id);
export const statusLabel = (id) => STATUS.find((s) => s.id === id)?.label || 'Offen';

/** Ein Ziel gilt als erledigt, wenn es geschafft oder verworfen ist. */
export const abgeschlossen = (ziel) => ziel?.status === 'geschafft' || ziel?.status === 'verworfen';

export function leereZiele() {
  return { version: 1, goals: [], updatedAt: null };
}

/**
 * Fortschritt eines Ziels.
 * Mit Schritten zählt, wie viele davon geschafft sind – verworfene Schritte
 * zählen nicht mit, sie sind ja bewusst weggelassen worden.
 * Ohne Schritte entscheidet der Status des Ziels selbst.
 */
export function fortschritt(ziel) {
  const schritte = (ziel?.schritte || []).filter((s) => s.status !== 'verworfen');
  if (!schritte.length) {
    const fertig = ziel?.status === 'geschafft';
    return { erledigt: fertig ? 1 : 0, gesamt: fertig ? 1 : 0, anteil: fertig ? 1 : 0, ohneSchritte: true };
  }
  const erledigt = schritte.filter((s) => s.status === 'geschafft').length;
  return {
    erledigt,
    gesamt: schritte.length,
    anteil: schritte.length ? erledigt / schritte.length : 0,
    ohneSchritte: false,
  };
}

/** Kurzer Satz zum Stand – auch fürs Dashboard. */
export function standText(ziel) {
  const f = fortschritt(ziel);
  if (ziel?.status === 'geschafft') return 'Geschafft.';
  if (ziel?.status === 'verworfen') return 'Verworfen.';
  if (f.ohneSchritte) return 'Noch keine Schritte festgehalten.';
  if (f.erledigt === 0) return `${f.gesamt} Schritt${f.gesamt === 1 ? '' : 'e'} vor dir.`;
  if (f.erledigt === f.gesamt) {
    return f.gesamt === 1 ? 'Der einzige Schritt ist erledigt.' : `Alle ${f.gesamt} Schritte erledigt.`;
  }
  return `${f.erledigt} von ${f.gesamt} Schritten geschafft.`;
}

/**
 * Wählt ein Ziel für das Dashboard.
 * Offene Ziele zuerst; unter ihnen entscheidet der Zufall, aber stabil für
 * den ganzen Tag – sonst springt die Anzeige bei jedem Neuladen.
 */
export function zielDesTages(ziele, saat = new Date().toISOString().slice(0, 10)) {
  const offen = (ziele?.goals || []).filter((z) => !abgeschlossen(z));
  const auswahl = offen.length ? offen : (ziele?.goals || []);
  if (!auswahl.length) return null;

  let h = 0;
  for (const c of String(saat)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return auswahl[h % auswahl.length];
}
