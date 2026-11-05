/**
 * Build-time corpus for "Ask the archive".
 * Every record is a passage lifted verbatim from the site's own content (site.ts and the
 * project case studies), tagged with where it came from so answers can cite it.
 * Lines that still contain DEMO copy are left out, so the archivist never quotes a placeholder.
 */
import { getCollection } from 'astro:content';
import { profile, timeline, toolbox, experiments, learning, topics, next, links, locker } from '@/data/site';
import { url } from '@/lib/url';

export type Rec = {
  /** passage text, quoted as-is in answers */
  t: string;
  /** source title shown on the citation card */
  s: string;
  /** section within the source */
  h: string;
  /** link to the source */
  u: string;
  /** kind of source: project, about, story, skill, life, contact, ship */
  k: string;
  /** extra keywords that describe the record but aren't quoted (title, stack, tags) */
  x?: string;
};

const clean = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|\s)\*(\S.*?)\*/g, '$1$2')
    .replace(/^\s*\*\s+/, '')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Split long paragraphs into chunks of whole sentences, about 320 characters each. */
function chunks(text: string, max = 320): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [text];
  const out: string[] = [];
  let cur = '';
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    if (cur && (cur + ' ' + s).length > max) { out.push(cur); cur = s; }
    else cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}

export async function buildCorpus(): Promise<Rec[]> {
  const recs: Rec[] = [];
  const add = (r: Rec) => {
    const t = clean(r.t);
    if (!t || /\bDEMO\b/.test(t) || t.length < 12) return;
    recs.push({ ...r, t });
  };
  const A = (id: string) => url(`archive/#${id}`);

  /* ---- about ---- */
  for (const c of chunks(profile.about)) add({ t: c, s: 'About me', h: 'Chapter 01', u: A('about'), k: 'about', x: 'who is param introduction bio summary' });
  add({ t: `${profile.name} — ${profile.role}, based in ${profile.location}. ${profile.tagline}`, s: 'Front page', h: 'Chapter 00', u: A('enter'), k: 'about', x: 'who is param name role location bengaluru' });
  for (const f of profile.facts) add({ t: `${f.label}: ${f.value}.`, s: 'About me', h: 'Quick facts', u: A('about'), k: 'about', x: f.label });
  for (const h of profile.hats) add({ t: `${h.label}: ${h.note}`, s: 'About me', h: 'Hats I wear', u: A('about'), k: 'about', x: h.label });
  add({ t: `In four words: ${profile.traits.join(', ')}.`, s: 'About me', h: 'Traits', u: A('about'), k: 'about', x: 'personality describe traits' });
  add({ t: 'The deal is in the detail.', s: 'The skill book', h: 'Motto', u: A('mind'), k: 'about', x: 'motto quote philosophy principle belief' });

  /* ---- story ---- */
  for (const p of profile.longStory) for (const c of chunks(p)) add({ t: c, s: 'My story', h: 'The long version', u: A('story'), k: 'story', x: 'journey background history' });
  for (const e of timeline) add({ t: `${e.year} — ${e.title}${/[.?!]$/.test(e.title) ? '' : '.'} ${e.body}`, s: 'My story', h: `Timeline · ${e.year}`, u: A('story'), k: 'story', x: `${e.kind} ${e.place ?? ''}` });

  /* ---- working mind ---- */
  for (const g of toolbox) for (const it of g.items) add({ t: `${it.name}: ${it.note}`, s: 'Working mind', h: g.label, u: A('mind'), k: 'skill', x: `${g.label} skill tool stack tech` });
  for (const e of experiments) add({ t: `${e.title} (${e.status.toLowerCase()}): ${e.note}`, s: 'Working mind', h: 'Experiments', u: A('mind'), k: 'skill', x: 'experiment side project' });
  add({ t: `Currently learning: ${learning.join('; ')}.`, s: 'Working mind', h: 'learning.txt', u: A('mind'), k: 'skill', x: 'learning studying course' });

  /* ---- life ---- */
  for (const tp of topics) {
    if (tp.id === 'hobbies' || tp.id === 'communities' || tp.id === 'experiments') {
      for (const it of tp.items) add({ t: `${tp.label}: ${it}.`, s: 'Life & interests', h: tp.label, u: A('life'), k: 'life', x: `${tp.blurb} hobby interest outside work` });
    }
  }
  add({ t: locker.note, s: 'The locker', h: 'Battleship', u: A('life'), k: 'ship', x: 'battleship ship model boat build covid reused scrap maker locker' });
  add({ t: `The ship: ${locker.ship.specs.map(([a, b]) => `${a.toLowerCase()} ${b}`).join(', ')}.`, s: 'The locker', h: 'Ship specs', u: A('life'), k: 'ship', x: 'battleship ship model boat size length lights' });

  /* ---- next / contact ---- */
  add({ t: `Exploring now: ${next.exploring.join('; ')}.`, s: "What's next", h: 'Exploring now', u: A('contact'), k: 'contact', x: 'future interest research direction goals' });
  add({ t: `Open to: ${next.openTo.join(', ')}.`, s: "What's next", h: 'Open to', u: A('contact'), k: 'contact', x: 'hire hiring available availability job role opportunity work freelance internship' });
  add({ t: `Email ${links.email}. GitHub ${links.github.replace('https://', '')}. LinkedIn ${links.linkedin.replace('https://www.', '')}.`, s: "What's next", h: 'Say hello', u: A('contact'), k: 'contact', x: 'contact reach email mail linkedin github message talk' });

  /* ---- projects ---- */
  const projects = (await getCollection('projects')).filter((p) => p.id !== 'next-project');
  for (const p of projects) {
    const d = p.data;
    const u = url(`archive/projects/${p.id}/`);
    const kw = [d.title, d.place, d.year, ...d.categories, ...d.tags, ...d.stack].join(' ');
    add({ t: `${d.title} (${d.year}, ${d.place}) — ${d.summary}`, s: d.title, h: 'Summary', u, k: 'project', x: `${kw} ${d.tagline}` });
    add({ t: `Role on ${d.title}: ${d.role}.${d.team ? ` Team: ${d.team}.` : ''}${d.duration ? ` ${d.duration}.` : ''}`, s: d.title, h: 'Role', u, k: 'project', x: kw });
    if (d.stack.length) add({ t: `${d.title} is built with ${d.stack.join(', ')}.`, s: d.title, h: 'Stack', u, k: 'project', x: `${kw} stack tech built technology` });
    if (d.keyFeatures.length) add({ t: `${d.title} features: ${d.keyFeatures.map((f) => f.text).join('; ')}.`, s: d.title, h: 'Key features', u, k: 'project', x: kw });

    let section = 'Overview';
    for (const block of (p.body ?? '').split(/\n\s*\n/)) {
      const b = block.trim();
      if (!b) continue;
      const head = b.match(/^#{2,4}\s+(.+)$/m);
      if (head && b.startsWith('#')) {
        section = head[1].trim();
        const rest = b.replace(/^#{2,4}\s+.+$/m, '').trim();
        if (!rest) continue;
      }
      const body = b.replace(/^#{2,4}\s+.+$/m, '').trim();
      if (/^\s*[-*]\s/m.test(body)) {
        for (const li of body.split(/\n\s*[-*]\s+/).map((s) => s.replace(/^[-*]\s+/, ''))) {
          for (const c of chunks(clean(li))) add({ t: c, s: d.title, h: section, u, k: 'project', x: `${d.title} ${section}` });
        }
      } else if (!body.startsWith('!') && !body.startsWith('<') && !body.startsWith('|')) {
        for (const c of chunks(clean(body))) add({ t: c, s: d.title, h: section, u, k: 'project', x: `${d.title} ${section}` });
      }
    }
  }
  return recs;
}
