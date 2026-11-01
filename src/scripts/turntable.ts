/**
 * A 360° turntable from pre-rendered frames: drag to spin (with a little inertia), scroll to
 * zoom, arrow keys to step. Spins on its own until touched, and again after a short rest.
 */
type Spin = { frames: number; base: string; ext: string };

export function mountSpin(canvas: HTMLCanvasElement, spin: Spin, onFirst?: () => void) {
  const ctx = canvas.getContext('2d')!;
  // the frames sit on black, so screen-blend them: the black drops out over the void's grid
  canvas.style.mixBlendMode = 'screen';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imgs: HTMLImageElement[] = [];
  for (let i = 0; i < spin.frames; i++) {
    const im = new Image();
    im.decoding = 'async';
    if (i === 0) im.onload = () => { draw(); onFirst?.(); };
    im.src = `${spin.base}${String(i).padStart(3, '0')}${spin.ext}`;
    imgs.push(im);
  }

  let pos = 0, vel = 0, zoom = 1, last = 0, idleUntil = 0, shown = -1;
  const n = spin.frames;

  const size = () => {
    const d = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * d);
    canvas.height = Math.round(canvas.clientHeight * d);
    shown = -1;
  };
  const draw = () => {
    const i = ((Math.round(pos) % n) + n) % n;
    // fall back to the nearest frame that has loaded
    let k = i;
    for (let s = 0; s < n && !(imgs[k].complete && imgs[k].naturalWidth); s++) k = (i - s - 1 + n) % n;
    const im = imgs[k];
    if (!im.complete || !im.naturalWidth) return;
    if (k === shown && !zoomChanged) return;
    shown = k; zoomChanged = false;
    const W = canvas.width, H = canvas.height, ar = im.naturalWidth / im.naturalHeight;
    let w = Math.min(W * 0.94, H * 0.72 * ar, im.naturalWidth * 1.35 * Math.min(devicePixelRatio, 2)) * zoom;
    let h = w / ar;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2 + H * 0.04, w, h);
  };
  let zoomChanged = false;

  let raf = 0;
  const tick = (t: number) => {
    const dt = last ? Math.min(t - last, 50) : 16;
    last = t;
    if (!dragging) {
      if (Math.abs(vel) > 0.002) { pos += vel * dt; vel *= Math.pow(0.94, dt / 16); }
      else if (!still && t > idleUntil) pos += dt * 0.022;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };

  let dragging = false, lx = 0, lt = 0;
  const perPx = () => n / Math.max(320, canvas.clientWidth * 0.9);
  const down = (e: PointerEvent) => { dragging = true; lx = e.clientX; lt = performance.now(); vel = 0; canvas.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const d = -(e.clientX - lx) * perPx();
    pos += d;
    vel = d / Math.max(1, now - lt);
    lx = e.clientX; lt = now;
  };
  const up = () => { if (!dragging) return; dragging = false; idleUntil = performance.now() + 2500; };
  const wheel = (e: WheelEvent) => { e.preventDefault(); zoom = Math.min(2.2, Math.max(0.8, zoom * (1 - e.deltaY * 0.0012))); zoomChanged = true; };

  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('wheel', wheel, { passive: false });
  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  size();
  raf = requestAnimationFrame(tick);

  return {
    nudge(by: number) { pos += by; vel = 0; idleUntil = performance.now() + 2500; },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.style.mixBlendMode = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
    },
  };
}
