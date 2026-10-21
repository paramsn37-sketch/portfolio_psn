---
name: The Personal Archive
description: Param S N's portfolio as a lamplit walnut desk that opens into a warm paper archive.
colors:
  paper: "#f3efe3"
  paper-2: "#ebe5d5"
  paper-3: "#e2dbc8"
  card: "#f8f5ec"
  linen: "#d8d1c0"
  linen-2: "#c9c0ab"
  kraft: "#c8a979"
  kraft-2: "#b8955f"
  note: "#f1dc8f"
  ink: "#252522"
  ink-2: "#4a4840"
  ink-3: "#6b685e"
  olive: "#737b58"
  olive-deep: "#5a6240"
  olive-ink: "#4c5434"
  olive-wash: "#dfe0cc"
  blue: "#315d86"
  blue-deep: "#244766"
  blue-wash: "#d9e1e6"
  red-string: "#a3352b"
  wood: "#2a1a0e"
  wood-deep: "#140b05"
  lamp: "#ffe2a8"
  lamp-ink: "#f3e6cc"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(4.25rem, 2.2rem + 9.2vw, 11.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 2rem + 5.6vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)"
    fontWeight: 650
    lineHeight: 1.2
  body:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
  hand:
    fontFamily: "Reenie Beanie, Segoe Print, cursive"
    fontSize: "clamp(1.375rem, 1.2rem + 0.7vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.02
  pixel:
    fontFamily: "DotGothic16, Martian Mono, monospace"
    fontSize: "clamp(2.25rem, 1.4rem + 2.8vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"
rounded:
  r-1: "2px"
  r-2: "4px"
  r-3: "6px"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4rem"
  s-9: "6rem"
  s-10: "8rem"
  s-11: "11rem"
  gutter: "clamp(1.25rem, 0.8rem + 1.6vw, 2rem)"
  chapter-gap: "clamp(6rem, 3rem + 9vw, 11rem)"
components:
  button-primary:
    backgroundColor: "{colors.olive-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.r-2}"
    padding: "0 1.15em"
    height: "2.875rem"
  button-primary-hover:
    backgroundColor: "{colors.olive-ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-2}"
    padding: "0 1.15em"
    height: "2.875rem"
  button-ghost-hover:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.r-2}"
    padding: "0 1.15em"
    height: "2.875rem"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 0.85em"
    height: "2rem"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.r-1}"
    padding: "0.2em 0.6em"
  link:
    textColor: "{colors.blue}"
  sheet:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.r-1}"
  sticky-note:
    backgroundColor: "{colors.note}"
    textColor: "{colors.ink}"
    typography: "{typography.hand}"
    padding: "1rem 1.1rem"
---

# Design System: The Personal Archive

## Overview

**Creative North Star: "The Archive Under the Lamp"**

Two lit worlds joined by one camera move. The start page is a walnut desk at night: dark wood falling into shadow, a warm pool of lamplight, kraft folders, a compass, a photo stack, and a taped paper sheet at the centre. Choosing anything on the desk zooms the camera into the paper, and the paper becomes the archive: warm, grainy pages with linen rules, olive controls, archive-blue ink and sticky-note yellow, organised into numbered chapters 00 to 06 behind a sticky chapter rail.

Underneath the objects, the page is an ordinary website. Scrolling is plain vertical scroll, every chapter and project has a URL, and every visible control does something. The owner's brief sets the balance at about 70% clean functional surface, 20% scrapbook and editorial (tape, polaroids, clips, folders, handwriting) and 10% retro and playful (an OS window, a cassette, a pixel greeting). The build keeps to that balance. Body text, controls and navigation stay clean, and the paper objects frame them without replacing them.

Paper objects carry depth through soft, warm, layered shadows and small tilts. Nothing glows except lamplight. A fine paper grain is multiplied over the whole archive, and the notebook grid appears only on small inset surfaces.

**Key Characteristics:**
- Night desk (wood, lamp, brass, kraft) as the threshold; warm paper as the archive.
- Condensed 900-weight uppercase display set very large and tight against a clean grotesk body.
- Martian Mono for every number, date, label and piece of metadata.
- Reenie Beanie handwriting for asides, rotated a few degrees, always in ink-2 or archive blue.
- Physical paper vocabulary: sheet, polaroid, tape, sticky note, folder, dossier, stamp, paper clip.
- Small tilts (about -1.4deg to 0.9deg) that straighten on hover.

## Colors

A warm, low-chroma paper palette with one olive voice for action, one blue voice for ink and links, and a dark walnut-and-lamp palette that exists only on the desk.

