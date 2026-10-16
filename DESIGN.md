# DESIGN.md — Soft Minimal & Fluid Interactive (`ab.`)

This document defines the unified design system for **Antonio Bernardini's** portfolio (`ab.`), directly derived from the official `ab.` folded-ribbon mark and its Soft Minimal brand identity.

---

## 1. Brand DNA: The `ab.` Logo as Architectural Blueprint

Every decision in the interface traces back to the three structural pillars of the `ab.` mark:

1. **Continuous Folded Ribbon Geometry (`20px–32px` radii)**
   - The `a` and `b` letterforms are built from smooth, continuous folded-ribbon curves without harsh corners.
   - All cards, containers, navbar pills, and modal sheets echo this geometry with generous radii (`--r-lg: 20px`, `--r-xl: 28px`, `--r-2xl: 36px`, `--r-pill: 9999px`) and spring-physics transitions (`cubic-bezier(0.22, 1, 0.36, 1)`).
2. **Tonal Fold Depth (Soft Cool-Gray Layers)**
   - Where the ribbon folds over itself in the logo, depth is created by subtle cool-gray luminance shifts (`#D5DCE6` vs `#E8ECF2`) rather than heavy black borders.
   - Light mode uses Soft Cool Gray `#E8ECF2` as the canvas (`--bg`), crisp elevated white `#F8FAFC` for cards (`--bg-elev`), and Fold Shadow `#DCE3EE` for recessed pills and interactive wells (`--bg-subtle`).
   - Dark mode mirrors the official dark logo card (`#111827` Deep Slate canvas, `#1B2436` elevated surface, `#243047` subtle surface).
3. **The Primary Blue Dot (`#3B82F6`)**
   - The circular blue period at the end of `ab.` is the primary focal anchor across the entire application.
   - Section headings, active navigation pills, live status indicators, and interactive highlights terminate or pulse with `.brand-dot` (`#3B82F6` in light, `#60A5FA` in dark).

---

## 2. Color Tokens (`src/styles.css`)

| Token | Soft Minimal Light (Default) | Deep Slate Dark | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg` | `#E8ECF2` | `#111827` | Primary canvas (matches official logo background) |
| `--bg-elev` | `#F8FAFC` | `#1B2436` | Elevated Bento & content cards |
| `--bg-subtle` | `#DCE3EE` | `#243047` | Recessed pills, tabs, and filter wells |
| `--fg` | `#1F2937` | `#F9FAFB` | Primary Deep Ink / Pure White typography |
| `--muted` | `#4B5563` | `#9CA3AF` | Body copy and secondary descriptions |
| `--faint` | `#6B7280` | `#6B7280` | Metadata, timestamps, and keycaps |
| `--accent` | `#3B82F6` | `#60A5FA` | Primary Blue Dot & interactive states |
| `--accent-soft` | `rgba(59, 130, 246, 0.12)` | `rgba(96, 165, 250, 0.15)` | Pill backgrounds and active halos |

---

## 3. Typography

- **Sans (`--font-sans`)**: `'Plus Jakarta Sans'` — geometric, rounded, and approachable, matching the circular bowls of the `ab.` mark.
- **Display (`--font-display`)**: `'Plus Jakarta Sans'` with tight tracking (`-0.035em`) and bold weights (`700`) so headings feel like an extension of the logo.
- **Mono (`--font-mono`)**: `'JetBrains Mono'` — used strictly for numeric metrics, LOC counters, keyboard shortcuts (`<kbd>`), and stack badges.

---

## 4. Layout & Information Architecture (Designed for Hiring Managers)

- **Hero + Brand & Proof Bento (`src/app/intro.component.ts`)**:
  - 2-column layout pairing full-spectrum positioning (*AI & Agents · Backend · Web & Mobile · Simulations & Systems*) with a 3-card Bento cluster (interactive `ab.` ribbon card, live Luna S.r.l. production impact card, and academic/tooling credentials).
  - Interactive 4-Pillar **Full-Spectrum Capability Matrix** in Section `01` so recruiters can inspect concrete deliverables and tech stacks per domain.
- **Experience Split Sticky Architecture (`src/app/experience.component.ts`)**:
  - Left sticky summary column with Luna S.r.l. context, 4-metric KPI strip (`20+ repos`, `12 microservices`, `2 production tracks`, `3.8K+ commits`), and Case Study spotlight card.
  - Right column with elevated role cards and Bachelor's thesis breakdown.
- **Projects with Category Filters & Visual Previews (`src/app/projects.component.ts`)**:
  - Filterable by `All work`, `AI & Agents`, `Rust & Systems`, `Web & Full-Stack`, and `Games & Simulation`.
  - Flagship showcase for **Trama** + 2-column Bento grid with 16:9 screenshot previews (`gallery[0]`) or key engineering bullets.
  - Project detail pages (`src/app/project-page.component.ts`) feature a prominent **Live Codebase Scale Banner** powered by full-tree GitHub recursive analysis (`src/lib/github-project.ts`).
- **Interactive 5-Step Workbench (`src/app/approach.component.ts` & `src/app/decisions.component.ts`)**:
  - Master-detail workbench where Step `01` is open immediately on load—zero hidden double-click interactions.
  - Engineering trade-offs displayed as structured `Context -> Chosen -> Why` cards.

---

## 5. Performance & Discoverable Keybinds

- **60fps Idle-Aware Canvas Grid**: The Hero background uses a single lightweight 2D `<canvas>` (`#gridCanvas` in `src/app/intro.component.ts`) that renders only during active pointer movement and pauses its `requestAnimationFrame` loop (`rafId = 0`) when idle.
- **Global Keyboard Shortcuts (`src/app/keybinds-hud.component.ts`)**:
  - `1–5` jump to sections, `T` toggles theme, `L` switches language (`EN`/`IT`), `C` copies email, `G` opens the Engineering Arcade, `B` opens Brand Guidelines, `H` returns home/top, `P` triggers a Blue Dot celebration burst, `?` opens the shortcuts guide, plus the Konami code (`↑↑↓↓←→←→BA`).
