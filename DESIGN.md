---
name: Alessandro Bruno
description: Personal site of a Systems & Product Engineer — a quiet editorial journal of systems work, not a product landing page.
colors:
  canvas: "oklch(0.96 0.008 264)"
  surface: "oklch(0.995 0.004 264)"
  fg: "oklch(0.24 0.03 264)"
  muted: "oklch(0.48 0.03 264)"
  accent: "oklch(0.48 0.22 264)"
  on-accent: "oklch(0.99 0.004 264)"
  overlay: "color-mix(in oklch, var(--fg) 38%, transparent)"
  canvas-dark: "oklch(0.07 0.006 264)"
  surface-dark: "oklch(0.13 0.01 264)"
  fg-dark: "oklch(0.94 0.01 260)"
  muted-dark: "oklch(0.68 0.016 260)"
  accent-dark: "oklch(0.72 0.16 260)"
  on-accent-dark: "oklch(0.12 0.02 264)"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "clamp(2.75rem, 4vw + 1.8rem, 5.5rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: '"opsz" 144, "SOFT" 0, "WONK" 0'
  headline:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.75rem"
    fontWeight: 300
    lineHeight: 1.15
  title:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
  lede:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Fraunces, Iowan Old Style, Palatino Linotype, Palatino, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  14: "56px"
  section: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.on-accent}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-chrome:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    typography: "{typography.body}"
  chip-keybind:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.label}"
  chip-availability:
    backgroundColor: "color-mix(in oklch, var(--accent) 10%, transparent)"
    textColor: "{colors.accent}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    typography: "{typography.label}"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "20px"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
  nav-toc-active:
    backgroundColor: "color-mix(in oklch, var(--accent) 10%, transparent)"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "36px"
---

# Design System: Alessandro Bruno

