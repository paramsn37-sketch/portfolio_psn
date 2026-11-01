import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import * as brands from 'simple-icons';

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

/** Path data of a Simple Icons brand mark (24×24, filled), by slug. */
export function brandPath(slug: string): string {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof brands;
  const icon = brands[key] as { path?: string } | undefined;
  if (!icon?.path) throw new Error(`Unknown brand icon "${slug}"`);
  return icon.path;
}

/** Official colour of a Simple Icons brand mark, as #rrggbb. */
export function brandHex(slug: string): string {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof brands;
  return `#${(brands[key] as { hex: string }).hex}`;
}
