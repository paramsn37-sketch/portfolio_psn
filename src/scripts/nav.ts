/** Chapter scroll-spy, progress rail, top-bar indicator and desk return flag. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];
const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-rail]')];
const ind = document.querySelector<HTMLElement>('[data-nav-ind]');
const count = document.querySelector<HTMLElement>('[data-count]');
const fill = document.querySelector<HTMLElement>('[data-rail-fill]');
const needle = document.querySelector<SVGGElement>('[data-compass-needle]');
const bar = document.querySelector<HTMLElement>('[data-bar]');

let current = document.body.dataset.current ?? '';
let userScrolled = false;

function moveIndicator() {
  if (!ind) return;
  const active = navLinks.find((a) => a.getAttribute('aria-current') === 'true');
  if (!active) { ind.style.opacity = '0'; return; }
  const nav = active.closest('nav')!.getBoundingClientRect();
  const r = active.getBoundingClientRect();
  const pad = 5;
  ind.style.opacity = '1';
  ind.style.transform = `translateX(${r.left - nav.left + pad}px) scaleX(${r.width - pad * 2})`;
}

function setCurrent(id: string) {
  if (!id || id === current) return;
  current = id;
  document.body.dataset.current = id;
  for (const a of [...navLinks, ...railLinks]) {
    const on = (a.dataset.nav ?? a.dataset.rail) === id;
    on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  }
  const sec = sections.find((s) => s.id === id);
  if (count && sec?.dataset.num) count.textContent = sec.dataset.num;
  moveIndicator();
  // Keep the URL meaningful while reading (no history spam; never fights an open dialog's hash)
  if (userScrolled && !document.querySelector('dialog[open]')) {
    const want = id === 'enter' ? location.pathname : `#${id}`;
    if (want !== location.hash && !(id === 'enter' && !location.hash)) history.replaceState(history.state, '', want);
  }
}

if (sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).id);
    },
    { rootMargin: '-42% 0px -55% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

let ticking = false;
function onScroll() {
  userScrolled = true;
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    if (fill) fill.style.transform = `scaleY(${p})`;
    if (needle && !reduce.matches) needle.style.transform = `rotate(${p * 300 - 20}deg)`;
    bar?.classList.toggle('is-scrolled', scrollY > 8);
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', moveIndicator);
document.fonts?.ready.then(moveIndicator);
onScroll();
userScrolled = false;
if (current) { const c = current; current = ''; setCurrent(c); }

// Back to top
document.querySelectorAll<HTMLElement>('[data-to-top]').forEach((el) =>
  el.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('#top')?.focus({ preventScroll: true });
  }),
);

// Returning to the desk plays the zoom-out there
document.querySelectorAll<HTMLAnchorElement>('[data-to-desk]').forEach((a) =>
  a.addEventListener('click', () => {
    try { sessionStorage.setItem('desk:return', '1'); } catch {}
  }),
);

export {};
