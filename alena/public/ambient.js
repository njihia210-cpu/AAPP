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

    /* Jede Linie hat eigene Wellenlänge, Höhe und Geschwindigkeit. */
    const threads = Array.from({ length: 7 }, (_, i) => ({
      y: 0.12 + i * 0.13,
      amp: 26 + (i % 3) * 22,
      len: 0.0012 + i * 0.00042,
      speed: 0.00006 + i * 0.000022,
      phase: i * 1.7,
      weight: i % 2 === 0 ? 1.4 : 0.9,
      fade: 0.45 + (i % 3) * 0.22,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = colour;

      for (const th of threads) {
        const base = th.y * h;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * th.fade})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = th.weight;
        for (let x = 0; x <= w; x += 8) {
          const y = base
            + Math.sin(x * th.len + t * th.speed * 1000 + th.phase) * th.amp
            + Math.sin(x * th.len * 2.7 + t * th.speed * 620) * (th.amp * 0.32);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    let raf = 0;
    const loop = (t) => {
      draw(t);
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
