/**
 * Ask the archive: a small retrieval engine that runs entirely in the browser.
 *
 *   question ─► normalise + stem ─► expand (concept map) ─► typo repair (trigram Jaccard)
 *            ─► BM25 over words ─┐
 *            ─► TF-IDF cosine over character trigrams ─┴► reciprocal rank fusion
 *            ─► confidence gate ─► diversify by source ─► quote passages with citations
 *
 * It never writes an answer of its own: everything it says is a passage from the archive,
 * or a refusal when nothing clears the gate. No server, no model download, no API key.
 */

export type Rec = { t: string; s: string; h: string; u: string; k: string; x?: string };

export type Term = { term: string; w: number; kind: 'query' | 'expanded' | 'repaired'; from?: string };
export type Ranked = { i: number; score: number };
export type Result = {
  question: string;
  intent: 'search' | 'self' | 'greet' | 'thanks' | 'opinion' | 'empty';
  terms: Term[];
  bm25: Ranked[];
  tri: Ranked[];
  fused: Ranked[];
  picked: number[];
  confidence: number;
  threshold: number;
  answered: boolean;
  ms: number;
};

const STOP = new Set(
  ('a an and are as at be been but by can could did do does doing for from had has have he her his how i if in into is it its me my of on or our param params paramsn s she so tell than that the their them then there these they this to too us was we were what when where which who whom why will with would you your about any some show give list know get got done much many also just more most very really please kind sort thing things him should anything something anyone everything ever like want wanted need does tell say experience experienced skill skills knowledge good biggest main old age'
  ).split(' '),
);

/** Tiny suffix stemmer: enough to make "built/builds/building" and "projects/project" meet. */
const KEEP: Record<string, string> = { shipped: 'shipped', shipping: 'shipped', ships: 'ship', news: 'news', analytics: 'analytics', aws: 'aws', unisys: 'unisys' };

export function stem(w: string): string {
  if (KEEP[w]) return KEEP[w];
  if (w.length <= 3) return w;
  const rules: [RegExp, string][] = [
    [/ies$/, 'y'], [/(ss)es$/, '$1'], [/([^aeiou])es$/, '$1e'], [/([^sy])s$/, '$1'],
    [/ing$/, ''], [/ed$/, ''], [/ly$/, ''], [/ment$/, ''],
  ];
  for (const [re, rep] of rules) {
    if (re.test(w)) {
      let out = w.replace(re, rep);
      if (out.length < 3) continue;
      // shipped -> shipp -> ship, planning -> plann -> plan
      if ((rep === '') && /([bdgmnprt])\1$/.test(out)) out = out.slice(0, -1);
      return out;
    }
  }
  return w;
}

