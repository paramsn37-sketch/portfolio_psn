# Making the archive yours

Every word and picture on the site comes from two places. You never need to touch a component to change content.

| What | Where |
| --- | --- |
| Your name, intro, facts, links, timeline, skills, life, journal, playlist, "what's next" | `src/data/site.ts` |
| One case study per project | `src/content/projects/<slug>.md` |
| Your images | `public/images/…` (referenced as `/portfolio_psn/images/…`) or `src/assets/…` |

Anything still marked **DEMO** is placeholder copy. Search the project for `DEMO` to find every line left to replace.

## 1. Text

Open `src/data/site.ts` and edit the values. The file is commented section by section:

- `profile` — name, greeting, tagline, intro, role line, About paragraph, traits, quick facts (lanyard card), "hats", the long story drawer, and the quote in the mobile menu.
- `links` — **replace `email` first** (the contact console and every mail link use it), then LinkedIn, X, Instagram, Spotify and résumé.
- `timeline` — chapter 02. Each milestone has `year`, `title`, `kind`, `body`, `lesson` (the note that unfolds) and an optional `turning: true` for a red turning-point pin.
- `toolbox`, `process`, `experiments`, `learning` — chapter 04 (the desktop folders, the "how I work" loop, the experiment cards, `learning.txt`).
- `topics`, `vibes`, `moments`, `journal`, `playlist` — chapter 05. Delete any topic that isn't true for you; the grid adapts.
- `next` — chapter 06: what you're exploring, what you're open to, and the three email intents (subject + opening line) the console writes for visitors.

## 2. Images

Every image slot is a dashed "Replace me" frame. To fill one, give it a `src`:

```ts
// src/data/site.ts
portrait: { src: '/portfolio_psn/images/portrait.jpg', alt: 'Param on a terrace in Bengaluru', ratio: '4 / 5' },
```

Put the file in `public/images/`. Keep the `alt` text descriptive — it's what screen readers read. Suggested sizes (WebP or JPEG, under ~300 KB each):

| Slot | Ratio | Size |
| --- | --- | --- |
| Hero photo (chapter 00), portrait (01) | 4:5 | 1000 × 1250 |
| Timeline photos, moments, topic photos | 1:1 or 4:3 | 800 px wide |
| Project cover | 16:10 | 1600 × 1000 |
| Case-study hero | 2:1 | 2000 × 1000 |
| Journal images | 4:3 | 1200 × 900 |

Slots that are drawn inside components (desk polaroids, the ID-card photo, banner photo) use the `Placeholder` component directly; pass `src="…"` to it in the component file, or ask Claude to wire them to `profile`.

## 3. Projects

Each file in `src/content/projects/` is one case study and one card. The front matter at the top drives the card and the sidebar; the Markdown below is the story.

```yaml
---
title: PlaceRocket
tagline: Logistics & warehousing platform
summary: One line that sells it.
year: '2025'
categories: [Web]          # Web, Mobile, AI/ML, Design, Other — drives the filters
tags: [Web, Full Stack]
role: Full-stack developer
stack: [Astro, FastAPI, Postgres]
featured: true             # exactly one project should be featured
order: 1                   # position in "Featured" sort
cardStyle: paper           # paper | dossier (manila folder) | window (retro OS window)
annotation: Built for scale  # handwritten note on the card and case study
cover: { src: /portfolio_psn/images/placerocket-cover.webp, alt: PlaceRocket dashboard }
keyFeatures:
  - { icon: route, text: Route & queue optimisation }   # icon = any Lucide icon name
gallery:
  - { src: /portfolio_psn/images/pr-architecture.webp, alt: Architecture diagram, caption: How orders flow }
links: { live: 'https://…', repo: 'https://github.com/…' }   # '#' shows a disabled "soon" button; omit to hide
demo: false                # set false to remove the yellow "demo case study" note
---

## Overview
…
## Problem
…
```

Every `##` heading becomes a tab in the case study's sticky section bar. To add a project, copy any file, rename it (the file name is the URL), and edit.

**Only write outcomes that really happened.** If a project has no measured results yet, delete the Results section rather than inventing numbers.

## 4. Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/portfolio_psn/
npm run build      # production build into dist/
```

## 5. Deploy

Pushing to `main` deploys automatically through `.github/workflows/deploy.yml`. One-time setup on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site then lives at `https://paramsn37-sketch.github.io/portfolio_psn/`.

Using a custom domain or a `username.github.io` repo instead? Set `BASE_PATH=/` (and `SITE_URL`) in the workflow's build step.
