/** Ask the archive: drawer UI — loads the catalogue, runs the engine, types out the answer card. */
import { buildIndex, ask, stats, marks, words, stem, FUSE_W, type Rec, type Result } from './engine';

const dialog = document.querySelector<HTMLDialogElement>('[data-ask]');
if (dialog) init(dialog);

function init(dialog: HTMLDialogElement) {
  const $ = <T extends HTMLElement>(s: string) => dialog.querySelector<T>(s)!;
  const form = $<HTMLFormElement>('[data-ask-form]');
  const input = $<HTMLInputElement>('[data-ask-input]');
  const card = $('[data-ask-card]');
  const front = $('[data-ask-front]');
  const noEl = $('[data-ask-no]');
  const filed = $('[data-ask-filed]');
  const qEl = $('[data-ask-question]');
  const body = $('[data-ask-body]');
  const stamp = $('[data-ask-stamp]');
  const sources = $('[data-ask-sources]');
  const time = $('[data-ask-time]');
  const trace = $('[data-ask-trace]');
  const count = $('[data-ask-count]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let index: ReturnType<typeof buildIndex> | null = null;
  let loading: Promise<void> | null = null;
  let loadMs = 0;
  let run = 0;

  const load = () =>
    (loading ??= (async () => {
      const t0 = performance.now();
      const res = await fetch(dialog.dataset.src!);
      const data = (await res.json()) as { recs: Rec[]; base?: string };
      // source links are written against the site base; resolve them next to the catalogue so
      // they keep working wherever the site is hosted
      const root = new URL('./', res.url);
      const base = (data.base ?? '/').replace(/\/?$/, '/');
      const flat = location.pathname.endsWith('/index.html');
      for (const r of data.recs) {
        let rel = r.u.startsWith(base) ? r.u.slice(base.length) : r.u.replace(/^\//, '');
        if (flat) rel = rel.replace(/(^|\/)(#|$)/, '$1index.html$2');
        r.u = new URL(rel, root).href;
      }
      index = buildIndex(data.recs);
      loadMs = performance.now() - t0;
      count.textContent = String(stats(index).passages);
    })().catch(() => { count.textContent = '—'; loading = null; }));

  dialog.addEventListener('dialog:open', () => {
    load();
    requestAnimationFrame(() => input.focus());
  });

  // "/" opens the drawer from anywhere (unless you're typing somewhere)
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (document.querySelector('dialog[open]')) return;
    e.preventDefault();
    document.querySelector<HTMLElement>('[data-open="ask"]')?.click();
  });
  // warm the catalogue when someone is about to open it
  document.querySelectorAll('[data-open="ask"]').forEach((b) => b.addEventListener('pointerenter', () => load(), { once: true }));

  form.addEventListener('submit', (e) => { e.preventDefault(); go(input.value); });
  dialog.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const q = t.closest<HTMLElement>('[data-ask-q]');
    if (q) { input.value = q.dataset.askQ!; go(q.dataset.askQ!); return; }
    if (t.closest('[data-ask-flip]')) flip();
    if (t.closest('.acard__body') && !t.closest('a, button')) skip = true;
  });
  // following a source link closes the drawer so the page underneath can scroll
  sources.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (a && new URL(a.href).pathname === location.pathname) dialog.close();
  });

  function flip(force?: boolean) {
    const on = force ?? !card.classList.contains('is-flipped');
    card.classList.toggle('is-flipped', on);
    dialog.querySelectorAll('[data-ask-flip]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
  }

  let skip = false;

  async function go(raw: string) {
    const q = raw.trim();
    if (!q) { input.focus(); return; }
    const my = ++run;
    await load();
    if (!index || my !== run) return;
    const r = ask(index, q);
    skip = reduce.matches;
    flip(false);
    card.hidden = false;
    renderTrace(r);
    const well = card.closest<HTMLElement>('.ask__well');
    if (well && card.offsetTop > well.clientHeight * 0.6) well.scrollTo({ top: card.offsetTop - 12, behavior: reduce.matches ? 'auto' : 'smooth' });
    await renderFront(r, my);
  }

  /* ---------------- front: the answer ---------------- */

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const catNo = (q: string) => {
    let h = 7;
    for (const c of q.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return `No. PSN-${String(h % 1000).padStart(3, '0')}.${String((h >>> 10) % 100).padStart(2, '0')}`;
  };

  function highlight(text: string, terms: Set<string>) {
    return text.split(/(\s+)/).map((tok) => {
      const w = words(tok);
      const hit = w.some((x) => terms.has(stem(x)));
      return hit ? `<mark>${esc(tok)}</mark>` : esc(tok);
    }).join('');
  }

  const DRAWER: Record<string, string> = {
    project: 'project files', skill: 'working mind', story: 'my story', about: 'about me', life: 'life & interests', ship: 'the locker', contact: "what's next",
  };

  function leadFor(r: Result, recs: Rec[]): string {
    const n = r.picked.length;
    switch (r.intent) {
      case 'self': {
        const s = stats(index!);
        return `I'm the archive's index, not a chatbot. Your question is cleaned up, stemmed and expanded with related terms, then two retrievers score all ${s.passages} passages: BM25 over words and TF-IDF over character trigrams, which forgives typos. Their scores are blended, a confidence gate decides whether anything is good enough to quote, and the best passages come back with their sources. All of it runs on your device in about a millisecond. I never write an answer of my own, so I can't make one up.`;
      }
      case 'greet': return "Hello. I can answer questions about Param's projects, skills, work, story and the ship in the locker. Everything I say is quoted from this archive.";
      case 'thanks': return 'Any time. The drawer stays open.';
      case 'empty': return '';
      case 'opinion': return "I keep records, not opinions. Here's what's on file. You decide.";
      default:
        if (!r.answered) return "Nothing in the archive answers that, so I won't guess.";
        return `${n === 1 ? 'One card answers that' : `${n} cards answer that`}, from ${[...new Set(recs.map((x) => DRAWER[x.k] ?? x.k))].slice(0, 2).join(' and ')}:`;
    }
  }

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function type(el: HTMLElement, text: string, my: number, cps = 140) {
    if (skip) { el.textContent = text; return; }
    const caret = document.createElement('span');
    caret.className = 'caret';
    el.textContent = '';
    const node = document.createTextNode('');
    el.append(node, caret);
    const step = Math.max(1, Math.round(text.length / 60));
    for (let i = 0; i < text.length; i += step) {
      if (my !== run) return;
      if (skip) break;
      node.data = text.slice(0, i + step);
      await wait(1000 / cps * step);
    }
    node.data = text;
    caret.remove();
  }

  async function renderFront(r: Result, my: number) {
    const recs = r.picked.map((i) => index!.recs[i]);
    const terms = marks(r.terms);
    noEl.textContent = catNo(r.question);
    filed.textContent = recs.length ? `Filed under ${recs[0].s}` : r.intent === 'search' || r.intent === 'opinion' ? 'Not on file' : 'Reference desk';
    qEl.textContent = r.question;
    body.innerHTML = '';
    sources.innerHTML = '';
    stamp.hidden = true;
    time.textContent = '';
    front.setAttribute('aria-busy', 'true');

    const lead = document.createElement('p');
    lead.className = 'lead';
    body.append(lead);
    await type(lead, leadFor(r, recs), my, 160);
    if (my !== run) return;

    if (recs.length) {
      const list = document.createElement('div');
      list.className = 'quotes';
      body.append(list);
      for (const [n, rec] of recs.entries()) {
        const p = document.createElement('p');
        p.className = 'quote';
        p.innerHTML = `<a class="quote__n" href="${esc(rec.u)}" aria-label="Source ${n + 1}: ${esc(rec.s)}">${n + 1}</a>${highlight(rec.t, terms)}`;
        list.append(p);
        requestAnimationFrame(() => p.classList.add('is-in'));
        if (!skip) await wait(220);
        if (my !== run) return;
      }
      const seen = new Set<string>();
      recs.forEach((rec, n) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${esc(rec.u)}"><span class="n">${n + 1}</span><span><b>${esc(rec.s)}</b> · ${esc(rec.h)}</span></a>`;
        sources.append(li);
        seen.add(rec.s);
      });
    }

    if ((r.intent === 'search' && !r.answered) || r.intent === 'greet' || r.intent === 'empty') {
      const retry = document.createElement('div');
      retry.className = 'retry';
      const picks = ['What does he do at Unisys?', 'Tell me about BotView', 'Can he do computer vision?', 'How do I contact him?'];
      retry.innerHTML = picks.map((p) => `<button type="button" data-ask-q="${esc(p)}">${esc(p)}</button>`).join('');
      body.append(retry);
    }

    if (r.intent === 'search' || r.intent === 'opinion') {
      stamp.hidden = false;
      stamp.textContent = r.answered ? 'On file' : 'Not on file';
      stamp.classList.toggle('is-ok', r.answered);
      // restart the stamp animation
      stamp.style.animation = 'none'; void stamp.offsetWidth; stamp.style.animation = '';
    }
    time.textContent = r.intent === 'search' || r.intent === 'opinion'
      ? `${index!.N} cards searched in ${r.ms < 1 ? r.ms.toFixed(2) : r.ms.toFixed(1)} ms`
      : '';
    front.removeAttribute('aria-busy');
  }

  /* ---------------- back: the working ---------------- */

  function rankList(list: { i: number; score: number }[], picked: Set<number>, max: number) {
    return `<ol class="rank" role="list">${list.slice(0, 5).map((x) => {
      const rec = index!.recs[x.i];
      const pct = Math.max(3, Math.round((x.score / (max || 1)) * 100));
      return `<li class="${picked.has(x.i) ? 'is-picked' : ''}"><span class="lbl"><b>${esc(rec.s)}</b> · ${esc(rec.h)}</span><span class="bar" title="${x.score.toFixed(3)}"><i style="width:${pct}%"></i></span></li>`;
    }).join('') || '<li><span class="lbl">no matches</span></li>'}</ol>`;
  }

  function renderTrace(r: Result) {
    const s = stats(index!);
    const picked = new Set(r.picked);
    if (r.intent !== 'search' && r.intent !== 'opinion') {
      trace.innerHTML = `
        <div><h4><i>0</i> Router</h4><p>This one was small talk (<b>${r.intent}</b>), so it skipped retrieval. Ask a real question and flip the card again to watch the pipeline.</p></div>
        <p class="note">Try: "pyhton projects", typo included.</p>
        <div class="stats"><span><b>${s.passages}</b> passages</span><span><b>${s.terms}</b> terms</span><span><b>${s.sources}</b> sources</span><span>catalogue loaded in <b>${Math.round(loadMs)}</b> ms</span></div>`;
      return;
    }
    const tok = (t: Result['terms'][number]) =>
      t.kind === 'repaired' ? `<span class="tok tok--repaired" title="typo repaired"><s>${esc(t.from!)}</s> → ${esc(t.term)}</span>`
      : t.kind === 'expanded' ? `<span class="tok tok--expanded" title="expanded from ${esc(t.from ?? '')}">+${esc(t.term)}</span>`
      : `<span class="tok">${esc(t.term)}</span>`;
    const conf = Math.round(r.confidence * 100), thr = Math.round(r.threshold * 100);
    trace.innerHTML = `
      <div>
        <h4><i>1</i> Read the question <small>stop words out, stems in${r.intent === 'opinion' ? ', opinion routed to evidence' : ''}</small></h4>
        <div class="toks">${r.terms.map(tok).join('') || '<span class="tok">(nothing searchable)</span>'}</div>
        <p class="legend">plain = your words · <span style="color:var(--olive-ink)">+green</span> = related terms (weighted 0.45) · <span style="color:var(--blue-deep)">blue</span> = typo repaired</p>
      </div>
      <div class="cols">
        <div><h4><i>2a</i> Words <small>BM25, k1 1.2, b 0.75</small></h4>${rankList(r.bm25, picked, r.bm25[0]?.score)}</div>
        <div><h4><i>2b</i> Subwords <small>trigram TF-IDF cosine</small></h4>${rankList(r.tri, picked, r.tri[0]?.score)}</div>
      </div>
      <div>
        <h4><i>3</i> Blend <small>${FUSE_W.lex} × words + ${FUSE_W.tri} × subwords, normalised; max 2 cards per source</small></h4>
        ${rankList(r.fused, picked, r.fused[0]?.score)}
      </div>
      <div>
        <h4><i>4</i> Confidence gate <small>${conf}% against a ${thr}% bar → ${r.answered ? 'quote it' : 'decline'}</small></h4>
        <div class="gate ${r.answered ? '' : 'is-low'}"><i style="width:${Math.max(2, conf)}%"></i><b style="left:${thr}%"></b></div>
      </div>
      <div class="stats">
        <span><b>${s.passages}</b> passages</span><span><b>${s.terms}</b> terms</span><span><b>${r.ms.toFixed(2)}</b> ms</span><span><b>0</b> network calls</span><span><b>0</b> generated words</span>
      </div>`;
  }
}