export function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\.net\b/g, ' dotnet ')
    .replace(/c\+\+/g, ' cpp ')
    .replace(/c#/g, ' csharp ')
    .replace(/[’']/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export const tokens = (text: string) => words(text).filter((w) => !STOP.has(w)).map(stem);

/**
 * Concept map: how a recruiter asks vs. how an engineer writes it down.
 * Keys and values are written plain and stemmed at load.
 */
const CONCEPTS: Record<string, string> = {
  ai: 'generative llm gemini rag machine learning model',
  ml: 'machine learning model yolo vision',
  genai: 'generative llm gemini rag',
  llm: 'gemini generative rag prompts embeddings',
  gpt: 'llm gemini generative openai',
  chatbot: 'llm gemini interviewer agent voice',
  agent: 'agents voice llm automation',
  cv: 'computer vision yolov11 detection',
  vision: 'computer yolov11 detection camera',
  image: 'vision detection camera',
  detection: 'yolov11 vision ppe',
  rag: 'retrieval semantic search pgvector embeddings',
  search: 'semantic retrieval pgvector',
  nlp: 'speech text llm language',
  voice: 'speech stt sarvam interview',
  frontend: 'react angular typescript tailwind ui',
  ui: 'react angular figma design',
  backend: 'fastapi dotnet flask node api microservices',
  api: 'fastapi backend',
  fullstack: 'frontend backend react angular fastapi dotnet',
  database: 'postgresql supabase mongodb sql oracle',
  db: 'postgresql supabase mongodb sql',
  cloud: 'aws vercel ec2 deploy',
  devops: 'aws deploy codedeploy pipeline',
  deploy: 'aws vercel deployment',
  job: 'role work open hire',
  hire: 'open full-time roles internships available',
  hiring: 'open roles internships',
  available: 'open roles internships freelance',
  freelance: 'freelance builds open',
  work: 'intern unisys placevalue role',
  intern: 'internship unisys placevalue',
  internship: 'intern unisys placevalue',
  company: 'unisys placevalue',
  current: 'currently unisys intern',
  now: 'currently unisys exploring',
  lead: 'leader led officer team',
  leadership: 'leader led junior under officer team lead',
  team: 'team lead led interns',
  ncc: 'national cadet corps officer certificate',
  military: 'ncc cadet corps',
  army: 'ncc cadet',
  education: 'college sjbit degree school study',
  college: 'sjbit degree education',
  degree: 'be ai ml sjbit',
  study: 'education sjbit learning',
  university: 'sjbit college',
  contact: 'email linkedin github hello',
  email: 'mail contact',
  reach: 'email contact linkedin',
  hobby: 'hobbies interests models ship art',
  hobbies: 'interests models ship art',
  fun: 'hobbies interests life',
  ship: 'battleship model built',
  boat: 'ship battleship',
  model: 'models ship battleship',
  users: 'students used real live',
  shipped: 'live users students deployed results',
  impact: 'results students used real',
  production: 'live deployed users',
  hackathon: 'hack horizon competition',
  award: 'semi-finals certificate grade competition',
  achievement: 'semi-finals certificate results',
  python: 'fastapi flask',
  java: 'javascript',
  js: 'javascript node',
  ts: 'typescript',
  language: 'languages english kannada hindi tamil python',
  speak: 'languages english kannada hindi tamil',
  where: 'location bengaluru',
  live: 'location bengaluru',
  location: 'bengaluru india',
  motto: 'deal detail',
  quote: 'motto deal detail',
  hard: 'hardest learnings challenge',
  challenge: 'hardest learnings problem',
  learn: 'learnings learning lesson',
  fail: 'failure failing learnings',
  strength: 'builder ownership end',
  automation: 'n8n workflow automation',
  security: 'safety ppe auth',
  safety: 'ppe industrial helmets vision',
};

type Index = {
  recs: Rec[];
  N: number;
  avgdl: number;
  dl: number[];
  tf: Map<string, number>[];
  df: Map<string, number>;
  vocab: string[];
  triVec: Map<string, number>[];
  triIdf: Map<string, number>;
  concepts: Map<string, string[]>;
  sources: number;
};

const K1 = 1.2, B = 0.75;

function trigrams(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const w of words(text)) {
    if (STOP.has(w)) continue;
    const s = `#${w}#`;
    for (let i = 0; i < s.length - 2; i++) {
      const g = s.slice(i, i + 3);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
  }
  return m;
}

function gramSet(w: string) {
  const s = `#${w}#`;
  const out = new Set<string>();
  for (let i = 0; i < s.length - 2; i++) out.add(s.slice(i, i + 3));
  return out;
}

/** Damerau-Levenshtein (optimal string alignment) distance, capped for speed. */
function editDistance(a: string, b: string, cap = 3): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

function jaccard(a: Set<string>, b: Set<string>) {
  let inter = 0;
  for (const g of a) if (b.has(g)) inter++;
  return inter / (a.size + b.size - inter);
}

export function buildIndex(recs: Rec[]): Index {
  const tf: Map<string, number>[] = [];
  const df = new Map<string, number>();
  const dl: number[] = [];
  const triRaw: Map<string, number>[] = [];
  const triDf = new Map<string, number>();

  recs.forEach((r) => {
    const m = new Map<string, number>();
    const bump = (t: string, w: number) => m.set(t, (m.get(t) ?? 0) + w);
    for (const t of tokens(r.t)) bump(t, 1);
    for (const t of tokens(r.s)) bump(t, 1.5);
    for (const t of tokens(r.h)) bump(t, 0.5);
    for (const t of tokens(r.x ?? '')) bump(t, 0.6);
    let len = 0;
    for (const [t, w] of m) { len += w; df.set(t, (df.get(t) ?? 0) + 1); }
    tf.push(m); dl.push(len);

    const g = trigrams(`${r.s} ${r.t}`);
    for (const k of g.keys()) triDf.set(k, (triDf.get(k) ?? 0) + 1);
    triRaw.push(g);
  });

  const N = recs.length;
  const triIdf = new Map<string, number>();
  for (const [g, d] of triDf) triIdf.set(g, Math.log(1 + N / d));
  const triVec = triRaw.map((g) => {
    const v = new Map<string, number>();
    let norm = 0;
    for (const [k, c] of g) { const w = (1 + Math.log(c)) * triIdf.get(k)!; v.set(k, w); norm += w * w; }
    norm = Math.sqrt(norm) || 1;
    for (const [k, w] of v) v.set(k, w / norm);
    return v;
  });

  const concepts = new Map<string, string[]>();
  for (const [k, v] of Object.entries(CONCEPTS)) concepts.set(stem(k), tokens(v));

  return {
    recs, N, tf, df, dl, triVec, triIdf, concepts,
    avgdl: dl.reduce((a, b) => a + b, 0) / Math.max(1, N),
    vocab: [...df.keys()],
    sources: new Set(recs.map((r) => r.s)).size,
  };
}

const idf = (ix: Index, t: string) => {
  const d = ix.df.get(t) ?? 0;
  return Math.log(1 + (ix.N - d + 0.5) / (d + 0.5));
};

function expand(ix: Index, q: string[]): Term[] {
  const terms: Term[] = [];
  const seen = new Set<string>();
  const push = (t: Term) => { if (!seen.has(t.term)) { seen.add(t.term); terms.push(t); } };

  for (const t of q) {
    if (ix.df.has(t) || ix.concepts.has(t) || t.length < 5) push({ term: t, w: 1, kind: 'query' });
    else {
      // typo repair: shortlist by trigram overlap, accept only a small edit distance
      const gs = gramSet(t);
      const maxEdit = t.length >= 8 ? 2 : 1;
      let best = '', bestKey = Infinity;
      for (const v of ix.vocab) {
        if (Math.abs(v.length - t.length) > maxEdit) continue;
        const j = jaccard(gs, gramSet(v));
        if (j < 0.2) continue;
        const e = editDistance(t, v, maxEdit);
        if (e > maxEdit) continue;
        const key = e - j - Math.log(1 + (ix.df.get(v) ?? 0)) * 0.01;
        if (key < bestKey) { bestKey = key; best = v; }
      }
      if (best) push({ term: best, w: 0.85, kind: 'repaired', from: t });
      else push({ term: t, w: 1, kind: 'query' });
    }
  }
  for (const t of [...terms]) {
    const more = ix.concepts.get(t.term);
    if (more) for (const m of more) if (ix.df.has(m)) push({ term: m, w: 0.45, kind: 'expanded', from: t.term });
  }
  return terms;
}

function bm25(ix: Index, terms: Term[]): Ranked[] {
  const out: Ranked[] = [];
  for (let i = 0; i < ix.N; i++) {
    let s = 0;
    const m = ix.tf[i];
    for (const { term, w } of terms) {
      const f = m.get(term);
      if (!f) continue;
      s += w * idf(ix, term) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * ix.dl[i]) / ix.avgdl)));
    }
    if (s > 0) out.push({ i, score: s });
  }
  return out.sort((a, b) => b.score - a.score);
}

