---
name: Alessandro Bruno
description: Personal site of a Software Engineer (Systems & Product) — the soft-minimal ab. identity on screen: white space, soft gray-blue surfaces, Deep Ink text, one Primary Blue.
colors:
  page: "#FFFFFF"
  subtle: "#F8FAFC"
  surface: "#FFFFFF"
  surface-2: "#F1F4F8"
  border: "#E5E7EB"
  border-standard: "#D7DCE3"
  border-strong: "#CBD5E1"
  text-primary: "#111827"
  text-secondary: "#4B5563"
  text-muted: "#6B7280"
  brand-blue: "#3B82F6"
  blue-hover: "#2563EB"
  blue-pressed: "#1D4ED8"
  soft-gray: "#E8ECF2"
  light-blue-gray: "#D5DCE6"
  ink: "#1F2937"
  dark-section: "#0F172A"
  success: "#16A34A"
  error: "#DC2626"
typography:
  family: "Inter, system-ui, sans-serif (one family; code uses ui-monospace)"
  display: { size: "clamp(2.5rem, 1rem + 4.5vw, 5rem)", weight: 600, lineHeight: 1.04, tracking: "-0.035em" }
  heading: { size: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)", weight: 600, lineHeight: 1.1, tracking: "-0.035em" }
  title: { size: "1.5rem", weight: 600, lineHeight: 1.2, tracking: "-0.03em" }
  subhead: { size: "1.25rem", weight: 600 }
  lede: { size: "1.125rem", weight: 400, lineHeight: 1.6 }
  body: { size: "1rem", weight: 400, lineHeight: 1.6 }
  small: { size: "0.875rem", weight: 400, lineHeight: 1.6 }
  eyebrow: { size: "0.75rem", weight: 500, transform: uppercase, tracking: "0.08em" }
  wordmark: { weight: 300, transform: uppercase, tracking: "0.35em" }
spacing: { 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px, 8: 32px, 10: 40px, 12: 48px, 16: 64px, 20: 80px, 24: 96px, 32: 128px }
radius: { sm: 10px, md: 14px, lg: 20px, xl: 28px, pill: 999px }
shadow:
  sm: "0 1px 2px rgba(15, 23, 42, 0.04)"
  md: "0 8px 24px rgba(15, 23, 42, 0.08)"
  lg: "0 20px 48px rgba(15, 23, 42, 0.10)"
  focus: "0 0 0 4px rgba(59, 130, 246, 0.18)"
layout: { maxWidth: 1200px, gutter: "20px mobile / 24px tablet / 32px desktop", sectionGap: "72–96px", cardGap: 24px, nav: 64px }
motion: { durations: "120 / 180 / 240 / 320ms", easing: "ease-out (cubic-bezier(0.23, 1, 0.32, 1))" }
---

# Design System: Alessandro Bruno

Personal site of Alessandro Bruno, Software Engineer (Systems & Product). This file is how the **soft-minimal** brand becomes the site. The brand itself — logo files, clear space, minimum sizes, incorrect usage — is defined in [`BRAND.md`](./BRAND.md); if they disagree about the logo, `BRAND.md` wins. Canonical tokens live in `src/styles.css` (`:root` / `.dark` and `@theme inline`); if prose and code disagree, the CSS wins.

## 1. Intent

A refined engineer's portfolio: calm, precise, highly scannable, premium through restraint. Google-level clarity with Apple-like quiet. It must read as trustworthy to hiring managers, engineering managers and technical founders, for Software Engineer and Forward Deployed Engineer roles alike, and it must never look like a template, a gaming site or a neon "hacker" page.

**Principles.** Clarity first · quiet confidence · systemic consistency · generous whitespace · the soft-minimal mark as the only brand anchor · developer credibility · accessible by default. When in doubt: the calmer solution, the simpler layout, the more readable spacing.

