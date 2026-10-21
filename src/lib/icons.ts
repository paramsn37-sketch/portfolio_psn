import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const dir = join(dirname(require.resolve('lucide-static/package.json')), 'icons');
const cache = new Map<string, string>();

/** Inner markup of a Lucide icon (paths only), read at build time. */
export function lucide(name: string): string {
  if (cache.has(name)) return cache.get(name)!;
  let inner = '';
  try {
    const svg = readFileSync(join(dir, `${name}.svg`), 'utf8');
    inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  } catch {
    throw new Error(`Unknown icon "${name}"`);
  }
  cache.set(name, inner);
  return inner;
}
