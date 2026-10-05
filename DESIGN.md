---
name: Alessandro Bruno
description: Personal site of a Software Engineer (Systems & Product) — the ab. identity on screen: charcoal surfaces, machined silver, one electric-blue signal.
colors:
  canvas: "#F4F6F8"
  surface: "#FFFFFF"
  surface-2: "#EEF1F5"
  line: "#D8DAE1"
  fg: "#0B0D10"
  muted: "#5C6675"
  accent: "#0058E0"
  signal: "#0066FF"
  on-accent: "#FFFFFF"
  silver: "#8D98A8"
  canvas-dark: "#0B0D10"
  surface-dark: "#101318"
  surface-2-dark: "#151A21"
  line-dark: "#252B34"
  fg-dark: "#F4F6F8"
  muted-dark: "#9CA5B4"
  accent-dark: "#4D9BFF"
  signal-dark: "#0066FF"
  silver-dark: "#BBC3CF"
  highlight: "#00B7FF"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1rem + 4.5vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 2.6vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  heading-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  lede:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  wordmark:
    fontFamily: "Manrope, Inter, sans-serif"
    fontSize: "0.6875rem–0.8125rem"
    fontWeight: 300
    letterSpacing: "0.4em"
    textTransform: uppercase
  eyebrow:
    fontFamily: "Manrope, Inter, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.24em"
    textTransform: uppercase
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.71875rem–0.75rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  sm: "6px"
  button: "8px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  container: "76rem"
  gutter: "1.25rem (mobile) / 2rem (≥640px)"
  nav-height: "4rem"
  section: "clamp(4.5rem, 3rem + 5vw, 7.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 18px"
    typography: "Inter 500 0.875rem"
  button-ghost:
    backgroundColor: "surface at 70%"
    textColor: "{colors.fg}"
    border: "1px {colors.line}"
    rounded: "{rounded.button}"
  chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg}"
    border: "1px {colors.line}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.mono}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px brushed-metal gradient ring"
    padding: "24px (lead 24–40px)"
  nav:
    height: "64px"
    backgroundColor: "transparent → canvas 72–78% + blur(14px) once scrolled"
    logo: "ab-monogram-metallic, 30px tall"
---

# Design System: Alessandro Bruno