### Primary
- **Field Olive** (olive): Brand olive, pinned by the brief. Used for shapes: folder fronts, window title bars, the home folder icon, large type. It never fills a surface that carries small text.
- **Deep Olive** (olive-deep): The fill for anything carrying small text: the primary button, the active rail dot and progress fill, the nav indicator, chapter numbers. It gives AA contrast (5.6:1 with paper text) where brand olive cannot.
- **Olive Ink** (olive-ink): Olive used as text, and the hover state of the primary button.
- **Olive Wash** (olive-wash): The halo ring around the active chapter dot and active row tints.

### Secondary
- **Archive Blue** (blue): Ink annotations. Links, handwritten blue asides, focus rings, the text caret, the dashed route on maps, and the faint lines of the notebook grid (at 7.5% alpha).
- **Deep Archive Blue** (blue-deep) and **Blue Wash** (blue-wash): The blue tonal pair for pressed and tinted states and the lanyard stitching.

### Tertiary
- **Sticky Yellow** (note): Sticky notes, the text selection colour, hover labels on desk objects, and chapter numbers on dark grounds.
- **Kraft** (kraft, kraft-2): Manila folders and dossier cards, with grain multiplied over them.
- **Red String** (red-string): Corkboard string, the dossier "Filed" stamp, the recording light, the end pin on maps. Used sparingly, in small marks only.

### Neutral
- **Archive Paper** (paper): The page ground of the archive and the desk sheet.
- **Paper Tones** (paper-2, paper-3): Inset surfaces, ghost and chip hover fills, pressed states.
- **Lifted Card** (card): Sheets, cards and grid-paper surfaces sitting above the page.
- **Linen** (linen, linen-2): Hairline rules, chip and tag outlines, the rail track, tape, the scrollbar thumb.
- **Ink** (ink, ink-2, ink-3): Text in three steps: primary, secondary (7.9:1), metadata (4.8:1). Ink is also the selected chip fill and the ground of the final contact chapter.
- **Walnut** (wood, wood-deep): Desk-only. The wood under the scene and the darkness the lamp falls into.
- **Lamp** (lamp, lamp-ink): Desk-only. Lamplight glow, desk chrome text and focus colour on the dark desk.

