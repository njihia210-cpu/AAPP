/* Alena – Hell/Dunkel.
   Standard ist Dunkel. Die Wahl bleibt im Browser gespeichert. */
(() => {
  const KEY = 'alena-theme';
  const root = document.documentElement;

  const read = () => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  };
  const store = (value) => {
    try { localStorage.setItem(KEY, value); } catch { /* Privatmodus: egal */ }
  };

  const apply = (theme) => {
    root.dataset.theme = theme === 'light' ? 'light' : 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f5ff' : '#0d0a22');
    document.querySelectorAll('[data-theme-btn]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.themeBtn === root.dataset.theme))
    );
    dispatchEvent(new CustomEvent('alena:theme', { detail: root.dataset.theme }));
  };

  // Sofort setzen, damit nichts aufblitzt.
  apply(read() || 'dark');

  const wire = () => {
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.themeBtn;
        store(theme);
        apply(theme);
      });
    });
    apply(root.dataset.theme);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.AlenaTheme = { apply, current: () => root.dataset.theme };
})();
