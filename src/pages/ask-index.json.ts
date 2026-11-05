import type { APIRoute } from 'astro';
import { buildCorpus } from '@/lib/ask/corpus';

/** The archivist's card catalogue: every passage on the site, with its source. Fetched on first open. */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ v: 1, base: import.meta.env.BASE_URL, built: new Date().toISOString().slice(0, 10), recs: await buildCorpus() }), {
    headers: { 'Content-Type': 'application/json' },
  });