**What changed from the previous (metallic) system.** Light-first instead of dark-first; one family (Inter) instead of Inter + Manrope + JetBrains Mono; Primary Blue `#3B82F6` instead of electric `#0066FF`; soft 10–28px radii, pill buttons and soft shadows instead of brushed-metal hairlines; calm 120–320ms motion instead of sheens, tilt and heavy parallax. All metallic assets and the landscape hero image were removed.

## 2. Logo assets

The nine official files live in `public/brand/` and are what the brand menu copies and the brand page downloads:

| | Soft (primary) | Black | White |
|---|---|---|---|
| Monogram | `ab-soft-minimal-monogram.svg` | `…-monogram-black.svg` | `…-monogram-white.svg` |
| Full logo | `ab-soft-minimal-full.svg` | `…-full-black.svg` | `…-full-white.svg` |
| Wordmark | `ab-soft-minimal-wordmark.svg` | `…-wordmark-black.svg` | `…-wordmark-white.svg` |

The mark files are rasters wrapped in SVG (~1.3MB soft, ~95KB mono), so the site displays cropped WebP derivatives instead: `ab-monogram.webp` (960w), `ab-monogram-160.webp` (nav), `ab-monogram-white.webp` / `-white-160.webp`, `ab-monogram-black.webp`. Regenerate them from the SVGs when the official files change.

> The three `…-full*.svg` files shipped with a viewBox of `0 0 1600 980` while the mark was drawn down to y≈1211 and the wordmark at y≈1331, so the wordmark was invisible and the mark clipped. Their root `width/height/viewBox` were corrected to `1200 × 1170` / `200 220 1200 1170`; nothing inside was changed.

**Wordmarks are set live**, not as images: the SVG wordmarks use `<text>`, which in an `<img>` falls back to system fonts. On the site the name is always HTML in `.brand-wordmark` (Inter 300, uppercase, 0.35em), with the trailing letter-space balanced when centred.

**Where each asset goes**

| Context | Asset |
|---|---|
| Navbar | soft monogram (light) / white monogram (dark), 30px tall, + wordmark from `xl` |
| Hero | full logo: soft monogram + live wordmark (white monogram on dark) |
| Footer (always dark) | white monogram + the wordmark in white |
| Contact panel | soft monogram as a 50%-opacity watermark (12% on dark) |
| Favicon | soft monogram (`favicon.svg`, `favicon-32.png`); white while the site is dark (`favicon-dark*`) |
| Apple touch icon | soft monogram on white |
| Share card (`og.jpg`) | soft monogram + wordmark on soft white |
| CV / print | black full logo (not on the site) |

## 3. Color

Light is the home of the brand. Dark is the brand's `#0F172A` dark section, used for the footer and as an optional theme.

| Role (CSS var) | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#FFFFFF` | `#0F172A` | Page |
| `--subtle` | `#F8FAFC` | `#111B2E` | Hero gradient, tech band, contact panel, hovers |
| `--surface` | `#FFFFFF` | `#131D33` | Cards, nav controls, menus |
| `--surface-2` | `#F1F4F8` | `#1B2740` | Bar tracks, pressed states |
| `--line` / `--line-2` / `--line-strong` | `#E5E7EB` / `#D7DCE3` / `#CBD5E1` | `#24314A` / `#2C3A55` / `#3A4A68` | Borders: subtle, standard, strong |
| `--fg` | `#111827` | `#F1F5F9` | Headings, primary text |
| `--muted` | `#4B5563` | `#A3B0C2` | Secondary text, ledes |
| `--faint` | `#6B7280` | `#8695AB` | Captions, labels, meta |
| `--signal` | `#3B82F6` | `#3B82F6` | The dot, focus rings, live dots, progress, spine, chip tints |
| `--accent` | `#2563EB` | `#7CB1FF` | Blue **text**: links, indexes, active labels |
| `--cta` / `--cta-hover` | `#2563EB` / `#1D4ED8` | `#3B82F6` / `#2563EB` | Primary button fill |