function triCos(ix: Index, q: string): Ranked[] {
  const g = trigrams(q);
  const v = new Map<string, number>();
  let norm = 0;
  for (const [k, c] of g) {
    const w = (1 + Math.log(c)) * (ix.triIdf.get(k) ?? 0);
    if (w) { v.set(k, w); norm += w * w; }
  }
  norm = Math.sqrt(norm) || 1;
  const out: Ranked[] = [];
  for (let i = 0; i < ix.N; i++) {
    let dot = 0;
    const d = ix.triVec[i];
    for (const [k, w] of v) { const x = d.get(k); if (x) dot += x * w; }
    if (dot > 0) out.push({ i, score: dot / norm });
  }
  return out.sort((a, b) => b.score - a.score);
}

/** Hybrid fusion: min-max normalise each retriever, then take a weighted sum. */
export const FUSE_W = { lex: 0.7, tri: 0.3 };
function fuse(lex: Ranked[], tri: Ranked[]): Ranked[] {
  const m = new Map<number, number>();
  const lmax = lex[0]?.score || 1, tmax = tri[0]?.score || 1;
  for (const r of lex) m.set(r.i, FUSE_W.lex * (r.score / lmax));
  // the subword retriever only gets a real vote when it is reasonably sure
  for (const r of tri.slice(0, 40)) m.set(r.i, (m.get(r.i) ?? 0) + FUSE_W.tri * (r.score / tmax) * Math.min(1, tmax / 0.25));
  return [...m].map(([i, score]) => ({ i, score })).sort((a, b) => b.score - a.score);
}