Personal site of Alessandro Bruno, Systems & Product Engineer. This document is the visual source of truth for [alessandrobrunoh.it](https://alessandrobrunoh.it). It describes this site only: not a SaaS product, not a trading terminal, not a generic developer portfolio kit.

Canonical tokens live in `src/styles.css` (`:root` / `.dark` and the Tailwind `@theme` block). If prose and code disagree, the CSS wins.

## 1. Overview

**Creative North Star: "The Quiet Journal"**

A typeset lab notebook left open on a desk. Cool paper, ink that leans indigo, a last name underlined in a single stroke. The human voice is Fraunces (soft optical-size serif, never bold). The machine voice is DM Mono (indexes, keybinds, paths, chips). Color is almost absent: one indigo signal marks where to look, then gets out of the way.

This is a long-form personal site, not a product. The page is a numbered journal (01 Intro through 09 Contact) with a sticky table of contents, not a marketing funnel. Light mode is the default reading light; dark mode is the same journal after the lamp is switched off, not a different brand. A faint paper grain sits on every surface.

The system rejects: midnight-fintech editorial (Altitude, Bloomberg-on-a-landing-page), Inter/Baskerville dashboards, geometric-sans AI-tool chrome, neon-on-black "hacker" portfolios, glassmorphism as decoration, gradient meshes, 3D orbs, identical icon+heading card grids, and any accent besides the indigo signal.

**Key Characteristics:**

- Light-first paper canvas; dark is a second lighting of the same hue (264), not a second identity.
- Dual type: Fraunces for sentences, DM Mono for indexes and chrome.
- One accent. Used as punctuation (numbers, underlines, focus, primary CTA), never as a wash.
- Hairline structure: 1px `color-mix` borders do the work shadows do elsewhere. Lift only on hover and dialogs.
- Numbered sections and a sticky TOC. The site reads top to bottom like a document.
- Motion is scroll-tied and ease-out-quart. No bounce. `prefers-reduced-motion` kills choreography.
- Bilingual EN/IT. Copy changes; the visual system does not.

**Page shell.** `max-w-6xl` centered. From `lg`: two columns, `15rem` sticky TOC + fluid main, `gap-16`, `px-6`, `py-12`. Sections divide with `border-t border-fg/10` and `pt-14`. A 2px accent scroll-progress bar is pinned to the top of the viewport.

## 2. Colors

Tinted neutrals toward hue 264, plus one indigo signal. Every color is OKLCH. Never `#000` or `#fff`. Browser chrome approximations: light `#eceef4`, dark `#0b0c10`.

### Primary

- **Indigo Signal** (`oklch(0.48 0.22 264)` light / `oklch(0.72 0.16 260)` dark): the only chromatic color. Section indexes (`01`), TOC active state, name underline, availability dot, primary CTA, focus ring, chart fills, hover arrows. On dark canvases the signal lightens and loses chroma so it still reads as a mark, not a neon.

### Neutral

- **Paper Canvas** (`oklch(0.96 0.008 264)` / dark `oklch(0.07 0.006 264)`): page background. Cool, slightly blue-gray paper, never warm cream, never pure white.
- **Sheet** (`oklch(0.995 0.004 264)` / dark `oklch(0.13 0.01 264)`): cards, chips, dialogs. One step above the canvas.
- **Ink** (`oklch(0.24 0.03 264)` / dark `oklch(0.94 0.01 260)`): headlines, names, primary sentences.
- **Graphite** (`oklch(0.48 0.03 264)` / dark `oklch(0.68 0.016 260)`): ledes, helper text, inactive nav, placeholders.
- **On Signal** (`oklch(0.99 0.004 264)` / dark `oklch(0.12 0.02 264)`): text and icons sitting on the filled accent CTA.
- **Overlay** (`color-mix(in oklch, var(--fg) 38%, transparent)` light / canvas 82% dark): dialog scrim, then `backdrop-blur`.

Hairlines are not a named swatch. They are always `color-mix(in oklch, var(--fg) 10–15%, transparent)`. Hover borders mix the accent at ~40–55%.

### Named Rules

**The One Signal Rule.** Indigo occupies well under 10% of any screen. If a layout needs a second hue (success green, error red, chart rainbow), the design has left this site. Status is weight, tracking, and a 6px dot, not a traffic-light palette. The only exception is the decorative editor-card chrome (fixed dark IDE frame with muted traffic-light dots), which is a picture of an editor, not UI chrome.

**The Paper Rule.** Neutrals keep chroma 0.004–0.03 at hue 264. A grain overlay (`opacity` 0.03 light / 0.028 dark, `multiply` / `overlay`) is always on. Stripping the grain or flattening to `#ffffff` / `#000000` makes it a different product.

**The Theme Is Lighting Rule.** Dark mode remaps the same roles. Do not invent a dark-only accent, a dark-only font, or a dark-only layout. Theme change is a circular view-transition clip from the toggle, 500ms ease-out-quart.

## 3. Typography

**Display / Body Font:** Fraunces (`Iowan Old Style`, `Palatino Linotype`, `Palatino`, serif)
**Label / Mono Font:** DM Mono (`ui-monospace`, `SFMono-Regular`, Menlo, Monaco, Consolas, monospace)

**Character:** A soft, optical-size old-style serif doing all the talking, paired with a narrow mono that numbers the pages. The pairing is the brand. There is no third family. There is no geometric sans.

### Hierarchy

- **Display** (Fraunces 300, `clamp(2.75rem, 4vw + 1.8rem, 5.5rem)`, line-height 0.95, tracking `-0.01em`, `opsz` 144, `SOFT` 0, `WONK` 0): the intro name only. Last name sits on its own line, italic, with the accent underline drawing in on load.
- **Headline** (Fraunces 300, 1.75rem / 28px, line-height 1.15): section titles (`Experience`, `Projects`) and dialog titles. Never weight 600+ on these.
- **Title** (Fraunces 400, 1.25rem / 20px, line-height 1.3): project card names, stacked layer names, in-card headings.
- **Lede** (Fraunces 400, 1.125rem / 18px, line-height 1.55, `max-w-prose`): the sentence under a section head. Graphite, not Ink.
- **Body** (Fraunces 400, 1rem / 16px, line-height 1.6): bio, role bullets, dialog copy. Cap line length at `max-w-prose` (~65ch). `text-wrap: pretty` on paragraphs, `balance` on headings.
- **Small** (Fraunces 400, 0.875rem / 14px, line-height 1.55): secondary sentences on cards, education line, org lines.
- **Label** (DM Mono 400, 0.75rem / 12px, tracking `0.08em`, line-height 1.4): section indexes (`01`), TOC numbers, chips, keybinds, availability, email CTAs, kbd, chart legends, "say hello". This is the machine voice. It is not for paragraphs.

### Named Rules

**The Dual Voice Rule.** If a human is speaking (name, bio, project story, thanks), it is Fraunces. If the site is indexing, tagging, or commanding (`01`, `now`, `Rust`), it is DM Mono. Do not set body copy in mono. Do not set a section title in mono. Do not introduce Inter, Geist, or a second serif.

**The Light Display Rule.** Display and headline stay at weight 300. Fraunces at 600 or 700 on a hero name turns the journal into a poster. Italics are reserved for the last name and short pull-quotes (thesis line), not for emphasis inside body copy.

## 4. Elevation

Flat at rest. Depth is a 1px hairline and a one-step surface shift (canvas → sheet). Shadows appear only as a reaction: hover lift, dialog. No ambient drop shadow on resting cards.

A fixed paper-grain layer (`z-index: 20`, non-interactive) sits above the whole page. It is atmosphere, not a card treatment. Do not put grain on individual components.

### Shadow Vocabulary

- **Hairline / `shadow-border`:** `0 0 0 1px color-mix(in oklch, var(--fg) 10%, transparent)`. Resting cards, chips, ghost buttons, the TOC command trigger, tool slots.
- **Hairline hover / `shadow-border-hover`:** `0 0 0 1px color-mix(in oklch, var(--accent) 55%, transparent)`. Ghost controls when pointed at.
- **Lift / `shadow-lift`:** accent ring + soft ink umbra (`0 12px 28px -16px` at 28% fg). Hover on project cards, work cards, signal cards, scroll-to-top. Always paired with a 2–4px translateY.
- **Dialog / `shadow-dialog`:** hairline + deeper umbra (`0 24px 48px -24px` at 40% fg). Modal/sheet only.
- **TOC inset:** `inset 2px 0 0 0 var(--accent)`. Reserved for an active rail mark; the live TOC uses a tinted fill instead (`bg-accent/10`). Do not combine both.

### Named Rules

**The Flat-Until-Lifted Rule.** If a surface is not hovered, focused, or modal, it has no drop shadow. A resting card with `box-shadow: 0 10px 40px rgba(0,0,0,.2)` is from another site.

**The Hairline Is Structure Rule.** Dividers, cards, and chips are 1px mixes of ink, not 1px solid `#e5e5e5`. Hard gray hex borders look dead on this paper.

## 5. Components

Chrome (nav, icon buttons, form-like controls) is slightly squared. Actions that commit (email me, copy, availability, back to top) are pills. That split is intentional.

### Buttons

- **Shape:** primary/ghost actions are fully rounded pills (`9999px`). Chrome buttons (`[appButton]`, icon hits) are 4px (`rounded-sm`). Hit target ≥ 44px on icon-only controls (`size-11`).
- **Primary:** Indigo Signal fill, On Signal text, DM Mono caption, 8×16px padding. Hover: fill becomes Ink and the pill nudges `-translate-y-0.5`. Used for the contact email and "Back to top".
- **Ghost:** Sheet fill, Graphite text, hairline, same pill and type. Hover: Ink text. Used for Copy email / Get in touch.
- **Chrome (`[appButton]` default/ghost/link):** Fraunces body, 4px radius, 10×16px, `min-h-11`. Primary chrome fills accent; ghost chrome is transparent + hairline; link is accent text, no padding, underline on hover. Active scale `0.96`.
- **Focus:** `outline: 2px solid var(--accent); outline-offset: 2px`. Never a box-shadow ring in a second color.
- **Icon buttons** (theme, CV download, scroll-top): 36–44px, muted at rest, Ink or Signal on hover. Scroll-top is a 40px circle, Sheet fill, hairline, lift on hover.

### Chips

- **Keybind:** Sheet, Ink, 4px radius, hairline, DM Mono caption, 4×8px. Language/tag tokens on cards and role rows (`Rust`, `Tokio`).
- **Availability:** Signal at 10% fill, Signal text, pill, 6px live dot on the left. "Open to backend and systems roles".
- **Status (OSS):** no fill. Open = Signal text + Signal dot. Closed/merged = Graphite + faint ink dot. Do not paint these green/red.
- **Featured / now:** Signal text, pill, 1px Signal border or 12% Signal fill. Roadmap "now" also pulses a 2.5s ring.

### Cards / Containers

- **Project card (`simple-project-card`):** Sheet, 4px radius, 1px ink 12% border, 20px padding, min-height 16rem. Index in Signal mono top-left, year/stars top-right, Fraunces title, Graphite blurb, keybind + arrow footer. Hover: Signal 48% border, 8% Signal wash, `-translate-y-0.25rem`, lift shadow. Two columns from `sm`, one column on mobile.
- **Work / orbit card:** 12px radius, slight rest rotation (`±0.25deg`) that flattens on hover, 2px Signal bar scaling in from the left, faint orbit rings. Same hover lift.
- **Editor card:** a picture of an IDE, not a theme. Fixed dark frame `#282c33`, 6px radius, traffic-light dots, mono tabs. Allowed to ignore the paper palette because it is a screenshot-like object. Hover still uses the site Signal on the border.
- **Pulse / chart frames:** Sheet, 12px radius, hairline, 20–24px padding. Charts inherit Signal; no Recharts default grid fill.
- **End-of-stream banner:** Sheet at 60%, 16px radius, hairline, centered, live Signal ping. Closing beat of the page, not a footer widget.

### Inputs / Fields

The site has no persistent text fields. If one is ever added: transparent, no border of its own, Fraunces body, Graphite placeholder. Do not draw a Material outlined text field.

### Navigation

- **Sidebar TOC (from `lg`):** sticky under the name. Name is Fraunces subhead. Index label in Signal mono. Links: Fraunces small, 36px min height, mono number in a 20px slot. Active = `bg-accent/10` + Signal text. Hover = Sheet + Ink. Below: current work, IT/EN toggle, mail/GitHub. Language toggle is two mono captions; the active language is Signal.
- **Mobile:** name + theme in the header row; TOC becomes a 2-column grid. No hamburger drawer as the primary pattern on the home page (a compact nav with menu exists for tighter headers).
- **Skip link:** visually hidden until focused, then a Sheet chip at `top-4 left-4`.

### Section Head

Mono index (`02`) in Signal + Fraunces headline. A 2.75rem × 2px Signal bar draws in as the heading enters the viewport (`section-mark`). Optional Graphite mono kicker on the right (`timeline / decisions`, `selected work / 2024—now`).

### Dialog / Sheet

Same overlay token. Mobile: bottom sheet, `rounded-t-xl`. From `sm`: centered modal, 16px radius, `min(36rem, calc(100vw - 2rem))`. Staggered fade-up of children. Close on overlay click and Escape.

### Roadmap / Timeline

Three columns from desktop: year (mono Graphite) | spine (1px ink line + numbered circle) | copy. Current role: filled Signal circle, "now" pill, pulse ring. Hover shifts copy 4–5px right and paints the pin Signal. Thesis sits as an italic Graphite blockquote under a hairline.

### Stack Layers

Hairline rows: index | name | Signal data-bar | pill tokens. Hover pads left 12px and tints Signal 5%. Tokens are Graphite pills that rise and ink-up on row hover. Caption under the list: "closer to the metal" → "closer to the person using it".

### Intro Signature

Company · role · location as a Sheet pill with hairline. Display name; last name italic with the load-in Signal underline. 64–80px avatar, 12px radius, 1px ink outline, slight scroll parallax. Bio in lede Graphite. Availability pill. Education + mailto in small / mono.

## 6. Do's and Don'ts

### Do

- **Do** set every color in OKLCH, tinted toward hue 264, through `--canvas --surface --fg --muted --accent --on-accent`.
- **Do** use Fraunces 300 for the name and section titles, Fraunces 400 for all other sentences, DM Mono caption (`0.08em`) for indexes, chips, and commands.
- **Do** number every section (`01`–`09`) and keep the sticky TOC in sync with scroll.
- **Do** keep resting surfaces flat: Sheet on Canvas, 1px `color-mix` hairline, 4–12px radius.
- **Do** lift on hover only (`translateY(-0.25rem)` + `shadow-lift`) and focus with a 2px Signal outline offset 2px.
- **Do** ease with `--ease-out-quart` (`cubic-bezier(0.23, 1, 0.32, 1)`). Durations: 150 / 250 / 400 / 500ms.
- **Do** honor `prefers-reduced-motion`: no view-transition clip, no reveals, no chart draws, no underline animation, `scroll-behavior: auto`.
- **Do** keep primary CTAs as Signal pills in DM Mono (email, back to top). Keep reading copy in Fraunces.
- **Do** ship both light and dark from the same roles. Grain stays on.
- **Do** write EN and IT as copy variants of one layout.

### Don't

- **Don't** reuse Altitude, Ramp, Plaid, Linear, or Bloomberg as references. This is not a finance product, not a terminal, not a dark SaaS shell.
- **Don't** introduce Inter, Libre Baskerville, Fira Code, Geist, or any third family.
- **Don't** add a second accent (green success, red error, gold, cyan). Open/closed is a dot and a weight change.
- **Don't** use `#000`, `#fff`, or untinted gray ramps. If it looks like Tailwind slate on white, it is wrong.
- **Don't** put bold (700) on display type, or all-caps Fraunces headlines.
- **Don't** use heavy drop shadows, glass cards as the default, gradient text, gradient meshes, 3D orbs, or mountain/landscape photography.
- **Don't** use a colored `border-left` thicker than 1px as a stripe on cards or rows. Signal marks are indexes, underlines, 2px top bars that scale in, or 6px dots.
- **Don't** build identical icon+heading+blurb grids. Project cards are uneven in content; stack is a list of layers; experience is a timeline.
- **Don't** treat dark mode as a neon cyberpunk skin or a separate brand.
- **Don't** animate layout properties (width, height, top, left). Transform, opacity, clip-path, stroke-dashoffset only.
- **Don't** ship a floating marketing chatbot, a "Request a demo" ghost button, or a 5-column feature-tile grid. Those belong to other products.

### Agent quick reference

```css
:root {
  --canvas: oklch(0.96 0.008 264);
  --surface: oklch(0.995 0.004 264);
  --fg: oklch(0.24 0.03 264);
  --muted: oklch(0.48 0.03 264);
  --accent: oklch(0.48 0.22 264);
  --on-accent: oklch(0.99 0.004 264);
  --font-serif: "Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, serif;
  --font-mono: "DM Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.dark {
  --canvas: oklch(0.07 0.006 264);
  --surface: oklch(0.13 0.01 264);
  --fg: oklch(0.94 0.01 260);
  --muted: oklch(0.68 0.016 260);
  --accent: oklch(0.72 0.16 260);
  --on-accent: oklch(0.12 0.02 264);
}
```

Tailwind tokens already bound in `@theme`: `bg-canvas`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `bg-accent`, `text-on-accent`, `font-serif`, `font-mono`, `font-display`, `text-heading`, `text-heading-sm`, `text-lede`, `text-body`, `text-small`, `text-caption`, `tracking-mono`, `rounded-sm|md|lg|xl|full`, `shadow-border`, `shadow-lift`, `shadow-dialog`.