### Named Rules
**The Shape-versus-Text Olive Rule.** Brand olive (#737B58) is for shapes and large type. Any olive fill that carries text under display size uses Deep Olive (#5A6240). Olive text uses Olive Ink.

**The Two Inks Rule.** Olive means "act" (buttons, the active chapter). Blue means "written by hand or linked" (links, annotations, focus). Neither takes the other's job.

**The Desk Stays on the Desk Rule.** Walnut and lamp colours exist only on the start page and its dark chrome. The archive is paper. The single dark archive surface is the ink-ground contact chapter.

## Typography

**Display Font:** Big Shoulders Display, 800 and 900 (with Arial Narrow)
**Body Font:** Hanken Grotesk Variable (with system-ui)
**Label/Mono Font:** Martian Mono, 400 and 500
**Hand Font:** Reenie Beanie
**Pixel Font:** DotGothic16

**Character:** The five type roles are pinned by the brief, and each has a single job. A loud, condensed, uppercase display voice sits over a quiet, very legible grotesk. Mono carries the filing system (numbers, dates, paths, labels). Handwriting carries the person's asides. The pixel face appears once, for the greeting.

### Hierarchy
- **Display** (900, the name scale up to 11.5rem, line-height 0.88, -0.012em, uppercase): The name, on the desk sheet (about 12.5% of sheet width), in the archive opener and at the foot of the contact chapter.
- **Headline** (900, chapter scale up to 7.5rem, line-height 0.88, uppercase): Chapter titles, with the mono chapter number set top-aligned before the word in Deep Olive. Case-study titles (up to 6.5rem) and featured project titles (up to 3.25rem) use the same face at smaller steps.
- **Title** (Hanken 650 to 700, 1.125rem to 1.625rem, line-height 1.2): Card titles, timeline entries, project-card names.
- **Body** (400, 16 to 17px, line-height 1.6, prose max 66ch): Running text. The lead (17 to 21px, max 38ch) introduces chapters. Numerals are tabular everywhere.
- **Label** (Martian Mono 400 to 500, 11 to 12px, 0.04 to 0.08em, uppercase): Metadata, tags, chips, buttons (12px, 500, 0.02em, sentence case), section sub-headings inside chapters (12px, 0.08em, ink-2), dates, file paths, chapter counters.
- **Hand** (Reenie Beanie 400, 22 to 30px, line-height 1.02): Notes beside chapter titles, polaroid captions, sticky notes, desk hover labels. Rotated about -2deg to -5deg.
- **Pixel** (DotGothic16 400, 36 to 60px): The "Hi, I'm Param." greeting in the About chapter, followed by a blinking caret.

### Named Rules
**The One Greeting Rule.** DotGothic16 is reserved for the name greeting. It never sets a heading, label or body line.

**The Filing-System Rule.** Every number, date, path, counter and tag is set in Martian Mono. Display numerals are not used for metadata.

**The Hand Is an Aside Rule.** Handwriting annotates; it never carries required information alone. Hand notes beside headings are `aria-hidden` decoration or are repeated elsewhere.

## Layout

The archive is a two-column frame. A sticky chapter rail (13.5rem) sits on the left, below a fixed 4rem top bar, and content runs in a centred wrap capped at 82rem with a fluid gutter (1.25rem to 2rem). Chapters are separated by a large fluid gap (6rem to 11rem). Spacing runs on a 4px base (0.25rem to 11rem).

Inside chapters, composition is a collage. Paper objects (polaroids, sheets, the ID pass, folders, sticky notes) overlap at small angles around a clean text column. Headings and body text stay straight; only objects tilt.

The desk is a single viewport (100dvh, no page scroll). A centred stage sized to `min(58vw, 1000px, 122dvh)` at a 1000:645 ratio holds the sheet, and desk objects are positioned in units of that stage width. On screens up to 760px wide, or narrower than 4:5, the sheet becomes a tall page. The drawn route map gives way to a compact three-column chapter list under a dashed blue rule, and the actions become a two-column grid with the primary button spanning both. In the archive at 900px and below, the top-bar navigation collapses into a menu button that opens a drawer.

### Named Rules
**The Grid Is a Surface Rule.** The notebook grid (22px cells, archive blue at 7.5%, on card) is applied to small inset surfaces only: the retro desktop window screen and the process sketch in Working Mind, the journal pages in Life, and the small route-map scrap in About. It is never a page or section ground.

## Elevation & Depth

Depth is physical paper under warm light. Shadows are layered: a tight contact shadow plus a long, soft, negative-spread drop, tinted warm brown (rgb 60 45 20) in the archive and pure black on the desk. Surfaces rest at `shadow-paper` and rise to `shadow-lift` on hover as tilted objects straighten and lift 6px. A fine grain texture is multiplied over the whole archive at 32% opacity. On the desk, hover adds a warm lamplight glow (rgb 255 214 140) under the object, never a coloured or neon one.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 1px 1px rgb(60 45 20 / 0.06), 0 3px 8px -2px rgb(60 45 20 / 0.12)`): Resting sheets, cards, insets.
- **Lift** (`box-shadow: 0 2px 2px rgb(60 45 20 / 0.05), 0 14px 28px -10px rgb(60 45 20 / 0.28)`): Polaroids at rest; cards on hover or focus.
- **Float** (`box-shadow: 0 4px 6px rgb(40 30 15 / 0.08), 0 28px 60px -18px rgb(40 30 15 / 0.42)`): Drawers and modal sheets.
- **Desk** (`box-shadow: 0 2px 3px rgb(0 0 0 / 0.35), 0 18px 40px -12px rgb(0 0 0 / 0.65)`): Objects lying on the walnut desk.

### Named Rules
**The Lamplight-Only Glow Rule.** The only glow in the system is warm lamplight on the desk. Paper surfaces lift; they do not glow.

## Shapes

Corners are barely rounded, like cut paper. Sheets and cards use 2 to 3px, controls 4px, and windows and folders 6px. Pills (999px) are used only for filter chips; circles are used for rail dots, map stops and the card arrow. Folder and dossier tabs use asymmetric corners (for example 2px 6px 6px 6px) so the tab reads as part of the folder. Borders are rare: hairlines are 1px linen, outlines are drawn as inset box-shadows, and the retro window is outlined with a 1.5px ink stroke. Tape strips have masked ragged ends.

## Components

### Buttons
Mono-labelled, compact, with a slight bevel, like a stamped control on a file.
- **Shape:** Gently squared (4px), min height 2.875rem, icon and label with a 0.6em gap.
- **Primary:** Deep Olive fill, paper text, Martian Mono 12px 500. A soft bevel comes from an inset top highlight and a short olive drop.
- **Hover / Focus:** Fill deepens to Olive Ink, and an arrow icon nudges 3px right. Press scales to 0.97 over 160ms on ease-out. Focus shows a 2px archive-blue outline at 3px offset.
- **Ghost:** Transparent with a 1px ink-3 inset outline; on hover it fills with paper-2 and the outline darkens to ink.
- **Ink:** Ink fill with paper text, used on paper where olive would compete.

### Chips
- **Style:** Pill, transparent, 1px linen-2 inset outline, mono 11px in ink-2, min height 2rem.
- **State:** Selected (`aria-pressed`) fills with ink and paper text. Hover fills with paper-2. Press scales to 0.96.

### Tags
Small mono uppercase labels (11px, 0.04em) with a 2px radius and a linen-2 inset outline. They mark project technologies and years.

### Cards / Containers
- **Corner Style:** 2 to 3px for paper, 6px for window cards.
- **Background:** Card (#f8f5ec) for paper; kraft for dossiers; a warm grey with an olive title bar for window cards.
- **Shadow Strategy:** Paper at rest, Lift on hover and focus (see Elevation & Depth).
- **Border:** None on paper; a 1.5px ink stroke on the retro window.
- **Internal Padding:** 0.6rem around media, 0.9rem body.
- **Behaviour:** Project cards share one anatomy (cover, title, tagline, tags, year, round arrow) across three treatments: pinned print, manila dossier with a red "Filed" stamp, and retro OS window. Each card tilts by its index and straightens with a 6px lift on hover. The cover and title carry view-transition names into the case study.

### Navigation
- **Top bar:** Fixed, 4rem, paper at 94% opacity with a linen-2 hairline. Left to right: a folder icon (returns to the desk; its front flap tips open on hover), the underlined mono wordmark, a hairline rule, chapter links (Hanken 14px, ink-2 to ink), a 2px Deep Olive sliding indicator, and a mono "03 / 06" counter. At 900px and below, the links collapse into a menu button that opens a drawer.
- **Chapter rail:** Sticky in the left column. Each row is a dot, a mono number and a label. The active row is ink 600 with a Deep Olive dot and an olive-wash halo, scaled 1.15. A 1px linen track fills with Deep Olive as the reader scrolls. The foot holds a compass, a handwritten note and a "Back to top" link.

### Sheet, Polaroid, Tape and Sticky Note (signature)
The shared paper vocabulary. The sheet is a card surface with Paper shadow and a 2px radius. The polaroid has a #fbf9f3 frame with a deep bottom margin for a handwritten caption, and Lift shadow. Tape is a translucent linen strip with masked ends, rotated a few degrees. The sticky note is note yellow with handwriting and a short warm drop. Placeholder notes for missing content are set on sticky notes so they read as honest notes.

### Desk Objects (signature)
Each object on the walnut desk is a link to a chapter. On hover or focus it lifts, scales to 1.04 and gains a lamplight drop-shadow, and a handwritten label appears on a yellow tab above it. On touch screens the labels are always visible. Choosing an object zooms the camera into the sheet and fades to paper.

### Drawers and Modals
Native `<dialog>`. Drawers slide in from the right (up to 34rem) on ease-drawer over 450ms, on paper with Float shadow. Modals rise 14px from 0.98 scale. The backdrop fades to ink at 38%. Under reduced motion, both fade instead of moving.

### Motion
All motion uses Emil Kowalski's curves: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, drawer `cubic-bezier(0.32, 0.72, 0, 1)`. Durations are 160ms for presses, 200ms for colour, 280ms for movement and 450ms for drawers. Content rises 22px into view, but stays visible when JS is off. Every transition has a reduced-motion fallback.

## Do's and Don'ts

### Do:
- **Do** use Deep Olive (#5A6240) for any filled control that carries text, and keep brand olive (#737B58) for shapes and large type.
- **Do** set numbers, dates, counters, paths and tags in Martian Mono.
- **Do** put new chapter headings in the chapter-title pattern: a mono number in Deep Olive set before a 900-weight uppercase Big Shoulders word, an optional mono sub-line below, and an optional rotated handwritten aside.
- **Do** tilt paper objects slightly (under 1.5deg) and straighten them on hover with the Lift shadow.
- **Do** keep text columns straight and readable (prose 66ch, lead 38ch) inside the collage.
- **Do** use the motion tokens (press 0.97 at 160ms, ease-out) and give every transition a reduced-motion fallback.
- **Do** mark missing content with honest placeholders and sticky-note demo notes.

### Don't:
- **Don't** use DotGothic16 for anything except the name greeting.
- **Don't** lay the notebook grid across a whole page or section; it belongs on small inset paper surfaces.
- **Don't** use walnut or lamp colours in the paper archive.
- **Don't** add coloured or neon glows; the only glow is warm lamplight on the desk.
- **Don't** put a mono meta line above a heading as an eyebrow; mono sub-lines go below the title.
- **Don't** hide required information inside handwriting or behind an animation.
