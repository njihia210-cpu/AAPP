/* Alena – ruhig schwebende Linien im Hintergrund.
   Zeichnet auf ein Canvas hinter dem Inhalt, pausiert im Hintergrundtab
   und steht still, wenn das Gerät reduzierte Bewegung verlangt. */
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.id = 'threads';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');

  const start = () => {
    document.body.appendChild(canvas);

    let w = 0, h = 0, dpr = 1;
    let colour = [143, 168, 255];
    let alpha = 0.3;

    const readColours = () => {
      const css = getComputedStyle(document.documentElement);
      const raw = css.getPropertyValue('--thread').trim();
      const parts = raw.split(',').map((n) => Number(n.trim()));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) colour = parts;
      const a = Number(css.getPropertyValue('--thread-alpha'));
      if (Number.isFinite(a) && a > 0) alpha = a;
    };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* Jede Linie hat eigene Wellenlänge, Höhe und Geschwindigkeit.
       Die Werte sind in Bogenmass je Millisekunde: 0,00006 bedeutet gut
       anderthalb Minuten für einen vollen Durchlauf. Bewusst träge. */
    const threads = Array.from({ length: 7 }, (_, i) => ({
      y: 0.12 + i * 0.13,
      amp: 24 + (i % 3) * 18,
      len: 0.0011 + i * 0.00035,
      speed: 0.00004 + i * 0.000007,
      drift: 0.000018 + i * 0.0000042,   // langsames Wandern nach oben und unten
      phase: i * 1.7,
      weight: i % 2 === 0 ? 1.3 : 0.85,
      fade: 0.45 + (i % 3) * 0.22,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = colour;

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (const th of threads) {
        const base = th.y * h + Math.sin(t * th.drift + th.phase) * (h * 0.035);
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * th.fade})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = th.weight;

        /* Punkte berechnen und mit weichen Kurven verbinden statt mit Kanten. */
        const step = 26;
        const pts = [];
        for (let x = -step; x <= w + step; x += step) {
          const y = base
            + Math.sin(x * th.len + t * th.speed + th.phase) * th.amp
            + Math.sin(x * th.len * 1.9 + t * th.speed * 0.55) * (th.amp * 0.28);
          pts.push({ x, y });
        }
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        ctx.stroke();
      }
    };

    /* Bei dieser Trägheit reichen 30 Bilder je Sekunde – das halbiert
       die Rechenlast und schont auf dem Handy den Akku. */
    let raf = 0;
    let last = 0;
    const loop = (t) => {
      if (t - last >= 33) {
        draw(t);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (still) return void draw(0);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    readColours();
    resize();
    play();

    addEventListener('resize', () => { resize(); if (still) draw(0); }, { passive: true });
    addEventListener('alena:theme', () => { readColours(); if (still) draw(0); });
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
