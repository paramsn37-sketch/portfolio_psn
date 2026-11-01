/** The visitor's sack: what they've picked up on the page. Remembered per browser when storage allows. */
const KEY = 'pa-inventory';
const items = new Set<string>();
try {
  for (const i of JSON.parse(localStorage.getItem(KEY) ?? '[]')) items.add(i);
} catch {}

export const has = (item: string) => items.has(item);

export function add(item: string) {
  items.add(item);
  try { localStorage.setItem(KEY, JSON.stringify([...items])); } catch {}
  window.dispatchEvent(new CustomEvent('pa:inventory', { detail: { item } }));
}

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fly a copy of `el` from one rect to another; resolves when it lands. */
export function fly(el: Element, from: DOMRect, to: DOMRect, ms = 700): Promise<void> {
  if (reduce()) return Promise.resolve();
  const ghost = el.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, { position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, margin: '0', zIndex: '1200', pointerEvents: 'none' });
  document.body.append(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const s = Math.min(1.4, Math.max(0.4, to.width / from.width));
  const a = ghost.animate(
    [
      { transform: 'translate(0, 0) rotate(0) scale(1)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) rotate(200deg) scale(1.15)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) rotate(360deg) scale(${s})` },
    ],
    { duration: ms, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
  );
  return a.finished.then(() => ghost.remove(), () => ghost.remove());
}
