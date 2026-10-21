# The Personal Archive — build plan & checkpoints

Owner: Param S N · Stack: Astro + TypeScript → GitHub Pages · Built unattended overnight; every decision below was made by Claude and is open to change.

## 1. Concept in one line

You start at Param's desk at night under a lamp. On it lies a hand-drawn map of his journey. Choose where to go — and the camera drops into the paper, which becomes the archive.

## 2. Routes

| URL | What it is |
| --- | --- |
| `/` | **The Desk** — illustrated top-down desk scene, three choices on the central sheet |
| `/archive/` | **The Archive** — the scrolling journey, chapters 00–06 (the five-mockup template) |
| `/archive/#about` … `#contact` | Deep links to every chapter (updated as you scroll) |
| `/archive/projects/<slug>/` | A full case-study page per project (shareable, searchable) |
| `/404` | "This page was misfiled" |

## 3. The journey (chapter → signature device → borrowed reference, in small doses)

| # | Chapter | Main composition (from the 5 mockups) | Small-dose borrowing |
| --- | --- | --- | --- |
| — | The Desk | Dark walnut desk, lamp pool, central map sheet, objects that lift on hover and act as shortcuts | Hands-on-a-desk illustration (mood only, all objects redrawn originally) |
| 00 | Enter the Archive | Big name, intro, Explore button, polaroid collage + clip + note, Quick Access folders | Fanned card stack (pixel-designer ref) on the folders |
| 01 | The Person | Portrait collage, pixel name, tags, Quick Facts, "Read my story" drawer | Lanyard ID card that swings (kraft-dossier ref); stacked folder tabs of roles ("life into folders" ref) |
| 02 | My Story | Journey timeline with milestones and photos | Ink route line drawn as you scroll + coordinates/annotations (Santorini sketchbook ref); red string between turning points (corkboard ref) |
| 03 | Things I've Built | Huge PROJECTS headline, filters, featured project, archive cards → case studies | One card styled as a manila dossier, one as a retro window |
| 04 | Working Mind | Toolbox, process, experiments, learning | Retro desktop with folder icons & openable windows (C:\ desktop ref); process drawn as a sketch flow (desk-sketch ref) |
| 05 | Life Outside Work | LIFE & INTERESTS collage, topics, recent moments, journal list | Topics as a pinboard with red string (corkboard ref); journal page-flip; cassette player on Music (analog-media ref) |
| 06 | What Comes Next | Exploring now, open to, links, contact | Analog console: toggle what you're here for → composes the email (Grand Leisure ref) |

## 4. Global systems

- **Top bar**: folder mark → back to desk · wordmark · chapter links · live chapter label (`03 / 06`).
- **Chapter rail** (desktop): numbered list with a progress line that fills as you read; current dot inks in.
- **Mobile**: compact bar + full navigation panel (mockup 04) with the quote card.
- **Drawers & dialogs**: story drawer, topic collections, journal entries, OS windows — all with Esc/close, focus trap, return focus.
- **History**: chapter hash via `replaceState`; dialogs push a hash so Back closes them.

## 5. Components (reusable)

Paper · Polaroid · Tape · PaperClip · HandNote · Placeholder (image icon + "replace me") · Folder · Chip/FilterChips · Button (primary/secondary) · ChapterHeading · ProjectCard · FeaturedProject · TimelineItem · OsWindow · Drawer · Dialog · Cassette · Console · Icon (Lucide SVGs).

## 6. Content separation

`src/data/site.ts` (profile, links, chapters, timeline, skills, life, journal) and `src/content/projects/*.md` (one file per case study). Components never hard-code personal text. See `CONTENT.md`.

## 7. Motion grammar (Emil Kowalski standards)

- Curves: `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-in-out: cubic-bezier(.77,0,.175,1)`, `--ease-drawer: cubic-bezier(.32,.72,0,1)`.
- Press `scale(.97)` 160ms · hover lift 200ms · popovers 200ms from their trigger · drawers 450ms · desk→archive zoom 900ms (rare, one-time = allowed delight) · page-flip 550ms.
- Transform/opacity/clip-path only; hover gated to `(hover:hover) and (pointer:fine)`; never from `scale(0)`; reduced-motion keeps fades, drops travel.

## 8. Skill conflicts, resolved (brief wins)

The taste skill bans monospace labels, index numbers, hairline grids, tracked caps and accent words; Impeccable bans eyebrows above headings and section numbers. Your brief and mockups explicitly require chapter numbers 00–06, monospace metadata, notebook grids and handwritten accents, so those stay — but used with discipline: chapter numbers carry real order, mono only for metadata, no eyebrow labels stacked on headings (the chapter number sits *inside* the heading line). Taste's "≥4 real photos" floor is waived because you asked for placeholders.

## 9. Phases & checkpoints

| Phase | Scope | Checkpoint |
| --- | --- | --- |
| 0 | Tools: Impeccable, Emil Kowalski skills, taste skill, Playwright (bundled Chromium) | ✅ |
| 1 | Direction, architecture, this plan | ✅ |
| 2 | Astro scaffold, tokens, fonts, textures, data layer, nav system | ✅ |
| 3 | Desk + chapters 00–02 | ✅ |
| 4 | Chapter 03 + case-study route | ✅ |
| 5 | Chapters 04–06 | ✅ |
| 6 | Motion pass, a11y, Playwright QA at 1440/768/390, Impeccable detector + audit, taste inspector, independent finish review (verdict: ship) | ✅ |
| 7 | Deploy workflow, CONTENT.md, DESIGN.md, push | ✅ |
