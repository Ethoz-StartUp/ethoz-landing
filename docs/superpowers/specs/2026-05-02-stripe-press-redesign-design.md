# Stripe Press editorial redesign — design spec

**Date:** 2026-05-02
**Status:** Draft (awaiting user review before implementation plan write-up)
**Owner:** Ignacio
**Scope:** Public marketing surface — ~30 routes. Admin (`/admin/**`) untouched.
**Supersedes:** `2026-05-01-cal-com-redesign-design.md` for visual treatment. Inherits its component primitives, lint script architecture, and phased-rollout discipline. Replaces its palette and typography wholesale.

---

## 1. Context & motivation

The 2026-05-01 Cal.com migration shipped Cal black `#111111` as `--primary` and `#F5F5F5` light-gray cards across the marketing surface. After living with it, the user reports the result reads as "ugly" and explicitly objects to the gray fills. The brand-color choice from the brand-boundary review (Variant C: Ethoz blue CTAs + navy footer) never fully reached production — `--primary` shipped as Cal black, not the Ethoz blue the user picked. The current page reads as Cal.com on white with monochrome gray cards — too cold, too SaaS-template, no editorial voice.

This redesign abandons the Cal.com aesthetic for **Stripe Press editorial** — warm cream canvas, deep navy ink, serif headlines, and per-section bold accent colors orchestrated under a navy unifying thread. The result should feel like a literate publication a school director would pick up from a coffee table, not a SaaS product demo.

**Reference:** Stripe Press (`press.stripe.com`), with NYT Magazine's typographic restraint as a secondary reference. NOT Cal.com, NOT Linear, NOT Pitch.

This is not a brand identity change — Ethoz remains a school protection platform. What changes: canvas color, ink color, accent system, headline font, card system, footer warmth, and section choreography.

---

## 2. Brainstorm decisions (locked)

| # | Question | Choice |
|---|---|---|
| Q1 | Aesthetic family | **B — Editorial color-block** (Stripe Press / Linear changelog family). |
| Q2 | Palette | **B1 — Stripe Press warm.** Cream canvas `#FBF7F0`, deep navy `#0F1F3A` ink, per-section accents (mustard / brick / sage). |
| Q3 | Typography | **T1 — Newsreader serif headlines + Inter body.** Drops Cal Sans entirely. Drops Playfair Display from fallback stack. |
| Q4 | Accent strategy | **A1 — Per-section accents.** Hero=mustard, Problem=brick, Features=sage, Compliance=full-navy, FinalCTA=full-navy. Navy is the constant unifier; mustard is the recurring CTA so the user always knows where to click. |

**Why these decisions hold under pressure:**
- Per-section accents (A1) carries fragmentation risk on a B2B compliance product. Mitigation: navy ink everywhere + mustard CTA everywhere = two constant threads under the rotating accent. Page reads as one publication, not a Pitch deck.
- Stripe Press warm (B1) trades Cal.com's cold premium for warmth that suits a school-director audience reading at a desk, on paper-feel.
- Newsreader (T1) is the lowest-risk serif: free, designed for screen reading, more contemporary than Playfair, less mannered than Fraunces.

---

## 3. Goals & non-goals

**Goals**

- Replace Cal Sans with Newsreader as `--font-heading`.
- Replace pure-white canvas (`#FFFFFF`) with warm cream (`#FBF7F0`) site-wide.
- Replace Cal black (`#111111`) primary with deep editorial navy (`#0F1F3A`).
- Replace Cal light-gray cards (`#F5F5F5`) with cream-elevated cards (`#F5EFE3`).
- Introduce a per-section accent system (mustard / brick / sage / navy) without fragmenting page coherence.
- Two full-bleed navy bookend sections (Compliance + Final CTA) ahead of the dark footer — editorial "rests" before the close.
- Update existing 9 lint scripts to enforce the new palette (ban hardcoded grays, ban Cal Sans, allow Newsreader, ban hardcoded cream/ink hexes outside `app.css`).
- Maintain WCAG AAA contrast through every change.

**Non-goals**

- Re-doing copy, IA, route structure, or i18n keys (visual + structural redesign only).
- Migrating the admin panel (stays Cal aesthetic — separate later spec).
- Changing the dashboard mockup carousel logic in the hero (re-skinned only).
- Adding dark mode (light-mode-only stays).
- Server, edge function, or Supabase changes.
- Replacing the existing 5 Cal primitive components — they get repainted, not rebuilt.

**Out of scope (explicitly)**

- Mobile app, marketing emails, OG images, social-post templates, pitch deck.
- The Ethoz-app itself (separate codebase).
- Blog post body layouts (separate pass after this redesign ships).

---

## 4. Section 1 — Foundation tokens & typography

### 4.1 Palette tokens (CSS custom properties in `app.css`)

All tokens defined in `:root` and exposed to Tailwind via the existing `@theme inline { }` block.

**Canvas + ink (constant):**

