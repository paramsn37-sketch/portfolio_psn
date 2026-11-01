/**
 * "Try photos" preview mode: drag any image onto a photo slot to see how it looks.
 *
 * Only for Param to audition pictures; nothing is uploaded. Dropped images are kept in this
 * browser (IndexedDB) so they survive reloads. Turn it on with ?try in the URL (it remembers),
 * off with ?try=0, or at build time with PUBLIC_TRY_PHOTOS=1. Delete this file and its import
 * in Base.astro to remove it entirely.
 */
const KEY = 'pa:try';
const params = new URLSearchParams(location.search);
const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* private mode */ } },
};
if (params.get('try') === '0') ls.set(KEY, null);
else if (params.has('try')) ls.set(KEY, '1');
const on = import.meta.env.PUBLIC_TRY_PHOTOS === '1' || ls.get(KEY) === '1';

/* ---------- tiny IndexedDB store ---------- */
const db = (): Promise<IDBDatabase> => new Promise((res, rej) => {
  const r = indexedDB.open('pa-try', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('pics');
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
const tx = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const d = await db();
  return new Promise<T>((res, rej) => { const q = fn(d.transaction('pics', mode).objectStore('pics')); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
};
const save = (k: string, v: string) => tx('readwrite', (s) => s.put(v, k)).catch(() => {});
const drop = (k: string) => tx('readwrite', (s) => s.delete(k)).catch(() => {});
const load = (k: string) => tx<string | undefined>('readonly', (s) => s.get(k)).catch(() => undefined);
const wipe = () => tx('readwrite', (s) => s.clear()).catch(() => {});

/** Shrink big photos so the store stays light. */
const shrink = (file: File): Promise<string> => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    res(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.86));
  };
  img.onerror = rej;
  img.src = URL.createObjectURL(file);
});

if (on) {
  const css = document.createElement('style');
  css.textContent = `
    .tp-slot { position: relative; outline: 2px dashed rgb(231 205 151 / 0.0); outline-offset: -2px; transition: outline-color .2s; }
    html.tp-on .tp-slot:hover, .tp-slot.tp-over { outline-color: #e7a33e !important; }
    .tp-slot.tp-over::after { content: 'Drop to try'; position: absolute; inset: 0; display: grid; place-items: center; background: rgb(231 163 62 / .35); color: #1a120a; font: 600 12px/1 ui-monospace, monospace; letter-spacing: .08em; text-transform: uppercase; z-index: 5; pointer-events: none; }
    .ph.tp-filled { background-size: cover !important; background-position: center !important; }
    .ph.tp-filled > :not(.tp-tools), .ph.tp-filled::before { visibility: hidden; }
    .tp-tools { position: absolute; top: 6px; right: 6px; z-index: 6; display: none; gap: 4px; }
    html.tp-on .tp-slot:hover > .tp-tools, html.tp-on .tp-tools:focus-within { display: flex; }
    .tp-tools button { all: unset; cursor: pointer; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: #1a120a; color: #f3e6cc; font: 600 14px/1 system-ui; box-shadow: 0 2px 6px rgb(0 0 0 / .4); }
    .tp-tools button:hover { background: #e7a33e; color: #1a120a; }
    .tp-wrap { position: relative; display: block; }
    .tp-pill { position: fixed; left: 14px; bottom: 14px; z-index: 2000; display: flex; gap: 6px; align-items: center; padding: 6px 6px 6px 12px; border-radius: 999px; background: #1a120a; color: #f3e6cc; font: 500 12px/1 ui-monospace, monospace; box-shadow: 0 6px 20px rgb(0 0 0 / .35); }
    .tp-pill button { all: unset; cursor: pointer; padding: 6px 10px; border-radius: 999px; background: rgb(255 255 255 / .1); }
    .tp-pill button:hover { background: #e7a33e; color: #1a120a; }
  `;
  document.head.append(css);
  document.documentElement.classList.add('tp-on');

  const seen = new Map<string, number>();
  const keyFor = (el: HTMLElement) => {
    const name = el.getAttribute('aria-label')?.replace(/^Placeholder: /, '') || el.getAttribute('alt') || 'photo';
    const base = `${location.pathname}|${name}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return `${base}|${n}`;
  };

  const apply = (el: HTMLElement, src: string | null) => {
    if (el instanceof HTMLImageElement) {
      if (!el.dataset.tpOrig) el.dataset.tpOrig = el.src;
      el.src = src ?? el.dataset.tpOrig;
    } else {
      el.style.backgroundImage = src ? `url("${src}")` : '';
      el.classList.toggle('tp-filled', !!src);
    }
  };

  const pick = (): Promise<File | undefined> => new Promise((res) => {
    const i = document.createElement('input');
    i.type = 'file'; i.accept = 'image/*';
    i.onchange = () => res(i.files?.[0]);
    i.click();
  });

  const slots = [...document.querySelectorAll<HTMLElement>('.ph, img.ph-img')];
  slots.forEach((el) => {
    const key = keyFor(el);
    // images can't hold buttons, so wrap them
    let host: HTMLElement = el;
    if (el instanceof HTMLImageElement) {
      host = document.createElement('span');
      host.className = 'tp-wrap';
      el.replaceWith(host);
      host.append(el);
    }
    host.classList.add('tp-slot');
    const tools = document.createElement('span');
    tools.className = 'tp-tools';
    tools.innerHTML = '<button type="button" title="Choose a photo" aria-label="Choose a photo">+</button><button type="button" title="Remove" aria-label="Remove the photo">×</button>';
    host.append(tools);
    const set = async (src: string | null) => { apply(el, src); src ? save(key, src) : drop(key); };
    const [add, rm] = tools.querySelectorAll('button');
    add.addEventListener('click', async (e) => { e.preventDefault(); e.stopPropagation(); const f = await pick(); if (f) set(await shrink(f)); });
    rm.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); set(null); });
    host.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); host.classList.add('tp-over'); });
    host.addEventListener('dragleave', () => host.classList.remove('tp-over'));
    host.addEventListener('drop', async (e) => {
      e.preventDefault(); e.stopPropagation();
      host.classList.remove('tp-over');
      const f = [...(e.dataTransfer?.files ?? [])].find((x) => x.type.startsWith('image/'));
      if (f) return set(await shrink(f));
      // an image dragged from another tab
      const u = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain');
      if (u && /^https?:/.test(u)) set(u.trim());
    });
    load(key).then((src) => { if (src) apply(el, src); });
  });

  // stop a stray drop from navigating away to the image
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => e.preventDefault());

  const pill = document.createElement('div');
  pill.className = 'tp-pill';
  pill.innerHTML = '<span>Try photos · drag onto any slot</span><button type="button" data-tp-clear>Clear all</button><button type="button" data-tp-off>Turn off</button>';
  const clear = pill.querySelector<HTMLButtonElement>('[data-tp-clear]')!;
  let armed = 0;
  clear.addEventListener('click', async () => {
    // two clicks to clear (confirm() is blocked in some embedded previews)
    if (!armed) { clear.textContent = 'Sure? Click again'; armed = window.setTimeout(() => { armed = 0; clear.textContent = 'Clear all'; }, 3000); return; }
    clearTimeout(armed); armed = 0; clear.textContent = 'Clear all';
    await wipe();
    slots.forEach((el) => apply(el, null));
  });
  pill.querySelector('[data-tp-off]')!.addEventListener('click', () => { ls.set(KEY, null); location.search = ''; });
  document.body.append(pill);
}