**Blue for text and buttons.** Primary Blue `#3B82F6` is 3.7:1 on white: right for the dot, rings and decoration, too low for 14–16px text. Blue text and white-on-blue buttons use `#2563EB` (the brand's hover blue, 5.2:1) and darken to `#1D4ED8` on hover. This follows the brand's own accessibility rule ("avoid pale text on white") over its button colour.

**One blue.** No second accent. Status is a dot plus a word (Open: blue ring, Merged: silver dot). Success/error colours appear only in git diff `+`/`−`.

## 4. Typography

Inter only (variable, `opsz` 14–32, 300–700). Code blocks use the system monospace (`--font-code`).

- **Display** (600, `clamp(2.5 → 5rem)`, −0.035em): the hero role on exactly two lines (`Software Engineer` / `Systems & Product.`), the second in `--faint` 500, ending on the blue dot.
- **Heading** (600, `clamp(2.25 → 3.5rem)`, −0.035em): section titles, ending on the blue dot.
- **Title** (600, 1.5rem, −0.03em): cards, roles, subpage h2.
- **Lede / Body / Small** (400; 1.125 / 1 / 0.875rem; 1.6): never below 16px for running text.
- **Eyebrow** (500, 12px, uppercase, 0.08em, `--faint`): labels and kickers; section index in `--accent` 600 tabular.
- **Wordmark** (300, uppercase, 0.35em): only the name.
- Numbers (dates, stars, indexes) use `tabular-nums`.

## 5. Shape, depth, motion

- **Radius:** 10 (controls, menu items) · 14 (menus, tool tiles, swatches) · 20 (cards) · 28 (contact panel, brand stage) · pill (buttons, chips, nav links, controls).
- **Shadow:** `sm` at rest on cards; `md` on hover (with a 2px lift); `lg` for menus. Focus is the brand ring `0 0 0 4px rgba(59,130,246,.18)` on buttons and cards, a 2px `--signal` outline elsewhere.
- **No** gradient edges, metallic sheens, glass cards or 3D tilt. The nav is the only blurred surface.
- **Motion:** fades with a 10px rise (load stagger 60ms apart, scroll reveals), soft hover elevation, underline/opacity transitions. Durations 120 / 180 / 240 / 320ms for UI, ease-out. Expressive moments, each used once: hero display lines rise out of their masks; the hero mark floats ±8px over 7s and drifts 2.5rem with scroll while the grid drifts 6rem; section titles rise out of a clip and eyebrow rules draw in as they enter; cards carry a soft blue spotlight that follows the pointer (`appSpotlight`); the experience spine fills blue; the How I work rail draws and its nodes light up in sequence; the footer wordmark types itself in letter by letter; the tech band marquee pauses on hover; a 420ms circular reveal for the theme toggle; a 320ms cross-fade between routes. `prefers-reduced-motion` turns all of it off (the game still runs, without its entrance).

## 6. Layout

- Container `max-width: 1200px` + gutters 20 / 24 / 32px. Sections `padding-block: clamp(72px … 96px)`.
- **Nav** (64px, fixed): white at 86% + 10px blur, 1px bottom border. Left: monogram (+ wordmark from `xl`). Centre (from `lg`): `02 Experience · 03 Work · 04 How I work · 05 Contact`, active = `fg` + 4px blue dot. Right: one pill with language (globe + rolling `EN`/`IT`) and theme (sun → moon), then the **Contact** pill CTA; menu button below `lg`. Hides on scroll down, returns on scroll up. Right-click on the mark opens the brand menu (Copy logo as SVG, Copy wordmark as SVG, Brand guidelines).
- **Hero:** exactly one screen (`min-height: 100svh`, height-aware spacing). Background: `--subtle` → white with two pale discs (the logo's own gray, a 7% blue tint) and a fine **64px engineering grid** behind the mark in both themes (6% ink, faded out radially from the logo), with the same grid in blue showing only inside a soft spot that drifts across it over 14s. Left 7/12: company pill (the easter-egg switch, below), eyebrow `Software · Systems · Product`, display role, lede, **View work** (primary) · **Download CV** (secondary) · GitHub (ghost), availability. Right 5/12: the full logo. A Scroll cue sits bottom-left on desktop; on short phones the mark is hidden.
- **Below the fold:** three proof cards (In production / Published crate / Thesis), then the tech band (two marquees on `--subtle`, top left, bottom right; hovering pauses and swaps solid ↔ outline).
- **Order:** 01 Intro (bio) → 02 Experience → 03 Work → 04 How I work → 05 Contact → footer. Experience leads because client production work is the strongest proof.

## 7. Components

- **Section head:** eyebrow `NN — kicker`, heading with the dot; lede beside it from `lg` (5/12 + 7/12).
- **Buttons:** pill, 46px (38px small), Inter 500 15px. Primary `--cta` fill; secondary white with standard border; ghost text-only with subtle hover tint.
- **Chips:** pill, 12px Inter 500, `--subtle` fill, subtle border; `chip-signal` (8% blue) for "Published on crates.io".
- **Cards:** white, 1px `--line`, radius 20, padding 24 (lead up to 40), `shadow-sm` → `shadow-md` + 2px lift on hover.
- **Timeline:** `11rem | 2.5rem | 1fr` — date, a 1px spine with a 12px ring node (current: filled blue, soft pulse), role with blue-dot bullets, chips, and "Read the case study →" when the role has a case.
- **Work:** featured case card (problem first, numbered highlights), 2-up project cards, then the **Upstream / open source** list in one bordered card.
- **How I work:** a horizontal timeline. Five steps on one rail: the rail's blue fill draws left to right when the section is seen, then each 44px node lights up blue in turn (190ms apart) with its title and text fading up. Below `lg` it becomes a swipeable track with scroll-snap.
- **Easter egg switch:** the company pill in the hero is a button styled as a toggle. On hover/focus the avatar (the knob) slides to the right end with a slight spring, the text shifts left, a blue play glyph appears and the pill tints blue. A click keeps it "on" and opens **Dot Runner**.
- **Dot Runner** (`app-dot-runner`): a modal (overlay + blur, radius-28 panel) with a canvas game. The blue ab. dot jumps (Space, ↑, W, tap) over ink pills named after real bugs (`unwrap()`, `merge conflict`, `flaky test`, `deadlock`…) and collects commits (blue rings, +25). Speed ramps up; score, commits and best (localStorage) sit under the canvas; the grid drifts behind for depth. Colours come from the live theme tokens. Escape, the close button or the overlay close it; focus is trapped inside and returns to the switch; the page does not scroll while it is open; a hidden tab pauses the run.
- **Contact panel:** `--subtle` card, radius 28, the email as a large link, Copy button, three facts.
- **Footer:** always the dark section — tools grid, white monogram + sign-off + CTAs, the wordmark large in white, then copyright, section links and Brand / Email / GitHub.
- **Case pages** (`/projects/:id`, `/work/:id`): page shell with a 14rem "On this page" rail (pill links, active = blue tint). Order: Overview → The problem → What I built → Decisions (cards: context, a `--subtle` "Choice" block, optional code) → Result (only with real numbers) → What I learned → Under the hood (live repo stats, projects only).
- **Brand page** (`/brand`): stage with the full logo, the nine files as cards (preview on the surface each is drawn for; copy SVG / download), the palette as click-to-copy swatches, Inter specimens, clear space and sizes, Do / Don't.

## 8. Content rules

- Clear, confident, concise, technical but understandable. No buzzwords, no exaggerated claims.
- Impact numbers, travel availability and customer outcomes appear only when real.
- Facts may name Rust, Java or TypeScript; headlines, availability and CTAs stay technology-agnostic.

## 9. Do / Don't

**Do** use the role variables, end display and section headings on the blue dot, keep the soft mark on quiet light surfaces (white variant on dark), keep EN and IT as copy variants of one layout, and give every logo `alt="Alessandro Bruno"` unless the name is already adjacent text.

**Don't** reintroduce metallic, chrome or 3D tilt effects, glassmorphism on cards, neon or saturated backgrounds, a second accent colour, a second typeface, bounce/spin/morph motion, or detailed imagery behind the logo. Don't use `#3B82F6` for small text on white.
