/** One-shot entrance reveals. Content is visible by default; this only runs with JS. */
const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

// Stagger children of [data-stagger] containers (60–90ms apart, per the motion grammar)
document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
  const step = Number(group.dataset.stagger) || 70;
  group.querySelectorAll<HTMLElement>(':scope [data-reveal]').forEach((el, i) => {
    if (!el.style.getPropertyValue('--reveal-delay')) el.style.setProperty('--reveal-delay', `${i * step}ms`);
  });
});

if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  els.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}
// Safety net: never leave content hidden (e.g. printing, anchors jumped past)
addEventListener('beforeprint', () => els.forEach((el) => el.classList.add('is-in')));
