/**
 * The desk: the camera drops into whatever you pick, the paper becomes the archive.
 * Links work without JS; this only adds the journey between pages.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector<HTMLElement>('[data-scene]')!;
const sheet = document.querySelector<HTMLElement>('[data-sheet]')!;
const content = document.querySelector<HTMLElement>('[data-sheet-content]')!;
const light = document.querySelector<HTMLElement>('.desk__light')!;
const veil = document.querySelector<HTMLElement>('[data-veil]')!;
const chrome = [...document.querySelectorAll<HTMLElement>('.desk__top, .desk__hint')];
const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
let busy = false;
let running: Animation[] = [];

/** Transform that brings point (x, y) to the viewport centre at scale k (origin = viewport centre). */
function zoomTo(x: number, y: number, k: number) {
  const ox = innerWidth / 2;
  const oy = innerHeight / 2;
  return `translate(${-(x - ox) * k}px, ${-(y - oy) * k}px) scale(${k})`;
}

function coverScale(r: DOMRect) {
  return Math.max(innerWidth / r.width, innerHeight / r.height) * 1.12;
}

function cancel() {
  running.forEach((a) => a.cancel());
  running = [];
}

function travel(href: string, from: Element) {
  if (busy) return;
  busy = true;
  try { sessionStorage.removeItem('desk:return'); } catch {}

  if (reduce.matches) {
    running.push(veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'forwards' }));
    setTimeout(() => location.assign(href), 220);
    return;
  }

  // Aim at the thing you picked: a map waypoint, a desk object, or the sheet itself.
  const target = from.closest('.obj, .map__stop') ?? sheet;
  const r = (target.matches('.map__stop') ? target.querySelector('.map__ring')! : target).getBoundingClientRect();
  const sr = sheet.getBoundingClientRect();
  const k = Math.min(9, Math.max(coverScale(sr), target === sheet ? 0 : coverScale(r) * 0.55));
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const D = 1050;

  running = [
    scene.animate([{ transform: 'none' }, { transform: zoomTo(x, y, k) }], { duration: D, easing: EASE, fill: 'forwards' }),
    content.animate([{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(4px)' }], { duration: 320, easing: 'ease-out', fill: 'forwards' }),
    light.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 380, easing: 'ease-out', fill: 'forwards' }),
    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: D - 320, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'forwards' }),
    ...chrome.map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' })),
  ];
  running[0].finished.then(() => location.assign(href)).catch(() => {});
}

function returnFromArchive() {
  document.documentElement.classList.remove('desk-returning');
  try { sessionStorage.removeItem('desk:return'); } catch {}
  if (reduce.matches) {
    running.push(veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }));
    return;
  }
  const sr = sheet.getBoundingClientRect();
  const from = zoomTo(sr.left + sr.width / 2, sr.top + sr.height / 2, coverScale(sr));
  running = [
    scene.animate([{ transform: from }, { transform: 'none' }], { duration: 1000, easing: EASE, fill: 'none' }),
    veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' }),
    light.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 350, easing: 'ease-out', fill: 'backwards' }),
    content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 650, easing: 'ease-out', fill: 'backwards' }),
    ...chrome.map((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 700, easing: 'ease-out', fill: 'backwards' })),
  ];
}

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-travel]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  travel(a.href, a);
});

// Coming back from the archive (folder icon / "Back to the desk")
if (document.documentElement.classList.contains('desk-returning')) {
  requestAnimationFrame(returnFromArchive);
}

// Back/forward cache: never leave the camera stuck inside the paper
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  cancel();
  busy = false;
  scene.style.transform = '';
  content.style.opacity = '';
  chrome.forEach((el) => (el.style.opacity = ''));
  veil.style.opacity = '0';
  returnFromArchive();
});

/* ---- The compass needle finds your pointer (a gentle spring, decorative only) ---- */
const needle = document.querySelector<SVGGElement>('[data-needle]');
if (needle && !reduce.matches && matchMedia('(pointer: fine)').matches) {
  const svg = needle.ownerSVGElement!;
  let angle = 0, vel = 0, goal = 0, raf = 0;
  const step = () => {
    let d = goal - angle;
    d = ((d + 540) % 360) - 180; // shortest way round
    vel = vel * 0.86 + d * 0.035;
    angle += vel;
    needle.style.transform = `rotate(${angle}deg)`;
    raf = Math.abs(vel) > 0.02 || Math.abs(d) > 0.2 ? requestAnimationFrame(step) : 0;
  };
  addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect();
    goal = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });
}
