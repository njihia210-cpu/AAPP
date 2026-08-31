/* Alena – Darstellung: Hell/Dunkel und Farbpaket.
   Standard ist Dunkel im Paket „Alena“. Beides bleibt im Browser gespeichert. */
(() => {
  const KEY_THEME = 'alena-theme';
  const KEY_PALETTE = 'alena-palette';
  const root = document.documentElement;

  /** Die Pakete – dieselbe Reihenfolge wie in styles.css. */
  const PAKETE = [
    { id: 'alena',  name: 'Alena',    beschreibung: 'Indigo und Flieder',  proben: ['#5b5be8', '#a88cf0', '#0d0a22'] },
    { id: 'gold',   name: 'Gold',     beschreibung: 'Schwarz und Gold',    proben: ['#c9a227', '#f0d68a', '#080807'] },
    { id: 'ocean',  name: 'Ozean',    beschreibung: 'Petrol und Türkis',   proben: ['#1f9aa8', '#5ad1c8', '#04141a'] },
    { id: 'rose',   name: 'Rosé',     beschreibung: 'Pflaume und Altrosa', proben: ['#c2477e', '#e79ab8', '#170a14'] },
    { id: 'forest', name: 'Wald',     beschreibung: 'Tanne und Salbei',    proben: ['#2e8f63', '#8ecfa4', '#07150f'] },
    { id: 'mono',   name: 'Graphit',  beschreibung: 'Schlicht und ruhig',  proben: ['#6e6e78', '#b9b9c4', '#0e0e10'] },
  ];
  const IDS = PAKETE.map((p) => p.id);

  const lies = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const merke = (k, v) => { try { localStorage.setItem(k, v); } catch { /* Privatmodus */ } };

  function anwenden(theme, paket) {
    root.dataset.theme = theme === 'light' ? 'light' : 'dark';
    root.dataset.palette = IDS.includes(paket) ? paket : 'alena';

    // Die Farbe der Statusleiste folgt dem Hintergrund des Pakets.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
      if (bg) meta.setAttribute('content', bg);
    }

    document.querySelectorAll('[data-theme-btn]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.themeBtn === root.dataset.theme)));
    document.querySelectorAll('[data-palette-btn]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.paletteBtn === root.dataset.palette)));

    dispatchEvent(new CustomEvent('alena:theme', {
      detail: { theme: root.dataset.theme, palette: root.dataset.palette },
    }));
  }

  // Sofort setzen, damit nichts aufblitzt.
  anwenden(lies(KEY_THEME) || 'dark', lies(KEY_PALETTE) || 'alena');

  const verdrahten = () => {
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        merke(KEY_THEME, btn.dataset.themeBtn);
        anwenden(btn.dataset.themeBtn, root.dataset.palette);
      });
    });
    document.querySelectorAll('[data-palette-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        merke(KEY_PALETTE, btn.dataset.paletteBtn);
        anwenden(root.dataset.theme, btn.dataset.paletteBtn);
      });
    });
    anwenden(root.dataset.theme, root.dataset.palette);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verdrahten);
  } else {
    verdrahten();
  }

  window.AlenaTheme = {
    PAKETE,
    anwenden,
    verdrahten,
    theme: () => root.dataset.theme,
    palette: () => root.dataset.palette,
  };
})();
