/**
 * Native <dialog> controller.
 * - [data-open="id"] opens a dialog; optional [data-hash] makes it shareable (#hash) and Back-closable.
 * - [data-close] inside a dialog closes it. Clicking the backdrop closes it.
 * - Fires `dialog:open` on the dialog with { opener } so content can be filled in first.
 */
type Opener = HTMLElement | null;
const openers = new WeakMap<HTMLDialogElement, Opener>();
const hashes = new WeakMap<HTMLDialogElement, string>();

export function openDialog(dialog: HTMLDialogElement, opener: Opener = null, hash?: string) {
  if (dialog.open) return;
  openers.set(dialog, opener ?? (document.activeElement as HTMLElement));
  dialog.dispatchEvent(new CustomEvent('dialog:open', { detail: { opener } }));
  dialog.showModal();
  if (hash) {
    hashes.set(dialog, hash);
    if (location.hash !== `#${hash}`) history.pushState({ dialog: dialog.id }, '', `#${hash}`);
  }
}

export function closeDialog(dialog: HTMLDialogElement) {
  if (dialog.open) dialog.close();
}

function onClose(this: HTMLDialogElement) {
  const opener = openers.get(this);
  const hash = hashes.get(this);
  hashes.delete(this);
  if (hash && location.hash === `#${hash}`) {
    if (history.state?.dialog === this.id) history.back();
    else history.replaceState(null, '', location.pathname + location.search);
  }
  if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
}

function init() {
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((d) => {
    if (d.dataset.bound) return;
    d.dataset.bound = '1';
    d.addEventListener('close', onClose);
    d.addEventListener('click', (e) => {
      if (e.target === d) closeDialog(d); // backdrop
    });
  });

  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const open = t.closest<HTMLElement>('[data-open]');
    if (open) {
      const d = document.getElementById(open.dataset.open!);
      if (d instanceof HTMLDialogElement) {
        e.preventDefault();
        openDialog(d, open, open.dataset.hash);
      }
      return;
    }
    const close = t.closest<HTMLElement>('[data-close]');
    const dialog = close?.closest('dialog');
    if (close && dialog) {
      // Links with data-close still navigate (e.g. nav panel anchors)
      if (!(close instanceof HTMLAnchorElement)) e.preventDefault();
      closeDialog(dialog);
    }
  });

  window.addEventListener('popstate', () => {
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => {
      const h = hashes.get(d);
      if (h && location.hash !== `#${h}`) { hashes.delete(d); d.close(); }
    });
  });

  // Deep link: #journal/slug etc.
  const h = decodeURIComponent(location.hash.slice(1));
  if (h) {
    const opener = document.querySelector<HTMLElement>(`[data-open][data-hash="${CSS.escape(h)}"]`);
    if (opener) requestAnimationFrame(() => opener.click());
  }
}

init();