Personal site of Alessandro Bruno, Software Engineer (Systems & Product). The site presents an engineer, not a language: no single technology leads the copy, and the stack shows up as a moving band of everything he actually uses. This document is the visual source of truth for [alessandrobrunoh.it](https://alessandrobrunoh.it). The brand itself (logo files, clear space, misuse) is defined in [`BRAND.md`](./BRAND.md); this file is how that brand becomes an interface.

Canonical tokens live in `src/styles.css` (`:root` / `.dark` and the Tailwind `@theme` block). If prose and code disagree, the CSS wins. If this file and `BRAND.md` disagree about the logo, `BRAND.md` wins.

## 1. Overview

**Creative North Star: "Machined Signal"**

The `ab.` monogram is a ribbon of polished metal with one electric-blue dot. The site is built from the same three materials: **charcoal** surfaces, **silver** hairlines and edges, and a single **blue signal** that marks where to look. Everything else is typography and negative space.

It should feel like a software engineer's workbench, not an agency landing page: precise, technical, a little premium. The metallic mark is the only ornament. Its blue dot is the only colour.

**Key characteristics**

- Dark-first. `#0B0D10` is the brand's home surface; light mode is the same layout on soft white paper (`#F4F6F8`).
- One type family for reading (Inter), one for brand voice (Manrope, uppercase, tracked), one for machine data (JetBrains Mono).
- The logo dot is the system's punctuation: display headings end on a blue `.`, the active nav item sits on a blue dot, live states pulse a blue dot.
- Brushed-metal hairlines: cards have a 1px gradient ring with a silver catch-light at the top-left corner, which turns blue on hover.
- Wide, calm layout: a 76rem container, two-column section heads, large gaps between sections.
- Motion is slow and restrained (400–1400ms, ease-out). No bounce. `prefers-reduced-motion` disables choreography.
- Bilingual EN/IT. Copy changes; the visual system does not.

**Page shell.** Fixed 64px top nav. Full-bleed hero, then numbered sections inside `.container-x` (max 76rem, 20/32px gutter), separated by a content-width hairline: `01 Intro` → `02 Experience` → `03 Work` → `04 How I work` → `05 Writing` → `06 Contact`. Experience comes first because client production work is the strongest proof, for Software Engineer and Forward Deployed Engineer roles alike. Footer is always black (`#000`, dark tokens) with daily tools, the white full logo, a sign-off and the wordmark engraved at display size. A 2px blue gradient scroll-progress bar is pinned to the top. Subpages (project, blog) use the same nav plus a 14rem sticky "On this page" rail.

## 2. Brand Assets in the Interface

Source files live in `public/logos/` (official SVGs, each a wrapped raster). The site never loads those directly: they are 200–870KB each. Optimised, tightly cropped derivatives live in `public/brand/`:

| Use | File | Size |
|---|---|---|
| Nav mark (every page) | `brand/ab-monogram-black-160.webp` (light) / `brand/ab-monogram-white-160.webp` (dark) | 30px tall |
| Hero mark, contact watermark, sheen mask | `brand/ab-monogram-metallic.webp` (960w) | up to 30rem wide |
| Footer (always black) | `brand/ab-logo-white-full.webp` | 13.5rem wide |
| Light documents / spare | `brand/ab-logo-black-full.webp` | — |
| Spare / documents | `brand/ab-logo-metallic-full.webp`, `brand/ab-monogram-{white,black}-160.webp` | — |
| Light hero backdrop | `brand/hero-light.webp` (from `public/hero.png`, sphere cropped out) | cover |
| Favicon | `favicon.svg` / `favicon-32.png`: black monochrome monogram, no wordmark, transparent; swapped to `favicon-dark.svg` / `favicon-dark-32.png` (white) while the site is dark (`syncFavicon` in theme.ts + the inline boot script); `apple-touch-icon.png`: same mark on white (iOS fills transparency with black) | — |
| Share card | `og.jpg` (1200×630, metallic full logo on `#0B0D10` with blue ambient light) | — |

Regenerate derivatives from `public/logos/*.svg` when the official files change; never edit the derivatives by hand.

**Rules carried over from BRAND.md**

- The monogram is an image. Never set `ab.` in a font (the old Fraunces "ab." text mark is gone).
- No CSS filters, outlines, drop shadows or recolouring on the logo files. Light is added *around* the mark (glow) or *through* its own alpha (sheen), never on top of it.
- Clear space: the hero mark has no box and at least 2× dot diameter of air; the nav mark keeps 14px to the wordmark.
- The full `ALESSANDRO BRUNO` logo appears once per page, in the footer. The navbar uses the monogram (plus a typeset wordmark from `xl`).

## 3. Colors

All values are the brand hexes from `BRAND.md`. Roles are CSS custom properties, remapped per theme.

| Role | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#F4F6F8` | `#0B0D10` | Page background |
| `--surface` | `#FFFFFF` | `#101318` | Cards, footer band, panels |
| `--surface-2` | `#EEF1F5` | `#151A21` | Chips, pressed toggles, bar tracks |
| `--line` | `#D8DAE1` | `#252B34` | Every hairline and border |
| `--fg` | `#0B0D10` | `#F4F6F8` | Headlines, primary text |
| `--muted` | `#5C6675` | `#9CA5B4` | Ledes, meta, inactive nav |
| `--silver` | `#8D98A8` | `#BBC3CF` | Metal edges, neutral status dots, rule gradients |
| `--signal` | `#0066FF` | `#0066FF` | **Fills only**: primary button, logo-dot accents, progress bar, focus ring, live dots, data bars |
| `--accent` | `#0058E0` | `#4D9BFF` | **Text and strokes** in blue on canvas (indexes, links, active states). Tuned for ≥4.5:1 |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | Text on a signal fill |
| highlight | `#00B7FF` | `#00B7FF` | Only as the end of the progress gradient and code functions |

### Named rules

**The One Signal Rule.** Electric blue is punctuation, never a wash. It may fill a button, a dot, a 2px bar; it may tint a glow at ≤22% alpha. If a screen has more than ~5% blue pixels, something is wrong. There is no second hue: status is a dot plus a word (Open = blue ring, Published = blue dot, Merged = silver dot). The only exception is git diff `+`/`−` in code panels, which uses muted green/red because that is what a diff is.

**Signal vs Accent.** `#0066FF` on `#0B0D10` is only ~3.8:1, fine for a fill but not for small text. Blue text always uses `--accent`, blue fills always use `--signal`.

**No pure black, no grey ramps.** Neutrals are the brand's cool charcoals and silvers. Tailwind `slate`/`gray` or `#000` surfaces are from another site.

**Theme is lighting.** Dark is the default identity, light is the same layout on paper. The only theme-specific *content* is the hero backdrop: a fine 72px grid with blue ambient light in dark, the soft landscape (`hero-light.webp`) in light. Theme change is a circular view-transition clip growing from the toggle (700ms ease-out-quart, scoped by `html.theme-vt` so route changes don't inherit it). With no stored choice the theme still follows the UTC schedule (light 06:00–20:00); a click stores a manual choice.

## 4. Typography

**UI / reading:** Inter (variable, `opsz` 14–32, weights 300–600).
**Brand voice:** Manrope 300 / 500.
**Machine voice:** JetBrains Mono 400 / 500.

### Hierarchy

- **Display** (Inter 500, `clamp(2.5rem → 5rem)`, lh 0.98, tracking −0.045em): the hero only. Role on exactly two lines (`Software Engineer` / `Systems & Product.`), sized so each fits its line in the 7/12 column; the second line is muted silver and ends on the blue dot.
- **Heading** (Inter 500, `clamp(2.25rem → 3.75rem)`, lh 1.02, −0.045em): section titles (`Projects.`) and the contact statement. Always end on `<span class="brand-dot">.</span>`.
- **Heading-sm** (Inter 500, `clamp(1.75rem → 2.5rem)`, −0.035em): the featured project name, big metric numbers.
- **Title** (Inter 500, 1.5rem, −0.025em): card names, timeline roles, subpage h2.
- **Lede** (Inter 400, 1.1875rem, lh 1.6, muted, max ~38rem): the paragraph beside a section title.
- **Body / Small** (Inter 400, 1rem / 0.875rem): everything else. Cap measure at `max-w-prose`.
- **Wordmark** (Manrope 300, uppercase, 0.4em tracking): `ALESSANDRO BRUNO` above the hero title and next to the nav mark. Never bold, never sentence case.
- **Eyebrow** (Manrope 500, 0.6875rem, uppercase, 0.24em): section kickers (`02 —— SELECTED WORK / 2024—NOW`), fact labels, card labels.
- **Mono** (JetBrains Mono, 0.72–0.75rem): indexes (`02`), years, stars, repo paths, chips, the language code. Data, not sentences.

### Named rules

**The Three Voices Rule.** Inter speaks, Manrope signs, Mono measures. Do not set paragraphs in mono or Manrope, do not set the wordmark in Inter, do not add a fourth family (no serif anywhere).

**The 500 Ceiling.** Display and headings stop at weight 500 with tight negative tracking. 600+ on display turns the precise look into a poster.

## 5. Surfaces & Elevation

Flat at rest. Depth comes from one surface step (`canvas → surface → surface-2`), a hairline, and light.

- **Brushed-metal edge (`.card`)**: a 1px gradient ring (mask-composite) running `silver catch-light → line → line → silver`. It is the card's border; never add a second `border`.
- **Hover (`.card-link`)**: catch-light turns `--signal`, the card lifts 3px with `--shadow-lift` (blue-tinted umbra + accent ring), and one soft reflection sweeps across the face (900ms). This is the "small hover reflection" from BRAND.md §27.
- **Ambient light**: radial blue glows (`--glow`, 12% light / 22% dark) behind the hero mark, the featured project and the contact panel. Never behind body text at full strength.
- **Glass** only for chrome that floats over content: the scrolled nav and the scroll-to-top button (`backdrop-filter: blur`). Cards are never glass.
- No resting drop shadows. No grain texture.

## 6. Components

### Navigation (`app-site-nav`)
Fixed, 64px. Transparent over the hero; once scrolled, `--nav-bg` + 14px blur + bottom hairline. Left: flat monogram (30px; black on light, white on dark, per BRAND §18 dark navbar) + Manrope wordmark from `xl`. Centre (from `lg`): sections as `02 Projects` (mono number + Inter 14px); the active one turns `fg` with a 4px signal dot under it. Right: one hairline capsule holding the language control (globe + `EN`/`IT` that rolls like a split-flap; the globe turns 90°) and the theme toggle (a sun whose core grows while a disc slides in to cut a crescent and the rays spin out), then primary "Email me" (from `sm`) and the menu button (below `lg`). The bar tucks away while scrolling down past 320px and returns on any scroll up. The mobile sheet is opaque canvas with large Inter links and email/GitHub buttons; Escape closes it. On subpages the same links point to `/#section`.

### Brand menu (right-click on the nav mark)
`contextmenu` on the monogram opens a 15.5rem menu under it (surface, line border, 12px radius, dialog shadow, 220ms scale-in): **Copy logo as SVG** (`/logos/ab-monogram-metallic.svg`), **Copy wordmark as SVG** (`/logos/ab-logo-metallic-full.svg`), separator, **Brand guidelines →** (`/brand`). The SVG markup goes to the clipboard as text (fetched inside a `ClipboardItem` promise so Safari keeps the user activation); the item shows a check + "Copied" for 900ms, then the menu closes and focus returns to the mark. If the clipboard is blocked the file opens in a new tab. Keyboard: the context-menu key / Shift+F10 opens it, arrows/Home/End move, Escape or Tab closes, outside click closes. Left-click still goes home.

### Brand page (`/brand`)
Linked from the brand menu and the footer bottom bar. Sections: hero with copy buttons and the metallic full logo on a fixed `#0B0D10` stage; `01 Logos` — the six official files as cards whose previews sit on the surface each asset is drawn for (dark or `#F4F6F8`, regardless of page theme), each with Copy SVG and Download; `02 Colour` — the BRAND.md palette as click-to-copy swatches; `03 Typography` — Inter / Manrope wordmark / JetBrains Mono specimens; `04 Usage` — clear space, minimum sizes, Do / Don't panels. Asset list and copy helpers live in `src/lib/brand.ts`.

### Hero (`app-intro`)
Exactly one screen on every device: `min-height: 100svh` (visible height with mobile browser bars), inner spacing in `svh` so it compresses on short screens; on narrow screens shorter than 760px the large mark hides (it is still in the nav). A **Scroll** cue sits bottom-left on the content edge (hairline with a blue bead running down, fades out in the first 25vh of scroll). The proof strip starts right below the fold. Left 7/12: meta pill (avatar · company · location), wordmark, display role, lede, actions (primary Email · ghost CV · quiet GitHub), availability with a live dot. Right 5/12: the metallic monogram with ambient glow, a masked bottom-up reveal (1300ms), one light sweep through its own alpha (1600ms, again on hover) and a slow scroll parallax. Display lines slide up out of their own masks; the wordmark settles from 0.9em to 0.4em tracking. Below the fold: a three-cell proof strip (In production / Published crate / Thesis), then the **tech band**: two full-bleed marquees of the real stack, languages & frameworks solid running left (70s loop), infrastructure outlined in silver running right (55s). Hovering the band pauses both; hovering a word swaps it, solid to outline and outline to solid.

### Section head (`app-section-head`)
Two columns from `lg` (5/12 + 7/12, bottom-aligned): eyebrow `NN —— KICKER` + heading with the dot on the left; the lede (projected content) on the right. `bare` variant (About) top-aligns and drops the bottom margin.

### Buttons
8px radius slabs, 44px tall (36px `btn-sm`), Inter 500 14px. **Primary**: signal fill, white text, inner top highlight + blue under-glow. **Ghost**: surface 70% + line border; border turns accent on hover. **Quiet**: muted text only. Active: `scale(.97)`. Focus: 2px signal outline, 2px offset, everywhere.

### Chips & status
`.chip`: mono, `surface-2`, line border, 6px radius (`chip-quiet`: transparent, muted). Level badges (`PROFICIENT`) are Manrope eyebrow pills. Status uses `.status-open|merged|published` dots, never colour words.

### Cards
- **Project lead**: full-row `.card`, eyebrow `01 —— FEATURED`, heading-sm name, then **The problem** (the case-study `problem`, in `fg`), chips; right column lists highlights as mono-numbered hairline rows. Footer row: meta in accent mono + "Read the case study ↗".
- **Project card**: 2-up grid, index top-left, stars · year top-right, Title name, small blurb, language chip + meta (or a `chip-signal` "Published on crates.io" when the project is also a published contribution), arrow that nudges up-right on hover.
- **Writing card**: 3-up (1-up below `lg`), Manrope subtitle eyebrow + status chip (Draft / Published, never hidden), Title, muted pitch, "Read ↗".
- **Contact panel**: 24px radius `.card` with ambient glow and a 7–9% opacity metallic monogram watermark bottom-right; statement heading, lede, the email address as a large Inter link with a growing underline, Copy ghost button, and a three-column facts row.

### Timeline (Experience)
Newest first. Grid `11rem | 2.5rem | 1fr`: mono era (+ `now` pill), a 1px spine with a 12px ring node (current = filled signal, pulsing), and the role (Title, org, blue-dot bullets in two columns, chips). Education closes the list with the thesis as a silver-ruled quote. On mobile the spine moves to a 1.25rem left column.

### Work (`#work`)
Projects and open source are one section. Open source alone was three rows, one of them a duplicate of a project card, so it reads as thin on its own; it returns as a separate section only with 4–5+ merged upstream contributions. Below the project grid, an **Upstream / open source** list of hairline rows: status (dot + word) | title, `repo · PR #n — note` in mono | arrow. Published crates are not repeated there; they get the badge on their project card.

### How I work (`#approach`)
Replaces the old Stack grid (tools are already in the tech band). Five numbered principles from `PRINCIPLES` as hairline rows: mono index | Title | muted body, with a faint signal wash on hover. Principles describe working habits, never claims about specific events.

### Writing (`#writing`)
The `BLOG` posts as cards linking to `/blog/:slug`. Drafts are labelled Draft.

### Impact
`Role.impact` and `Project.impact` (`{ value, label }[]`) render as large numbers with a muted label (`.impact-row`) in the timeline and in a **Result** block on case studies. They are optional and empty by default: only real, measured numbers go there.

### Footer
Always black (`#000`) in both themes: the element carries `.dark`, so every token inside resolves to the dark set. A blue ambient glow bleeds in from the top edge. Daily-tools grid (4 → 2 columns), then the white full logo | "End of stream" sign-off | CV + Back to top, then `ALESSANDRO BRUNO` in Manrope 300 at display size, engraved (charcoal-to-black text fill) and rising into place as it enters, then a mono bottom bar (© year, location, Email, GitHub).

### Subpages
Project pages are case studies, in this order: Overview (name, blurb, source/demo) → **The problem** → **What I built** (body + numbered highlights) → **Result** (only with real `impact`) → **What I learned** → *Under the hood*: live README excerpt, repository metrics and the latest change set. The rail lists only the sections that render. Nav + `page-shell` (14rem rail + content). Rail links are small Inter with mono numbers; active = surface fill, line ring and a 2px inset signal edge. Project pages keep live GitHub metrics in `panel`/`card` surfaces with signal data bars; code blocks are a fixed charcoal editor palette in both themes.

## 7. Motion

- Easing: `--ease-out-quart` (`cubic-bezier(0.23, 1, 0.32, 1)`) for UI, `--ease-smooth-out` for sweeps. Durations 150 / 250 / 400 / 500ms for UI; 700ms content reveals; 1300–1600ms hero.
- Load: hero copy staggers in (fade + 12px rise, 100ms apart); display lines slide out of masks; the mark reveals bottom-up, then the sheen passes once.
- Route change: Angular `withViewTransitions` — the old page lifts and blurs out (260ms), the new one rises in (620ms). The nav has its own `view-transition-name` and stays still.
- Theme change: circular clip from the toggle (see Colors).
- Scroll reveals (end on the resting state, safe everywhere): section titles rise out of a clip, eyebrow rules draw left to right, cards fade-rise, rows slide up, the footer wordmark rises.
- Parallax (inside `@supports (animation-timeline: scroll())` only, so no browser freezes mid-move): hero copy drifts up and fades, the mark sinks 7rem and scales to .92, the grid and photo drift at their own depths, the timeline spine fills blue row by row, the featured-project glow and the contact watermark drift across their panels.
- Pointer: `appTilt` gives cards up to 5° tilt (2.5° featured, 1.2° contact) and a blue spotlight that follows the cursor (`--spot` is a registered `@property`, so it fades). Mouse and pen only. Primary buttons catch a light sliver on hover.
- Live: 2.4s soft ring pulse on live dots and the current timeline node; the hero glow breathes over 9s. Nothing else loops.
- Never animate layout properties. Transform, opacity, clip-path, background-position only.
- `prefers-reduced-motion`: no reveals, no sheen, no parallax, no tilt, no pulses, no route or theme view transitions, `scroll-behavior: auto`.

## 8. Do's and Don'ts

### Do
- **Do** use the role variables (`bg-canvas`, `bg-surface`, `bg-surface-2`, `border-line`, `text-fg`, `text-muted`, `text-accent`, `bg-signal`) instead of raw hexes.
- **Do** end display and section headings on the blue dot, and only those.
- **Do** use `--accent` for blue text and `--signal` for blue fills.
- **Do** keep cards on the brushed-metal edge (`.card`) and links on `.card-link`.
- **Do** load logos from `public/brand/` derivatives, with `alt=""` when the name is already in adjacent text and the full name otherwise.
- **Do** keep EN and IT as copy variants of one layout, and both themes from the same roles.

### Don't
- **Don't** recreate `ab.` in text, stretch, recolour, outline, shadow or filter the logo files, or place the metallic mark on busy imagery without air around it.
- **Don't** introduce a second accent colour, colourful gradient text, neon glows, or large blue fills. (The only gradient type is the footer engraving, charcoal to black.)
- **Don't** invent numbers or claims. Impact figures, travel availability and customer outcomes appear only when they are real.
- **Don't** position the person around one language. Facts can name Rust, Java or TypeScript; headlines, availability and calls to action stay technology-agnostic.
- **Don't** add serif fonts, all-caps Inter headings, or bold (600+) display type.
- **Don't** put glass, grain or resting drop shadows on cards.
- **Don't** use the hero landscape anywhere but the light-mode hero; it is atmosphere, not content.
- **Don't** animate with bounce, rotation or flashing.

### Agent quick reference

```css
:root {
  --canvas: #f4f6f8; --surface: #ffffff; --surface-2: #eef1f5; --line: #d8dae1;
  --fg: #0b0d10; --muted: #5c6675; --silver: #8d98a8;
  --accent: #0058e0; --signal: #0066ff; --on-accent: #ffffff;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-brand: "Manrope", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
.dark {
  --canvas: #0b0d10; --surface: #101318; --surface-2: #151a21; --line: #252b34;
  --fg: #f4f6f8; --muted: #9ca5b4; --silver: #bbc3cf;
  --accent: #4d9bff; --signal: #0066ff;
}
```

Tailwind tokens bound in `@theme`: `bg-canvas`, `bg-surface`, `bg-surface-2`, `border-line`, `text-fg`, `text-muted`, `text-accent`, `bg-signal`, `text-on-accent`, `text-silver`, `font-sans`, `font-brand`, `font-mono`, `text-display`, `text-heading`, `text-heading-sm`, `text-title`, `text-subhead`, `text-lede`, `text-body`, `text-small`, `text-caption`, `tracking-tight`, `tracking-display`, `tracking-eyebrow`, `tracking-brand`, `rounded-sm|md|lg|xl|full`, `shadow-border`, `shadow-lift`, `shadow-dialog`. Component classes: `.container-x`, `.section`, `.eyebrow`, `.brand-wordmark`, `.brand-dot`, `.btn(-primary|-ghost|-quiet|-sm)`, `.chip(-quiet)`, `.card`, `.card-link`, `.live-dot`, `.meta-mono`, `.panel`, `.nav-controls`/`.nav-ctl`, `.tech-band`/`.tech-row`, `.footer-giant`. Directive: `appTilt` (`[appTilt]="max degrees"`).
