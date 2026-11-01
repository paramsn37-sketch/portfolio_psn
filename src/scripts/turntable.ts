/**
 * A 360° turntable from pre-rendered frames: drag to spin (with a little inertia), scroll to
 * zoom, arrow keys to step. Spins on its own until touched, and again after a short rest.
 */
export type Spin = { frames: number; base: string; ext: string };
export type DrawInfo = { i: number; n: number; x: number; y: number; w: number; h: number };

const url = (s: Spin, i: number) => `${s.base}${String(i).padStart(3, '0')}${s.ext}`;

/** Start fetching the frames early (e.g. while the locker is open) so the void opens instantly. */
export function prefetchSpin(spin: Spin) {
  let i = 0;
  const next = () => {
    if (i >= spin.frames) return;
    const im = new Image();
    im.onload = im.onerror = next;
    im.src = url(spin, i++);
  };
  // a few parallel lanes
  for (let k = 0; k < 4; k++) next();
}

export function mountSpin(
  canvas: HTMLCanvasElement,
  spin: Spin,
  opts: { onFirst?: () => void; onDraw?: (d: DrawInfo) => void; fit?: (w: number, h: number) => number } = {},
) {
  const ctx = canvas.getContext('2d')!;
  // the frames sit on black, so screen-blend them: the black drops out over the void's floor
  canvas.style.mixBlendMode = 'screen';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = spin.frames;
  const imgs: HTMLImageElement[] = [];
  let pos = 0, vel = 0, zoom = 1, last = 0, idleUntil = 0, shown = -1, dirty = true;

  for (let i = 0; i < n; i++) {
    const im = new Image();
    im.decoding = 'async';
    if (i === 0) im.onload = () => { dirty = true; opts.onFirst?.(); };
    im.src = url(spin, i);
    imgs.push(im);
  }

  let dpr = 1;
  const size = () => {
    dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    dirty = true;
  };
  const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;
  const draw = () => {
    const i = ((Math.round(pos) % n) + n) % n;
    let k = i;
    for (let s = 0; s < n && !ok(imgs[k]); s++) k = (i - s - 1 + n) % n;
    const im = imgs[k];
    if (!ok(im) || (k === shown && !dirty)) return;
    shown = k; dirty = false;
    const W = canvas.width, H = canvas.height, ar = im.naturalWidth / im.naturalHeight;
    const frac = opts.fit ? opts.fit(canvas.clientWidth, canvas.clientHeight) : 0.94;
    const w = Math.min(W * frac, H * 0.7 * ar, im.naturalWidth * 1.35 * dpr) * zoom;
    const h = w / ar;
    const x = (W - w) / 2, y = (H - h) / 2 + H * 0.03;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(im, x, y, w, h);
    opts.onDraw?.({ i: k, n, x: x / dpr, y: y / dpr, w: w / dpr, h: h / dpr });
  };

  let raf = 0;
  const tick = (t: number) => {
    const dt = last ? Math.min(t - last, 50) : 16;
    last = t;
    if (!dragging) {
      if (Math.abs(vel) > 0.002) { pos += vel * dt; vel *= Math.pow(0.94, dt / 16); }
      else if (!still && t > idleUntil) pos += dt * 0.018;
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
  const wheel = (e: WheelEvent) => { e.preventDefault(); zoom = Math.min(2, Math.max(0.8, zoom * (1 - e.deltaY * 0.0012))); dirty = true; };

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
      ro.disconnect();
      canvas.style.mixBlendMode = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
    },
  };
}