const RE = {
  self: /\b(who|what) are you\b|\bhow (do|does) (you|this|it) work\b|\bare you (an? )?(ai|bot|llm|gpt|chatgpt|real)\b|\bwhat is this\b|\bhow were you (made|built)\b/,
  greet: /^\s*(hi|hello|hey|yo|hola|namaste|good (morning|evening|afternoon))\b[\s!.?]*$/,
  thanks: /^\s*(thanks|thank you|thx|cheers|nice|cool|great|awesome)\b[\s!.?]*$/,
  opinion: /\b(should (i|we) hire|why (should|hire)|is (he|param|they) (good|any good|great|worth|smart|skilled|talented)|good (engineer|developer|fit|hire)|best (at|thing)|worth (hiring|it)|stand out|strongest|impressive|rate)\b/,
};

export function ask(ix: Index, question: string, threshold = 0.45): Result {
  const t0 = performance.now();
  const q = question.trim();
  const base: Result = { question: q, intent: 'search', terms: [], bm25: [], tri: [], fused: [], picked: [], confidence: 0, threshold, answered: false, ms: 0 };
  const lower = q.toLowerCase();
  if (!q) return { ...base, intent: 'empty' };
  if (RE.self.test(lower)) return { ...base, intent: 'self', answered: true, confidence: 1, ms: performance.now() - t0 };
  if (RE.greet.test(lower)) return { ...base, intent: 'greet', answered: true, confidence: 1, ms: performance.now() - t0 };
  if (RE.thanks.test(lower)) return { ...base, intent: 'thanks', answered: true, confidence: 1, ms: performance.now() - t0 };
  const opinion = RE.opinion.test(lower);

  // "is he good at design?" still has a topic to search; "should I hire him?" does not
  const OPINION_WORDS = new Set(tokens('hire hiring good great worth smart skilled talented best strongest impressive stand out fit engineer developer rate why'));
  const topical = tokens(q).filter((t) => !OPINION_WORDS.has(t));
  if (opinion && !topical.some((t) => ix.df.has(t) || ix.concepts.has(t))) return evidence(ix, base, t0);
  const terms = expand(ix, opinion ? topical : tokens(q));
  const lex = bm25(ix, terms);
  const tri = triCos(ix, terms.filter((t) => t.kind !== 'expanded').map((t) => t.term).join(' ') + ' ' + q);
  const fused = fuse(lex, tri);

  // confidence: how much of the question (by IDF weight) the best lexical match covers,
  // blended with how close it is in subword space
  const core = terms.filter((t) => t.kind !== 'expanded');
  const coreIdf = core.reduce((a, t) => a + idf(ix, t.term) * t.w, 0) || 1;
  const coverage = (i: number) => {
    const m = ix.tf[i];
    let got = 0;
    for (const t of core) if (m.has(t.term)) got += idf(ix, t.term) * t.w;
    // credit an expanded hit at a fraction, so "cv" still finds "computer vision"
    for (const t of terms) if (t.kind === 'expanded' && m.has(t.term) && !core.some((c) => m.has(c.term) && c.term === t.from)) got += idf(ix, t.term) * 0.35;
    return Math.min(1, got / coreIdf);
  };
  const topLex = lex[0]?.i;
  const confidence = topLex == null
      ? 0
      : Math.max(...fused.slice(0, 3).map((r) => coverage(r.i))) * 0.75 + (tri[0]?.score ?? 0) * 0.5;

  const answered = confidence >= threshold && fused.length > 0;
  const picked: number[] = [];
  if (answered) {
    const perSource = new Map<string, number>();
    const floor = fused[0].score * 0.55;
    for (const r of fused) {
      if (picked.length >= 3 || r.score < floor) break;
      const s = ix.recs[r.i].s;
      if ((perSource.get(s) ?? 0) >= 2) continue;
      if (coverage(r.i) < 0.34) continue;
      perSource.set(s, (perSource.get(s) ?? 0) + 1);
      picked.push(r.i);
    }
    if (!picked.length) picked.push(fused[0].i);
  }

  return {
    ...base,
    intent: opinion && answered ? 'opinion' : 'search',
    terms, bm25: lex.slice(0, 5), tri: tri.slice(0, 5), fused: fused.slice(0, 6), picked,
    confidence: Math.min(1, confidence), answered,
    ms: performance.now() - t0,
  };
}

