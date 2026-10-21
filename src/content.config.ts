import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const CATEGORIES = ['Web', 'Mobile', 'AI/ML', 'Design', 'Other'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    year: z.string(),
    categories: z.array(z.enum(CATEGORIES)).min(1),
    tags: z.array(z.string()).default([]),
    role: z.string(),
    team: z.string().optional(),
    duration: z.string().optional(),
    stack: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    /** Visual treatment of the archive card: plain paper, manila dossier or retro OS window */
    cardStyle: z.enum(['paper', 'dossier', 'window']).default('paper'),
    /** Handwritten note pinned to the case-study hero */
    annotation: z.string().optional(),
    cover: z.object({ src: z.string().optional(), alt: z.string() }),
    keyFeatures: z.array(z.object({ icon: z.string(), text: z.string() })).default([]),
    links: z
      .object({ live: z.string().optional(), repo: z.string().optional(), design: z.string().optional() })
      .default({}),
    demo: z.boolean().default(true),
  }),
});

export const collections = { projects };