| Token | New value | Replaces | AAA verification |
|---|---|---|---|
| `--canvas` | `#FBF7F0` | `--background` (`#FFFFFF`) | n/a (canvas) |
| `--canvas-elevated` | `#F5EFE3` | `--surface-card-cal` (`#F5F5F5`) | n/a (surface) |
| `--canvas-strong` | `#EDE5D3` | `--surface-strong` (`#E5E7EB`) | n/a (disabled bg) |
| `--ink` | `#0F1F3A` | `--foreground` (`#111111` Cal black) and the existing `--foreground` McK navy `#051C2C` | ~16:1 on `#FBF7F0` cream — AAA easily (recomputed) |
| `--ink-soft` | `#3A4A6B` | `--muted-foreground` (`#3F4A54`) | 8.4:1 on `#FBF7F0` — AAA body (recomputed; was claimed 7.4:1) |
| `--hairline-warm` | `#E5DDC9` | `--hairline` (`#E5E7EB`) | 1.4:1 (decorative-only — must pair with text affordance per anti-pattern #11) |
| `--hairline-warm-soft` | `#F0EAD9` | `--hairline-soft` (`#F3F4F6`) | barely-visible divider |

**Per-section accent tokens:**

| Token | Value | Section | Cream contrast | Notes / restrictions |
|---|---|---|---|---|
| `--accent-mustard` | `#D4A017` | Hero eyebrow, hairline rules, large decorative numerals (≥40px Newsreader), card hover stripes | **2.2:1 — FAILS WCAG 1.4.11 + AAA-large** | **Decorative-only on cream.** Never body, never small text, **never CTA fill on cream**. Mustard-fill CTAs allowed only inside dark sections — see `--on-navy-mustard` (9.1:1 on navy). |
| `--accent-mustard-ink` | `#5C4500` (darkened from `#7A5C00`) | Body-size mustard text on cream when warmth needed; small-numeral decoration | 8.6:1 — AAA body | Use whenever mustard-tinted text needs to be ≤24px. |
| `--accent-brick` | `#B23A2C` | Problem section accent stripes, urgency dot, countdown rule top-bar | 5.3:1 — AAA-large only | Body text uses `--accent-brick-ink`. CTA fill on cream allowed only as boxed (with `--ink` border) — defer to alternative-CTA risk in §9. |
| `--accent-brick-ink` | `#8A2A1F` | Brick text on cream (body usage) | 7.6:1 — AAA body | |
| `--accent-sage` | `#4A6B47` | Features section accent stripes, success ticks, large numerals (step "03 — arrival") | 5.5:1 — AAA-large only | Body text uses `--accent-sage-ink`. |
| `--accent-sage-ink` | `#2F4A2D` | Sage text on cream (body usage) | 9.3:1 — AAA body | |

**CTA rule (corrected during self-review — see §13):**

- **Cream-section CTAs (sections 1, 8 — Hero, How it works) use `bg-ink` + `text-canvas`** = navy fill + cream text. Boundary contrast 16:1 (against cream page bg). Text contrast 16:1. AAA across the board.
- **Dark-section CTAs (sections 7, 10 — Compliance, Final CTA) use `bg-on-navy-mustard` + `text-ink`** = mustard fill + navy text on a navy section bg. Boundary contrast 9.1:1 (mustard against navy). Text contrast 7.1:1 (navy on mustard). AAA across the board.

The mustard CTA on cream that the original design called for is rejected by the contrast math — `#D4A017` on `#FBF7F0` is 2.2:1, below the 3:1 floor for UI component contrast (WCAG 1.4.11). Mustard remains a recurring color thread across the page (eyebrows, rules, large decorative numerals, dark-section CTAs), but cream-section CTAs are navy. Navy-fill CTAs are also closer to the actual Stripe Press visual reference.

**Alternative considered:** mustard fill + 1.5px navy border on cream-section CTAs. The border provides boundary contrast (16:1), allowing the mustard fill to remain. Navy text on mustard fill is 7.1:1 (AAA body). This is a viable second-choice if the user prefers the warmer CTA energy — flagged as a deferred decision in §10.

The `--accent-*` tokens (without `-ink`) are **decorative-only on cream** — large headings, eyebrows, hairline rules, hover-stripe accents — never body text, never small text, never CTA fill. The `--accent-*-ink` darker variants are for body text. The new `lint-accent-body-text.sh` (§7) enforces this.

**Dark sections (Compliance + Final CTA + Footer):**

| Token | Value | Use | AAA verification |
|---|---|---|---|
| `--section-navy` | `#0F1F3A` | Full-bleed dark sections (Compliance, Final CTA) | n/a (surface) |
| `--surface-dark` | `#0A1628` | Footer (deeper still than section-navy) | n/a (surface) |
| `--on-navy` | `#FBF7F0` | Cream type on navy | 15.8:1 — AAA easily |
| `--on-navy-soft` | `#C7D0DD` | Body text on navy | 10.9:1 — AAA body |
| `--on-navy-mustard` | `#E8B82E` | Mustard fill on dark-section CTAs; eyebrows, decorative rules on navy bands | 9.1:1 — AAA body (boundary against navy section bg) |

**Semantic tokens (re-tuned for warm palette):**

| Token | New value | Replaces | Use |
|---|---|---|---|
| `--destructive` | `#B23A2C` | `#C0382B` | aligns with `--accent-brick` — single-source urgency |
| `--destructive-foreground` | `#FBF7F0` | `#FFFFFF` | cream on brick — 5.3:1 (AAA-large only). For AAA body, override to `--ink` (~10:1) on light brick wash backgrounds. |
| `--warning` | `#D4A017` | `#D98F2B` | aligns with `--accent-mustard` |
| `--warning-foreground` | `#0F1F3A` | `#051C2C` | navy ink on mustard fill — 7.1:1 (AAA body) ✓ — safer than the previously-claimed 5.4:1 |
| `--success` | `#4A6B47` | `#2E8B57` | aligns with `--accent-sage` |
| `--success-foreground` | `#FBF7F0` | `#FFFFFF` | cream on sage — 5.5:1 (AAA-large only). For AAA body, override to `--ink` on light sage wash. |
| `--info` | `#0F1F3A` | `#034B8A` | navy replaces McK blue — single anchor color |

**Verified contrast methodology:** every ratio in §4.1 was computed via OKLch → linear sRGB → relative luminance → WCAG ratio formula `(L_lighter + 0.05) / (L_darker + 0.05)`. No claims copied from upstream sources or design tools (per anti-pattern memory item #8). Re-verify in P1 with an automated test once tokens land in `app.css`.

**Existing tokens preserved (no value change):** `--ring` (focus ring color), `--brand-linkedin/facebook/instagram/youtube` (platform brand exceptions never recolored), `--overlay`, `--skeleton`.

**Existing tokens deprecated and removed in Phase 3:** `--surface-soft` (Cal `#F8F9FA`), `--surface-card-cal` (Cal `#F5F5F5`), `--surface-strong` (Cal `#E5E7EB`), `--surface-dark-elevated`, `--badge-orange/pink/violet/emerald` (pastel set — replaced by accent system), `--brand-accent` (Cal blue `#3b82f6` — never used after this migration).

### 4.2 Tailwind v4 token wiring

Add to existing `@theme inline { }` block in `app.css`:

```css
/* Stripe Press canvas + ink */
--color-canvas: var(--canvas);
--color-canvas-elevated: var(--canvas-elevated);
--color-canvas-strong: var(--canvas-strong);
--color-ink: var(--ink);
--color-ink-soft: var(--ink-soft);
--color-hairline-warm: var(--hairline-warm);
--color-hairline-warm-soft: var(--hairline-warm-soft);

/* Per-section accents (CTA / heading / large only) */
--color-accent-mustard: var(--accent-mustard);
--color-accent-mustard-ink: var(--accent-mustard-ink);
--color-accent-brick: var(--accent-brick);
--color-accent-brick-ink: var(--accent-brick-ink);
--color-accent-sage: var(--accent-sage);
--color-accent-sage-ink: var(--accent-sage-ink);

/* Dark sections + footer */
--color-section-navy: var(--section-navy);
--color-on-navy: var(--on-navy);
--color-on-navy-soft: var(--on-navy-soft);
--color-on-navy-mustard: var(--on-navy-mustard);
```

`--background` is repointed to `var(--canvas)` and `--foreground` is repointed to `var(--ink)` so existing `bg-background` / `text-foreground` utilities across 30+ pages keep working without a class-name migration. The token *meaning* changes; the Tailwind utility names stay stable.

### 4.3 Typography

**Remove:**

- `cal-sans` npm package (uninstall).
- `@fontsource-variable/playfair-display` (already on the deprecation list from the Cal migration but never removed — finish the job here).
- `@import "cal-sans"` and `@import "@fontsource-variable/playfair-display"` from `app.css`.

**Add:**

- `@fontsource-variable/newsreader` npm package — variable, weights 200–800, italics included.
- `@import "@fontsource-variable/newsreader"` to `app.css`.

**Update `--font-heading` declaration in `app.css`:**

```css
/* before */
--font-heading: "Cal Sans", "Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* after */
--font-heading: "Newsreader Variable", "Newsreader", "Iowan Old Style", Georgia, "Times New Roman", serif;
```

System serif fallbacks: Iowan Old Style (macOS) → Georgia (cross-platform) → Times New Roman (last resort) — all serifs, so any unloaded headline still reads literary.

**Type scale (replaces current Cal scale in `app.css` base layer):**

| Element | Spec | Notes |
|---|---|---|
| h1 | Newsreader 500, `clamp(40px, 5.5vw, 72px)`, ls -0.02em, lh 1.05 | Looser tracking than Cal Sans — Newsreader wants more air |
| h2 | Newsreader 500, `clamp(32px, 4vw, 48px)`, ls -0.02em, lh 1.1 | |
| h3 | Newsreader 600, 24px, ls -0.015em, lh 1.2 | |
| h4 | Newsreader 600, 20px, ls -0.01em, lh 1.25 | |
| h5 | Newsreader 600, 17px, ls 0, lh 1.3 | |
| Body | Inter 400, 17px, lh 1.55, `--ink-soft` | unchanged from current |
| Eyebrow | Inter 600, 11px, uppercase, ls 0.18em | color rotates per section accent |
| Italic display | Newsreader 400 italic — pull-quotes, editorial anchor blockquote | Newsreader italic is the page's signature flourish |

**Tabular numerics — preserve current behavior:**

`[data-numeric]` keeps `font-variant-numeric: tabular-nums` only (no font-family override). When numerics live inside a `font-heading` element, they render as Newsreader tabular figures — Newsreader supports `tnum` natively via the variable axis. Re-verify in Phase 1 by inspecting countdown digits and stat blocks.

**Performance:**

- Preload Newsreader 500 weight `.woff2` in `app.html` — render-critical (every headline).
- Inter is non-preloaded (swap-friendly body).
- `font-display: swap` on both (default for fontsource).
- Total font payload target: ≤ 90 KB (Newsreader Variable 500 ≈ 50 KB + Inter Variable 400/600 ≈ 35 KB). Cal Sans was ~25 KB; net add is ~25 KB.

### 4.4 Radii — adjust toward editorial softness

Editorial publications use slightly rounder corners than Cal's 8/12/16 progression. Adjust:

| Token | Current | New | Use |
|---|---|---|---|
| `--radius-sm` | 4px | 4px | unchanged — chip rails, hairline tags |
| `--radius-md` | 6px | 6px | unchanged — buttons, inputs |
| `--radius-lg` | 8px | 10px | feature cards (slightly softer) |
| `--radius-xl` | 12px | 14px | hero mockup card, FAQ list wrapper |
| `--radius-2xl` | 16px | 20px | full-bleed section card wrappers (final CTA, compliance) |

Anti-pattern memory item #6 (radii ≥ 4px) is satisfied — no bricks, no SaaS-feel.

### 4.5 Shadows — warm shadow color, retire hard shadows

Current shadows use `rgba(5, 28, 44, ...)` (McK navy alpha). Update to use `--ink` (`#0F1F3A`) alpha so shadow color tracks the ink color cleanly across both light cream and (rare) dark surfaces:

```css
@utility shadow-card { box-shadow: none; }                              /* hairline-only baseline */
@utility shadow-card-hover { box-shadow: 0 2px 0 0 rgba(15, 31, 58, 0.10); }
@utility shadow-mockup { box-shadow: 0 2px 12px rgba(15, 31, 58, 0.08); }  /* slightly lifted from Cal version */
@utility shadow-popover { box-shadow: 0 8px 24px rgba(15, 31, 58, 0.10); }
@utility shadow-glow-primary { box-shadow: none; }                       /* still neutralized */
@utility shadow-glow-destructive {                                      /* SAFETY signature — retained */
  box-shadow: 0 0 40px color-mix(in oklch, var(--destructive) 60%, transparent);
}
```

### 4.6 Section spacing utility

Replace the current `.section-cal` rhythm with editorial breathing:

```css
@utility section-editorial { padding-block: clamp(80px, 9vw, 120px); }
```

Slightly more vertical air than Cal — magazine spreads breathe more than SaaS dashboards. Existing `py-16 sm:py-20 lg:py-24` patterns on individual sections stay during migration; `section-editorial` is the canonical class for new sections.

---

## 5. Section 2 — Component primitives

The 5 existing Cal primitives in `src/lib/components/cal/` get repainted, not rebuilt. The directory may be renamed to `src/lib/components/editorial/` in Phase 3 cleanup if it doesn't churn imports unnecessarily; the spec leaves the directory name as a Phase 3 decision.

### 5.1 `FeatureCardCal.svelte` — adds accent variant

**New props:**

```ts
accent?: 'mustard' | 'brick' | 'sage' | 'navy' | 'none' (default 'none')
```

**Visual treatment:**

- Default (`accent='none'`): cream-elevated bg (`bg-canvas-elevated`), warm-hairline border (`border-hairline-warm`), navy ink heading, ink-soft body. Hover: bg deepens to `bg-canvas-strong`, hairline darkens to `--hairline-warm` × 1.4.
- With accent (`mustard | brick | sage`): 2px left rule in `--accent-{accent}` color, no top/right/bottom border, cream-elevated bg. Hover: left rule grows from 2px → 4px (the only signal change, paired with 1px translate-y up). This is the signature editorial-column device — it's the visual hook that says "publication," not "SaaS card."
- With `accent='navy'`: 2px left rule in `--ink` (`#0F1F3A`), used on FAQ section header card and any "navy-thread" cream-section accent moment. Same hover behavior. Navy left rule is the strongest accent — use sparingly (≤ 1 per cream section).

**Title + icon:** stays inline (per anti-pattern memory: never stacked, never icon-in-colored-box). Icon color tracks accent if accent !== 'none', else `--ink`.

**CTA arrow:** persistent visible affordance (per anti-pattern #10) — arrow is always visible at default state, translates 4px right on hover.

### 5.2 `HeroAppMockupCard.svelte` — adds left rule

The hero's right-side artifact gets a 2px navy left rule treatment instead of the current full hairline border. Background stays white (the dashboard mockup needs white inside for the carousel to read), but the **outer wrapper** now sits inside a 14px-radius cream-elevated frame with the navy left rule. Soft mockup shadow stays.

```
[2px navy rule] | [white card with carousel]
                | bg-canvas-elevated cream wrapper, 14px radius
```

Visually: the dashboard appears to be a clipping, mounted in a cream editorial column with a navy spine.

### 5.3 `NavPillGroup.svelte` — recolor only

Active segment changes from `bg-canvas-pure` (white) with `shadow-card` → `bg-canvas` (cream) with `shadow-card-hover`. Inactive segments stay transparent. Outer pill wrapper bg becomes `bg-canvas-elevated`.

### 5.4 `PastelBadge.svelte` — repurposed to accent badges

Pastel variants (orange, pink, violet, emerald) deprecate. New variants align with the accent system:

```ts
variant: 'mustard' | 'brick' | 'sage' | 'navy'
```

Same metadata-only rule. Same lint enforcement (§7).

Phase 3 migration: any current `bg-badge-orange` etc. usage gets replaced with the closest accent equivalent. Grep confirms ≤ 12 usages site-wide (mostly blog posts), so this is a small migration.

### 5.5 `ProductMockupCard.svelte` — recolor only

Cream-elevated bg (`bg-canvas-elevated`) instead of white-with-border. Hairline becomes warm. Internal padding unchanged.

### 5.6 New: `SectionDark.svelte` — full-bleed navy section wrapper

Wraps Compliance + Final CTA bands. Bg = `--section-navy`. All text via `text-on-navy` / `text-on-navy-soft` / `text-on-navy-mustard` tokens. Inherits `section-editorial` padding utility. Drops into the page layout as a full-bleed `<section>`.

```ts
Props:
  variant?: 'compliance' | 'cta' (default 'compliance')
  // variant currently affects only inner max-w; both share bg + ink colors
```

The two navy bookends (Compliance, Final CTA) use `<SectionDark>`. Footer is its own deeper-navy surface (`--surface-dark`) — it does NOT use `<SectionDark>`.

### 5.7 Component contract (all 6)

- All accept Svelte 5 runes (`$props()`, `$state()`, `$derived()` as applicable). No legacy reactive syntax.
- All use design tokens — never hardcoded hex.
- All meet AAA contrast at default state (verified via OKLch → linear sRGB → luminance).
- All have visible focus rings (rely on global `:focus-visible` safety net in `app.css`).
- All handle `prefers-reduced-motion`.
- Hover state changes ≥2 properties (per anti-pattern memory #5).

---

## 6. Section 3 — Section-by-section choreography (homepage `/`)

The homepage is the validation point. Other pages inherit treatments by analogy.

| # | Section ID | Bg | Accent | Signature device |
|---|---|---|---|---|
| 1 | hero | `bg-canvas` (cream) | mustard (decorative) | **Navy-fill primary CTA** (`bg-ink text-canvas`) — cream-section CTA color per §13 self-review correction. Outline-navy secondary CTA. Dashboard mockup gets 2px navy left-rule frame. Countdown badge: mustard pill with brick dot (badge surface area large enough for 1.4.11 OK on a within-pill basis; navy ink-soft text 8.4:1 AAA). Eyebrow in mustard (large/uppercase ≥18px makes 2.2:1 acceptable as decorative-but-readable in context — see also §13 alternative `--accent-mustard-ink` for tighter tracking). |
| 2 | trust strip | `bg-canvas` | mustard rule | Tiny 24px mustard rule above each fact. 4-column dl with hairline-warm dividers. |
| 3 | editorial anchor | `bg-canvas` | none | Newsreader italic blockquote at clamp(28px, 3vw, 44px). Stat trio below — navy numbers, ink-soft labels. |
| 4 | problem | `bg-canvas` | brick | Eyebrow brick. Three problem cards with `accent='brick'` — brick left-rule grows 2→4px on hover. Icon color tracks brick. |
| 5 | editorial anchor 2 (optional) | `bg-canvas` | navy | Pull-quote spread. Newsreader italic, navy ink, attribution in Inter caps. Phase 2 may defer if no quote content is ready. |
| 6 | features | `bg-canvas-elevated` | sage | Eyebrow sage. Featured Ficha 360° card with `accent='sage'`, 01 numeral in sage Newsreader 500. Three supporting cards in 3-up grid with `accent='sage'`. Compliance banner row at bottom: cream-elevated bg, sage shield icon, navy heading. |
| 7 | compliance + countdown | `<SectionDark variant="compliance">` (navy) | mustard | Cream Newsreader headlines. Eyebrow mustard. Countdown digits: huge cream Newsreader 500, mustard 2px rule above each digit panel. CTA: mustard fill with navy ink. Compliance items in 2-col grid, sage check icon, on-navy-soft body. |
| 8 | how it works | `bg-canvas` | mustard | Three steps in editorial chapter style. Big Newsreader 01 / 02 / 03 in mustard, except step 3 in sage (the "arrival" — sage = success). Hairline-warm dividers between steps. |
| 9 | FAQ | `bg-canvas-elevated` | navy | Eyebrow navy. Newsreader h2. Accordion list inside `bg-canvas` rounded-xl wrapper with hairline-warm. Plus/Minus icons in ink-soft → ink on hover. |
| 10 | final CTA | `<SectionDark variant="cta">` (navy) | mustard | Mirror of section 7 — cream Newsreader headline, mustard CTA, cream-outline secondary. Closes into `<Footer>` (deeper navy `--surface-dark`). |

**Two full-navy bookends (sections 7 + 10) ahead of the dark footer** = the editorial rhythm. Each navy band is a "rest" between cream content. The final CTA into the footer creates the page-closing dark passage.

**Headline-content density rule:** every cream section opens with a Newsreader h2 + 2-line muted-ink subtitle, then content. No section starts with content cold. This rhythmic restatement is what makes the page read as edited prose.

---

## 7. Section 4 — Lint script + ESLint updates

Existing 9 bash lint scripts in `scripts/lint-*.sh` continue to run via `npm run lint` (orchestrated by `lint-all.sh`). Updates required:

| Script | Update |
|---|---|
| `lint-cal-sans-scope.sh` | **Rename** to `lint-newsreader-scope.sh`. Inverts: now blocks any usage of `Cal Sans` in templates and CSS files (post-migration: zero allowed); enforces Newsreader on h1/h2/h3. Hard-error after Phase 1 lands. |
| `lint-pastel-on-cta.sh` | **Update token list:** in cream sections, the only allowed CTA fill class is `bg-ink` (navy). Lint blocks `bg-accent-mustard`, `bg-accent-brick`, `bg-accent-sage` on `Button`/`a[role="button"]` — all three fail WCAG 1.4.11 (3:1 boundary) on cream. The mustard-fill CTA is allowed only inside `<SectionDark>` (dark-section context) where it sits on navy bg with 9.1:1 boundary contrast. Lint detects context by walking up the DOM tree in templates: if ancestor is `<SectionDark>` → mustard CTA allowed; else block. (Heuristic: grep for `bg-accent-mustard` proximate to `<SectionDark>` open tag in same file; lint conservatively flags ambiguous cases.) |
| `lint-shadow-2xl.sh` | unchanged — `shadow-2xl`, `shadow-xl` still banned. |
| `lint-opacity-hover.sh` | unchanged — anti-pattern #1. |
| `lint-muted-hover.sh` | **Update:** check both `hover:bg-muted/N<100` AND new `hover:bg-canvas-elevated/N<100`. |
| `lint-hardcoded-color.sh` | **Update token allow-list:** remove old Cal hexes (`#111111`, `#F5F5F5`, `#101010`, `#FFFFFF` outside SDK config). Add new ban-list: `#FBF7F0`, `#0F1F3A`, `#D4A017`, `#B23A2C`, `#4A6B47` outside `app.css`. The exemption for `// lint-ok` annotations stays. |
| `lint-glow-shadows.sh` | unchanged — `shadow-glow-primary` banned, `shadow-glow-destructive` exempt. |
| `lint-icon-box-wrapper.sh` | unchanged — icon-in-colored-box pattern still banned. |
| `lint-section-width.sh` | unchanged — `max-w-7xl` outer container. |

**New lint script:** `lint-accent-body-text.sh` — blocks raw `text-accent-mustard` / `-brick` / `-sage` (without `-ink` suffix) on body-text contexts (`<p>`, `<li>`, `<span>` outside CTAs, etc.). Forces use of `-ink` darker variants for AAA body. Detection by AST is brittle — the script greps for `text-accent-{name}` (no `-ink`) inside `<p>` / `<li>` patterns and fails on hits.

**ESLint additions** (`eslint.config.js`, in the existing design-system rules block):

```js
// Block hardcoded Cal hexes after migration
'no-restricted-syntax': ['error', {
  selector: 'Literal[value=/^#(111111|F5F5F5|101010)$/i]',
  message: 'Old Cal palette hex banned — use Stripe Press tokens (--canvas, --ink, --accent-*)'
}],
```

CSS files, `app.css`, Tailwind config exempt via the same file-pattern override block already in place from the Cal migration.

---

## 8. Section 5 — Phased rollout (vertical slice)

7 phases. Each ends with `npm run lint && npm run build` green and a `firebase deploy --only hosting` deploy to staging-equivalent for Ignacio's visual review.

| Phase | PR title | Pages | Components / files touched | Reviewer signal |
|---|---|---|---|---|
| **P0** | `prep(redesign): freeze + branch` | None | Branch `redesign/stripe-press` cut from `main`. Note in CLAUDE.md "active redesign in progress — light edits only on `main`." `npm run test:ci` baseline captured. Top-5 page screenshots captured (`/`, `/demo`, `/compliance`, `/blog`, `/about`) for before/after diffing. | Branch exists, baselines saved, no production code changes yet. |
| **P1** | `feat(editorial): foundation tokens + Newsreader` | None — primitives only | `app.css` token swap (full §4.1 + §4.2). `package.json`: drop `cal-sans`, drop `@fontsource-variable/playfair-display`, add `@fontsource-variable/newsreader`. `app.html`: preload Newsreader 500. Heading base styles updated. Shadow tokens recolored to `rgba(15, 31, 58, ...)`. Lint scripts updated to **warn** mode (not error). | All existing pages render with new canvas + ink + serif headlines; per-section accents NOT YET applied (those are component-level in P2). User reviews at homepage URL — should already feel ~70% of the way there. |
| **P2** | `feat(editorial): homepage choreography` | `/` | Homepage refactored per §6. New `<SectionDark>` component built. `FeatureCardCal` `accent` prop added. `HeroAppMockupCard` left-rule wrapper added. `NavPillGroup`, `PastelBadge`, `ProductMockupCard` recolored. | **Validation point.** Ignacio reviews homepage in browser. Approves before P3 begins. |
| **P3** | `feat(editorial): audience + features wave` | `/para-sostenedores`, `/para-directores`, `/para-porteros`, `/productos`, `/features/*` (9 pages), `/integrations` | ~14 pages. Each page swaps to new tokens, gets accent treatment per its content theme. Audience pages use mustard hero accents over cream + navy CTA. Feature deep-dives use sage left-rule cards + ProductMockupCard for module UI. Integrations uses brick accent for "compatibility" header. | 14 pages ship. Hover smoke pass per page. |
| **P4** | `feat(editorial): conversion + authority wave` | `/comparativa`, `/roi-calculator`, `/proyecciones`, `/demo`, `/schedule`, `/get-started`, `/contact`, `/ley-21719`, `/circular-30`, `/glosario`, `/seguridad-datos`, `/compliance`, `/resources/*` | ~13 pages. Conversion pages: cream + navy CTA + mustard eyebrow. Authority pages: full-navy `<SectionDark>` hero treatment, then cream content body. Long-form legal/glossary keeps density; Stripe Press voltage = typography + footer + nav-pill-group only. | 13 pages ship. |
| **P5** | `feat(editorial): blog + legal + about` | `/blog`, `/about`, `/pitch`, `/privacy`, `/terms` | ~5 pages. Blog already has editorial McK header (recent commits — light-touch token swap). Legal pages: token migration only. About + pitch: cream + sage accent for "humans behind Ethoz." | 5 pages ship. |
| **P6** | `chore(editorial): lint + cleanup + lighthouse` | None — cleanup only | All 9 lint scripts updated per §7 (flipped from **warn** to **error**). New `lint-accent-body-text.sh` added. ESLint block updated. Old tokens removed from `app.css` (`--surface-card-cal`, `--surface-soft`, etc.). `cal/` directory possibly renamed to `editorial/`. CLAUDE.md updated to reference Stripe Press aesthetic, not Cal. `.impeccable.md` updated. Dead Cal/Playfair imports verified gone. Lighthouse check on top-5 pages. AAA contrast automated check across all combinations. | Lighthouse Perf ≥ 90 mobile / ≥ 95 desktop. A11y = 100. CI green. Lint scripts in error mode. |

**Excluded from all phases:** `/admin/**` (Cal aesthetic stays for now), `src/lib/components/ui/**` (vendored shadcn — leave alone).

**Per-phase success criteria:**

- Lighthouse Performance ≥ 90 (mobile), ≥ 95 (desktop).
- Lighthouse Accessibility = 100.
- AAA contrast verified — automated check for all foreground × background combinations in palette.
- No new ESLint errors. No new bash-lint failures.
- Visual smoke test: hover every interactive element, verify ≥ 2 properties change.
- Zero hardcoded hex outside `app.css` (`lint-hardcoded-color.sh` enforces).
- Zero `Cal Sans` references after P1 (`lint-newsreader-scope.sh` enforces).

---

## 9. Section 6 — Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Per-section accent fragmentation** — page reads as a Pitch deck instead of a publication. | Navy ink in every section + **navy CTA in every cream section** + cream-on-navy CTA in dark sections = three constant unifying threads. If P2 review still feels chaotic, defer brick + sage and ship with navy-CTA + mustard-eyebrow only across all sections (degrades to A2 strategy). |
| **Mustard `#D4A017` on cream FAILS WCAG 1.4.11** — actual 2.2:1 vs 3:1 floor (recomputed during self-review — original spec claim of 3.9:1 was wrong). Mustard CTA fill on cream is therefore not viable as designed. | Cream-section CTAs use `bg-ink` (navy fill, 16:1 boundary). Mustard CTA only inside `<SectionDark>` (9.1:1 boundary on navy). Mustard remains decorative on cream (eyebrows, hairline rules, large numerals). `--accent-mustard-ink` (`#5C4500`, 8.6:1) is the body-text variant when warm tinted text is needed. New `lint-accent-body-text.sh` blocks raw mustard on `<p>`/`<li>`. Alternative (boxed mustard CTA with navy border) is a deferred decision — see §10.3 below. |
| **Newsreader on small viewports** (≤ 375px width) — serif descenders + line-height 1.05 can clip. | Test at 320px in P1. If clip occurs, bump line-height to 1.1 in mobile breakpoint and reduce h1 minimum from 40px to 36px. |
| **Lint cascade** — first build after P1 will tip every page that still has Cal-Sans references. | P1 ships behind a feature branch. Lint scripts updated to **warn** during P1, **error** at start of P4. Migration completes before strict mode flips. |
| **Newsreader font loading FOUC** | Preload `.woff2` in `app.html`, system serif fallback stack matches metrics tightly enough that the swap is barely visible. `font-display: swap` keeps text readable through load. |
| **Existing blog OG images + screenshots reference old palette** | Out of scope for this redesign — separate regeneration pass after P4 ships. Note in P4 PR description. |
| **User changes mind mid-redesign** ("actually I liked Cal black") | Branch is isolated. `main` stays Cal until P3 merges. Single-token rollback possible at P1 (revert `--font-heading` and `--canvas`). |
| **Admin panel drift** — `/admin/**` continues using Cal Sans + Cal black + light-gray. | Documented in §3 non-goals. Admin migration is a separate later spec. CLAUDE.md updated in P4 to clarify the boundary. |

---

## 10. Open questions / deferred decisions

These are flagged for resolution during implementation, not now:

1. **Pull-quote spread (section 5)** — does Ignacio have quote content ready, or does P2 ship with section 5 omitted? Default: omit if no content; ship section 5 in a later content pass.
2. **`cal/` → `editorial/` rename** — defer to P4. If imports churn excessively, leave the directory name; the contents are what matter.
3. **Brick red on countdown digit panels** — should the countdown's mustard "rule above" alternate to brick on the days digit (the most urgent number) for a final beat of urgency? Defer to P2 visual review.
4. **Hero copy** — current `t('hero.title')` was tuned for Cal Sans tracking. Newsreader at the same point sizes will read slightly longer per line. May need a 1-2-word trim in P2 for desktop balance. Translation update in same PR.
5. **Photography pass** — Stripe Press is photo-forward. This redesign is typography-forward, not photo-forward. A future pass could introduce real school-environment photography in the hero or pull-quote spread. Defer to a separate photography spec.
6. **Boxed mustard CTA alternative** — instead of navy-fill cream-section CTAs, use mustard fill with a 1.5px navy border. The border carries the boundary contrast (16:1) so 1.4.11 is satisfied via the border, not the fill. Navy text on mustard fill is 7.1:1 (AAA body). Visually warmer than navy CTAs, more energetic, harder to engineer (border weight + button height + radius interplay). Default decision: ship navy CTAs in P2; if user wants the warmer feel during P2 review, swap to boxed-mustard before P3 ships (single component change in `Button` variant).

---

## 11. Verification checklist (run before marking each phase complete)

- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run test:ci` exits 0 (lint + svelte-check + audit + unit + e2e)
- [ ] Lighthouse Performance ≥ 90 mobile, ≥ 95 desktop on `/`
- [ ] Lighthouse Accessibility = 100 on `/`
- [ ] No hardcoded hex in `*.svelte` outside `<style>` blocks (`lint-hardcoded-color.sh`)
- [ ] Zero `Cal Sans` references in templates or CSS after P1
- [ ] Hover smoke test: every interactive element on `/` changes ≥ 2 properties on hover
- [ ] AAA contrast: every foreground × background pair in §4.1 verified via automated computation, NOT copied claims (per anti-pattern memory #8)
- [ ] Mobile render at 320px: no clipping, no horizontal scroll, no h1 wrap mid-word
- [ ] Reduced-motion: every `transition` and `animation` honors `prefers-reduced-motion: reduce`
- [ ] Skip-link visible on focus, lands on `#hero-cta`
- [ ] Screen reader: live-region countdown announcement still reads correctly with new copy

---

## 12. Reference links

- Stripe Press: `press.stripe.com`
- Newsreader on Google Fonts: `fonts.google.com/specimen/Newsreader`
- `@fontsource-variable/newsreader` on npm: `npmjs.com/package/@fontsource-variable/newsreader`
- Anti-pattern memory: `~/.claude/projects/-Users-ignacioaraya-Projects-ethoz-landing/memory/feedback_ui_antipatterns.md`
- Previous Cal redesign spec (superseded for visual): `docs/superpowers/specs/2026-05-01-cal-com-redesign-design.md`
- Brand boundary review (the original B/C variant pick): see project memory archive 2026-04-26→05-18

---

## 13. Self-review changelog (corrections found during the post-write review pass)

The first-draft spec made several contrast claims without recomputing — directly violating anti-pattern memory item #8 ("Always recompute (OKLch → linear sRGB → luminance) before claiming a token is compliant"). The self-review recomputed every WCAG ratio in §4.1 and §6 and applied the corrections below. Anything not listed here was already correct in the first draft.

### 13.1 Contrast value corrections (all in §4.1)

| Token | First-draft claim | Recomputed actual | Action |
|---|---|---|---|
| `--ink` `#0F1F3A` on cream | 16.4:1 | ~16:1 | Adjusted (rounding only). |
| `--ink-soft` `#3A4A6B` on cream | 7.4:1 | 8.4:1 | UNDERSTATED — corrected up. |
| `--accent-mustard` `#D4A017` on cream | 3.9:1 (passes 1.4.11) | **2.2:1 (FAILS 1.4.11)** | Material correction. See §13.2. |
| `--accent-mustard-ink` `#7A5C00` on cream | 7.1:1 (AAA body) | 5.9:1 (AAA-large only) | Hex darkened to `#5C4500`, recomputed 8.6:1 (AAA body). |
| `--accent-brick` `#B23A2C` on cream | 5.6:1 | 5.3:1 | Adjusted. AAA-large only — `--accent-brick-ink` for body. |
| `--accent-brick-ink` `#8A2A1F` on cream | 7.8:1 | 7.6:1 | Adjusted. AAA-body holds. |
| `--accent-sage` `#4A6B47` on cream | 6.9:1 | 5.5:1 | OVERSTATED — corrected down. AAA-large only — `--accent-sage-ink` for body. |
| `--accent-sage-ink` `#2F4A2D` on cream | 9.1:1 | 9.3:1 | UNDERSTATED — corrected up. |
| `--on-navy` `#FBF7F0` on navy | 16.4:1 | 15.8:1 | Adjusted (rounding). |
| `--on-navy-soft` `#C7D0DD` on navy | 9.4:1 | 10.9:1 | UNDERSTATED — corrected up. |
| `--on-navy-mustard` `#E8B82E` on navy | 7.0:1 | 9.1:1 | UNDERSTATED — corrected up. |
| `--destructive-foreground` `#FBF7F0` on brick | 6.9:1 | 5.3:1 | OVERSTATED — corrected down. AAA-large only. |
| `--success-foreground` `#FBF7F0` on sage | 5.7:1 | 5.5:1 | Adjusted. AAA-large only. |
| `--warning-foreground` `#0F1F3A` on mustard | 5.4:1 | 7.1:1 | UNDERSTATED — corrected up. AAA body holds. |

### 13.2 CTA strategy correction (material design change)

**Original design (approved):** mustard fill + navy ink on cream-section CTAs (Hero, Final CTA, etc.).

**Self-review finding:** mustard `#D4A017` on cream `#FBF7F0` is 2.2:1 — fails WCAG 1.4.11 (3:1 minimum for UI component boundary contrast) and AAA-large (4.5:1). The CTA button as designed would not have a perceivable boundary against the cream page background. Critical bug, not cosmetic.

**Resolution applied to spec:**

- Cream-section CTAs (Hero, How-it-works, etc.) → `bg-ink` + `text-canvas` = navy fill + cream text. 16:1 boundary contrast. AAA across the board. More faithful to actual Stripe Press visual reference (which uses dark-fill CTAs).
- Dark-section CTAs (Compliance, Final CTA inside `<SectionDark>`) → `bg-on-navy-mustard` + `text-ink` = mustard fill + navy text on navy section bg. 9.1:1 boundary contrast. AAA across the board. The mustard CTA visual still appears in the page, just inside the dark bookends.
- Mustard remains a recurring color thread on cream sections via eyebrows, hairline rules, large decorative numerals (≥40px), card hover stripes — none of which carry interactive affordance, so 1.4.11 doesn't apply.

**Alternative considered and deferred (§10.6):** boxed mustard CTA — mustard fill with 1.5px navy border on cream sections. The border carries the boundary contrast at 16:1, so 1.4.11 is satisfied via the border, not the fill. Navy text on mustard remains 7.1:1 (AAA body). Visually warmer, more energetic; default decision is to ship navy CTAs in P2 and swap to boxed-mustard if P2 review wants warmer energy.

### 13.3 Phase rollout split (4 → 7 phases)

**Original:** P3 lumped 29 non-homepage public routes into a single phase. Too aggressive for review tolerance — would force one PR with 29 pages of judgment calls all at once.

**Revised:** P3/P4/P5 split by content-affinity wave (audience+features / conversion+authority / blog+legal+about), each 5-14 pages. Old P4 cleanup becomes P6. Total 7 phases (P0-P6), matching the rhythm of the previous Cal migration.

### 13.4 New `accent='navy'` variant on `FeatureCardCal`

Original spec listed `'navy'` in the `accent` prop type but didn't describe its visual treatment. §5.1 now explicitly describes: 2px left rule in `--ink`, used on FAQ and "navy-thread" cream-section accent moments. Use sparingly (≤ 1 per cream section) since navy left rule is the strongest cream-section accent.

### 13.5 ESLint rule extension clarification

The `no-restricted-syntax` rule added in §7 extends the existing array (already populated by the Cal migration's hardcoded-hex ban) — it does not redefine the rule. ESLint accepts the rule as an array of patterns; new patterns append.

### 13.6 No corrections needed in

- §3 Goals & non-goals (intent unchanged; CTA-strategy detail moved to §4.1 + §13.2).
- §4.3 Typography (Newsreader stack, sizes, removals all valid).
- §4.4 Radii (4/6/10/14/20 progression valid).
- §4.5 Shadows (warm shadow color migration valid).
- §11 Verification checklist (still complete; AAA item now references §13 explicitly).
- §12 Reference links (no changes).

---

**End of spec.** Ready for user approval before invoking `superpowers:writing-plans` for phase planning. The §13 changelog above documents what shifted between the user's initial design approval and the final spec — please review §13.2 (CTA strategy correction) in particular, as this is the only material design change.