/**
 * "Should I hire him?" has no facts to match, so it is rewritten into evidence queries
 * (multi-query retrieval) and the best card for each one is quoted.
 */
const EVIDENCE = ['shipped live real users students', 'team lead led interns officer', 'AI engineering intern Unisys automation'];
function evidence(ix: Index, base: Result, t0: number): Result {
  const terms: Term[] = [];
  const picked: number[] = [];
  let lexAll: Ranked[] = [], triAll: Ranked[] = [], fusedAll: Ranked[] = [];
  for (const sub of EVIDENCE) {
    const t = tokens(sub).map((term) => ({ term, w: 1, kind: 'expanded' as const, from: 'evidence' }));
    terms.push(...t.filter((x) => !terms.some((y) => y.term === x.term)));
    const lex = bm25(ix, t), tri = triCos(ix, sub), fused = fuse(lex, tri);
    const pick = fused.find((r) => !picked.includes(r.i) && !picked.some((p) => ix.recs[p].s === ix.recs[r.i].s));
    if (pick) picked.push(pick.i);
    lexAll = lexAll.concat(lex.slice(0, 2)); triAll = triAll.concat(tri.slice(0, 2)); fusedAll = fusedAll.concat(fused.slice(0, 2));
  }
  const byScore = (a: Ranked, b: Ranked) => b.score - a.score;
  return {
    ...base, intent: 'opinion', terms, picked,
    bm25: lexAll.sort(byScore).slice(0, 5), tri: triAll.sort(byScore).slice(0, 5), fused: fusedAll.sort(byScore).slice(0, 6),
    confidence: picked.length / EVIDENCE.length, answered: picked.length > 0, ms: performance.now() - t0,
  };
}

export function stats(ix: Index) {
  return { passages: ix.N, terms: ix.vocab.length, sources: ix.sources };
}

/** Terms to highlight in a quoted passage. */
export function marks(terms: Term[]): Set<string> {
  return new Set(terms.filter((t) => t.kind !== 'expanded' || t.w > 0.4).map((t) => t.term));
}
