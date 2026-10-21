// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://paramsn37-sketch.github.io/portfolio_psn/
// Override with SITE_URL / BASE_PATH env vars (e.g. BASE_PATH=/ for a custom domain).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://paramsn37-sketch.github.io',
  base: process.env.BASE_PATH ?? '/portfolio_psn',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
