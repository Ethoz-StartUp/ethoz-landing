# Cal.com-flavored redesign — design spec

**Date:** 2026-05-01
**Status:** Draft (awaiting user review before plan write-up)
**Owner:** Ignacio
**Scope:** Public marketing surface — ~30 routes. Admin (`/admin/**`) untouched.

---

## 1. Context & motivation

Ethoz today reads as institutional, pharma-clean, monochromatic-blue. The redesign goal is to inject Cal.com's friendly-modern-SaaS DNA — generous whitespace, real product UI fragments embedded in marketing cards, custom display typography, and the alternating white/light-gray/dark-footer pacing — without abandoning Ethoz's medical-blue brand identity.

This is not a rebrand. The Ethoz wordmark, palette, and trust-driven voice stay. What changes: typography signature, hero structure, card system, footer treatment, and a small set of new component primitives (nav-pill-group, hero-app-mockup-card, product-mockup-card, dark footer).

Reference: huntabyte/shadcn-svelte (already in use) and Cal.com's design vocabulary as documented in the brainstorm input.

---

## 2. Brainstorm decisions (locked)

| # | Question | Decision |
|---|---|---|
| Q1 | Brand identity boundary | **C — Hybrid.** Medical blue `#034B8A` stays primary CTA color. Dark footer adopts McKinsey deep blue `#051C2C` (the actual `--foreground` value in the codebase — NOT Cal black `#101010`, NOT the originally-proposed `#0B1E3A` which doesn't exist in `app.css`). See audit changelog §11. |
| Q2 | Scope | **D — Everything.** All ~30 public routes. `/admin/**` excluded (auth-gated, already shadcn-svelte). |
| Q3 | Cal.com signature patterns | **All 6 IN.** Real Cal Sans (OFL 1.1), light-gray feature cards, product UI fragments, hero app-mockup card, pastel category badges (metadata only — never on CTAs), dark featured pricing tier. The dark featured tier component (`PricingTierCardFeatured.svelte`) is built in Phase 1 but **inactive** — no pricing-tier grid exists yet on Ethoz. Activated when a `/pricing`-style page is added (separate spec). |
| Approach | Execution path | **Vertical slice** — Phase 1 foundation, Phase 2 homepage validation, Phases 3–7 page-group waves. |

**Brand-color escape hatch:** if after Phase 2 the user prefers `--primary` flipped from medical blue `#034B8A` to Cal black `#111111` end-to-end (i.e., move from Option C to Option A territory), it is a single-token override. Defer that call until the homepage ships.

---

## 3. Goals & non-goals

**Goals**
- **Replace Playfair Display with Cal Sans** as `--font-heading`. Cal Sans takes over all 125 uses of `font-heading` class across 30 files (h1–h5, big numerals, pull quotes, blockquotes, stats). Tighten letter-spacing to `-0.04em` on display sizes.
- Introduce six new component primitives that carry the Cal.com voltage.
- Replace `Footer.svelte` with a dark McKinsey-deep-blue footer (`#051C2C`).
- Deploy a Cal-flavored `/` homepage as the validation point before rolling 29 more pages.
- Add ESLint + bash-script guardrails so the new system can't regress to old patterns.
- Maintain WCAG AAA contrast across every change.

**Non-goals**
- Switching primary CTA color from medical blue to Cal black (deferred decision after Phase 2).
- Redesigning `/admin/**` (already shadcn-svelte, auth-gated, internal users).
- Changing copy, content, or i18n keys (this is a visual + structural redesign).
- Adding a traditional pricing-tier grid (`/comparativa` + `/roi-calculator` already serve this need).
- Dark mode (light-mode-only stays).
- Server-side or API changes.

**Out of scope (explicitly)**
- Mobile app, marketing emails, social-post templates, pitch deck UI.
- The Ethoz-app itself (separate codebase). Token alignment with Ethoz-app is a follow-up coordination, not in this spec.

---

## 4. Section 1 — Foundation tokens & typography

### 4.1 Fonts

**Current state (audit-verified):** the active heading font is **Playfair Display Variable** (serif), set via `--font-heading` in `app.css` line 110, used 125 times across 30 files. Inter is body. JetBrains Mono is numerics (mostly inherited via `font-heading` → numerals render Playfair italic on stats). DM Sans is in `package.json` but unused.

**Add:** Cal Sans (SemiBold, weight 600 — the only weight the font ships).
- Source: `github.com/calcom/sans` (NOT `calcom/font` — that's a different repo). License: SIL OFL 1.1 — free for commercial use.
- npm package: `cal-sans` (NOT `@fontsource/cal-sans` — doesn't exist).
- Two install options:
  - **Option A (preferred):** `npm install cal-sans` — uses official Cal.com package, simplest dependency.
  - **Option B (fallback):** self-host `static/fonts/cal-sans/CalSans-SemiBold.woff2` from the GitHub release. Avoids npm dependency on Cal.com's release cadence.
- Decide in Phase 1. Default to A; switch to B if `cal-sans` package proves stale or has resolution issues.

**Wire-up (the core lever).** Change ONE line in `app.css`:

```css
/* before */
--font-heading: "Playfair Display Variable", "Times New Roman", Georgia, serif;
/* after */
--font-heading: "Cal Sans", "Playfair Display Variable", "Inter Variable", system-ui, sans-serif;
```

Playfair stays in the fallback stack during the migration (Phases 2–6) so any unmigrated page still has a sensible serif fallback if Cal Sans fails to load. Phase 7 drops Playfair from the fallback stack and removes `@fontsource-variable/playfair-display` from `package.json`.

**Heading weight migration.** Current `app.css` sets h1/h2/h3 to `font-weight: 500`. Cal Sans ships only at SemiBold (600), so 500 falls through to Playfair (or the next fallback). Phase 1 updates the base headings to `font-weight: 600` so Cal Sans loads at its native weight. Spot audit: search for explicit `font-medium` on `font-heading` elements across the 30 files; flip to `font-semibold` as part of each phase.

**Keep:** Inter Variable (`@fontsource-variable/inter`) — body, buttons, nav links, captions.

**Keep until Phase 7:** Playfair Display Variable (`@fontsource-variable/playfair-display`) — fallback during migration. Remove in Phase 7 cleanup.

**Add:** JetBrains Mono Variable (`@fontsource-variable/jetbrains-mono`) — already in deps, used for `[data-numeric]` and `.font-numeric` (currently inherits parent font; spec keeps this behavior — numerics in heading contexts will become Cal Sans tabular, which Cal Sans supports natively).

**Remove from `package.json` in Phase 1:** `@fontsource-variable/dm-sans` only. Confirmed unused via grep.

**Display tracking.** All h1/h2/h3 get `letter-spacing: -0.04em` (replacing current `-0.02em`) and `font-weight: 600` in `app.css` base layer. No 700, no 500. This becomes a lint rule (Section 7).

**Performance.** Add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the Cal Sans `.woff2` in `app.html`. Preload is required because Cal Sans is render-critical (every headline). Inter and Playfair stay non-preloaded — they're either fallback or body, swap-friendly.

### 4.2 New tokens (CSS custom properties in `app.css`)

**Audit-corrected:** the existing `--background` is already `#FFFFFF` (pure white) — so a separate `--surface-canvas-pure` is redundant and dropped. The existing `--foreground` is `#051C2C` (McKinsey deep blue), not `#0B1E3A` — so `--surface-dark` aligns with the actual brand color.

Tokens added to `:root` and exposed to Tailwind via `@theme inline { }` (see §4.4).

| Token | Value | Use |
|---|---|---|
| `--surface-card-cal` | `#F5F5F5` | Cal-style light-gray feature card. Used inside white sections to provide surface lift (current `bg-card` is `#FFFFFF` on `#FFFFFF` background — relies on hairline border for separation). |
| `--surface-dark` | `#051C2C` | McKinsey deep blue — footer background. Same hex as existing `--foreground` and the `rgba(5, 28, 44, ...)` shadow color. Visually consistent with current brand. |
| `--on-dark` | `#FFFFFF` | Text on `--surface-dark` (titles, links, wordmark) — 17:1 contrast on `#051C2C`, AAA. |
| `--on-dark-soft` | `#B0BAC6` | Body text on `--surface-dark` — verified AAA (8.4:1) on `#051C2C` via OKLch → linear sRGB → luminance. |
| `--badge-pastel-orange` | `#FB923C` | metadata badge fill — pairs with `--foreground` for label (AAA verified) |
| `--badge-pastel-pink` | `#EC4899` | metadata badge fill — pairs with `--on-dark` for label |
| `--badge-pastel-violet` | `#8B5CF6` | metadata badge fill — pairs with `--on-dark` for label |
| `--badge-pastel-emerald` | `#34D399` | metadata badge fill — pairs with `--foreground` for label |

**Existing tokens unchanged:** `--background`, `--foreground`, `--primary`, `--primary-ink`, `--primary-hover`, `--primary-pressed`, `--card`, `--muted`, `--muted-foreground`, `--secondary`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`, `--warning`, `--success`, `--info`, `--titanium`, brand-* exceptions, sidebar-*, `--overlay`, `--skeleton`. The Cal additions are **additive**, not replacements.

### 4.3 Pastel badge usage rules

Pastel tokens (defined above in §4.2) are **metadata-only**. Used by `PastelBadge.svelte`. **Never used as CTA fill, button background, or large surface.** Lint rule blocks `bg-pastel-*` on `Button` (see §7.2).

Contrast computed via OKLch → linear sRGB → luminance. Re-verified — never copied from Cal.com claims.

### 4.4 Tailwind v4 token wiring (in `app.css`, NOT a config file)

**Audit-corrected:** there is no `tailwind.config.{js,ts}` file — the project uses Tailwind v4 with `@tailwindcss/vite`, which reads tokens from the `@theme inline { }` block at the top of `app.css` (lines 38–112 currently). New tokens must be added there.

Add to the existing `@theme inline { }` block in `app.css`:

```css
/* New Cal-flavored surface tokens */
--color-surface-card-cal: var(--surface-card-cal);
--color-surface-dark: var(--surface-dark);
--color-on-dark: var(--on-dark);
--color-on-dark-soft: var(--on-dark-soft);

/* Pastel badge tokens */
--color-badge-pastel-orange: var(--badge-pastel-orange);
--color-badge-pastel-pink: var(--badge-pastel-pink);
--color-badge-pastel-violet: var(--badge-pastel-violet);
--color-badge-pastel-emerald: var(--badge-pastel-emerald);
```

Tailwind v4 auto-generates utilities from any `--color-*` token: `bg-surface-card-cal`, `text-on-dark`, `bg-badge-pastel-orange`, etc. No further config needed.

**Radii (existing, unchanged):** the project already has `--radius-sm` (4px), `--radius-md` (6px), `--radius-lg` (8px), `--radius-xl` (12px), `--radius-2xl` (16px), `--radius-3xl` (20px) per `app.css` lines 198–203. Cal-flavored hero-app-mockup-card uses `rounded-2xl` (16px) per Cal.com spec. Feature cards use `rounded-xl` (12px) — slightly larger than current `rounded-lg` (8px) cards to land in Cal's 12px content-card radius. Buttons stay at `rounded-md` (6px).

**Existing shadow utilities (audit-verified, all defined in `app.css`):**
- `shadow-card`: currently `box-shadow: none` — relies on hairline border. Stays.
- `shadow-card-hover`: `0 2px 0 0 rgba(5, 28, 44, 0.10)` — canonical 4-vector hover. Stays.
- `shadow-mockup`: `0 2px 8px rgba(5, 28, 44, 0.08)` — **already exists**, perfect for `HeroAppMockupCard`. No new shadow needed.
- `shadow-popover`: `0 8px 24px rgba(5, 28, 44, 0.10)` — for menus, dropdowns. Stays.
- `shadow-glow-primary`: neutralized (`box-shadow: none`). Lint rule blocks usage.
- `shadow-glow-destructive`: retained (safety signature). Lint rule exempts it.

### 4.5 Section spacing

New utility `.section-cal { padding-block: clamp(72px, 8vw, 96px); }` for the Cal modern-SaaS rhythm. Existing `py-16 sm:py-20` stays for non-Cal pages until they migrate.

---

## 5. Section 2 — Component primitives

All new components live in `src/lib/components/cal/`. Existing shadcn-svelte primitives (`$lib/components/ui/*`) are untouched.

### 5.1 `NavPillGroup.svelte`

Pill-radius wrapper around 2–3 sub-nav segments. Active segment renders as `bg-canvas-pure` with `shadow-card`; inactive segments are transparent text in `text-muted-foreground`.

```
Props: items: { label: string; href?: string; onClick?: () => void; active?: boolean }[]
       size?: 'sm' | 'md' (default 'md')
```

**Hover state** (per anti-pattern memory): bg + text change together — never single-vector.

### 5.2 `HeroAppMockupCard.svelte`

The hero's right-side artifact. Wraps a real Ethoz dashboard fragment (counts, status rows, mini chart). `rounded-2xl` (16px), `border border-border`, **uses the existing `shadow-mockup` utility** (`0 2px 8px rgba(5, 28, 44, 0.08)` — already in `app.css`). Includes default content slot for custom fragments per page.

```
Props: title?: string (e.g. "Ethoz · Hoy")
       slot: default — fragment markup
```

Content fragments shipped with the component:
- `RetirosFragment.svelte` — daily pickup list with verified/pending status pills
- `VisitsFragment.svelte` — visitor log with timestamps
- `DashboardFragment.svelte` — counts overview (retiros, visitas, pendientes)

### 5.3 `ProductMockupCard.svelte`

Generic wrapper for embedding product UI fragments inside any marketing card (not just hero). Used in 3-up grids on feature pages. `rounded-xl`, hairline border, internal padding `p-6`.

### 5.4 `FeatureCardCal.svelte`

Cal-style `bg-card-cal` (#F5F5F5) feature card. Used inside `bg-canvas-pure` (white) sections for proper lift contrast. Icon + title inline (per `.impeccable.md` rule — never stacked, never icon-in-colored-box). Body in `text-muted-foreground`. Optional CTA link with persistent visible affordance (arrow + text), per anti-pattern #10.

```
Props: icon: SvelteComponent
       title: string
       description: string
       href?: string
       cta?: string (default "Conocer más")
```

### 5.5 `PastelBadge.svelte`

Extends existing `Badge` with `variant="pastel-orange|pastel-pink|pastel-violet|pastel-emerald"`. Used on metadata + category tags ONLY. Lint rule blocks pastel variants on `Button`.

### 5.6 `FooterDark.svelte`

**Audit-corrected:** the existing `Footer.svelte` uses a **6-column** grid at desktop (`lg:grid-cols-6`) — not 4. `FooterDark` matches that structure exactly so no link-information is lost in migration.

Layout: `col-span-2` brand+social cluster (left) + 4 link columns (Producto / Recursos / Empresa / Legal) + 1 column locale toggle (right). Wraps to `sm:grid-cols-3` at tablet, `grid-cols-2` at mobile (matches current responsive behavior).

Background `bg-surface-dark` (`#051C2C`). Wordmark in `text-on-dark` (white, both letters now — the current footer renders "Etho" in `text-foreground` and "z" in `text-primary`; on dark surface that becomes "Etho" in `text-on-dark` and "z" in `text-primary` — primary is `#034B8A` which gives ~5.6:1 on `#051C2C`, AAA-borderline; if it fails, override to `text-on-dark` for both). Body links in `text-on-dark-soft`. Vertical padding `py-12 lg:py-16` (matches current footer's `py-12`).

Locale toggle and the 5 social SVG icons (LinkedIn / Facebook / Instagram / Google / YouTube) stay — same exact markup, recolored via `text-on-dark` and `text-on-dark-soft`. Copyright row at bottom in `text-on-dark-soft/70`.

**SVG hardcoded hex audit:** the existing Footer.svelte has 5 inline SVG icons that use `fill="currentColor"` — not hardcoded hex. ✓ Compatible with the new lint rule.

**Migration timing (explicit):**
- Phase 1: `FooterDark.svelte` is added; `Footer.svelte` is renamed to `FooterLight.svelte` for clarity. No page imports change yet — every page still imports `FooterLight.svelte` and renders unchanged.
- Phase 2: homepage `/` swaps to `FooterDark`. Other pages still on `FooterLight`.
- Phases 3–6: each phase's pages swap to `FooterDark` as part of the page redesign.
- Phase 7: final pages migrate. `FooterLight.svelte` is deleted from the codebase. ESLint rule activates in error mode (was warn-only during transition).

### 5.7 Component contract (all 6)

- All accept Svelte 5 runes (`$props()`, `$state()`, `$derived()` where applicable). No legacy reactive syntax.
- All use design tokens — never hardcoded hex.
- All meet AAA contrast at default state.
- All have visible focus rings (rely on global `:focus-visible` safety net in `app.css`).
- All handle reduced motion (`@media (prefers-reduced-motion)`).
- Hover state changes ≥2 properties (per anti-pattern memory #5).

---

## 6. Section 3 — Execution plan (vertical slice phases)

7 phases, each shippable independently. Each phase ends with `npm run lint && npm run build && firebase deploy --only hosting` and a browser smoke test.

| Phase | PR title | Pages | Components touched | Reviewer signal |
|---|---|---|---|---|
| 1 | `feat(cal): foundation tokens, Cal Sans, 6 new components` | None — primitives only | 6 new components in `src/lib/components/cal/`. New tokens added to `app.css` `@theme inline` block. Cal Sans installed (`cal-sans` npm). `--font-heading` updated to Cal Sans first, Playfair fallback. h1–h5 base weight bumped from 500 → 600. DM Sans removed from deps. ESLint additions. 9 bash lint scripts added. | All existing pages render unchanged (Cal Sans inherits via `--font-heading`, Playfair stays as fallback). Spot-audit any explicit `font-medium` on `font-heading` elements — flip to `font-semibold` if the rendered weight regresses. Browser test confirms no regressions. |
| 2 | `feat(cal): Cal-flavored homepage` | `/` | Homepage hero refactored to 7/5 split with `HeroAppMockupCard`. 3-up `FeatureCardCal` grid. Nav adopts `NavPillGroup`. Footer swaps to `FooterDark`. | **Validation point.** Ignacio reviews homepage in browser before approving Phase 3. |
| 3 | `feat(cal): audience pages` | `/para-sostenedores`, `/para-directores`, `/para-porteros` | Each gets Cal-flavored hero + feature grid + product mockup card showing role-relevant Ethoz UI. Same `FooterDark`. | 3 pages |
| 4 | `feat(cal): features wave` | `/productos`, `/features/*` (9 pages), `/integrations` | Feature index uses 3-up `FeatureCardCal` grid. Each `/features/*` deep-dive uses `ProductMockupCard` for the relevant module UI. | 11 pages |
| 5 | `feat(cal): conversion wave` | `/comparativa`, `/roi-calculator`, `/proyecciones`, `/demo`, `/schedule`, `/get-started`, `/contact` | Conversion-focused pages — minimal Cal voltage, max trust. Hero + 3-up + dark footer. `/demo` keeps reCAPTCHA flow unchanged. | 7 pages |
| 6 | `feat(cal): authority + resources` | `/ley-21719`, `/circular-30`, `/glosario`, `/seguridad-datos`, `/compliance`, `/resources/*` | Authority pages preserve density (long-form legal/glossary). Cal voltage = typography + footer + nav-pill-group only. | 6+ pages |
| 7 | `feat(cal): blog + legal + about + cleanup` | `/blog`, `/about`, `/pitch`, `/privacy`, `/terms` | Blog already uses editorial McK header (recent commits — light touch only). Legal pages: token migration only. Final cleanup: delete `FooterLight.svelte`, remove `@fontsource-variable/playfair-display` from `package.json`, drop Playfair from the `--font-heading` fallback stack, flip lint scripts from `--warn-only` to `--error`. | Remaining |

**Excluded from all phases:** `/admin/**`, `src/lib/components/ui/**` (vendored shadcn — leave alone).

**Success criteria per phase:**
- Lighthouse Performance ≥ 90 (mobile), ≥ 95 (desktop)
- Lighthouse Accessibility = 100
- AAA contrast verified (`npm run audit:security` includes contrast check)
- No new ESLint errors
- Visual smoke test: hover every interactive element, verify 2+ properties change (per anti-pattern memory)

---

## 7. Section 4 — Lint rules + guardrails

### 7.1 ESLint rules (AST-aware) — `eslint.config.js`

Add to the existing `// ── Project rules: design-system + security guardrails ──` block:

```js
// Block legacy Footer import after Phase 1
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['**/components/Footer.svelte', '**/components/FooterLight.svelte'],
    message: 'Use FooterDark.svelte from $lib/components/cal/'
  }]
}],

// Block alert() and confirm() (already CLAUDE.md rule, now enforced)
'no-restricted-globals': ['error',
  { name: 'alert', message: 'Use toast() from svelte-sonner' },
  { name: 'confirm', message: 'Use Dialog from $lib/components/ui/dialog' }
],

// Block hardcoded hex outside CSS/config files
'no-restricted-syntax': ['error', {
  selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
  message: 'Use design tokens — never hardcode hex colors'
}],
```

**Explicit exclusions for the hardcoded-hex rule** — added as a separate config block in `eslint.config.js`:

```js
{
  files: ['src/app.css', 'src/lib/**/*.css', 'tailwind.config.{ts,js}', '*.config.{ts,js}', 'static/**'],
  rules: {
    'no-restricted-syntax': 'off'
  }
}
```

CSS files, Tailwind config, and static assets are exempt — those are where hex literals legitimately live.

### 7.2 Bash/regex checks — `scripts/lint-*.sh`

ESLint can't reliably parse Tailwind class strings (per anti-patterns memory #15). These ship as bash scripts wired into `npm run lint`. All follow the format of the existing `lint-section-width.sh`.

| Script | Catches |
|---|---|
| `lint-cal-sans-scope.sh` | Cal Sans `font-display` class only on `h1`/`h2`/`h3` elements. Anywhere else → fail. |
| `lint-pastel-on-cta.sh` | `bg-pastel-*` classes ever land on `Button` or anchor with button styling → fail. Pastels are metadata-only. |
| `lint-shadow-2xl.sh` | `shadow-2xl`, `shadow-xl` on `.svelte` files (non-admin) → fail. Cards use `shadow-card` only. |
| `lint-opacity-hover.sh` | `hover:opacity-[0-9]*` where N<100 used as reveal-hover → fail. (anti-pattern #1) |
| `lint-muted-hover.sh` | `hover:bg-muted/[0-9]*` where N<100 → fail. (anti-pattern #2) |
| `lint-hardcoded-color.sh` | Any `#[0-9a-fA-F]{3,8}` in `.svelte` files outside `<style>` blocks → fail. (anti-pattern #7) |
| `lint-glow-shadows.sh` | `shadow-glow-primary` usage → fail (utility neutralized). `shadow-glow-destructive` exempted (safety signature). |
| `lint-icon-box-wrapper.sh` | Icon-in-colored-box wrapper pattern (e.g. `bg-primary/10 p-3 rounded` containing only an icon) → fail. (CLAUDE.md "no icon-in-colored-box wrappers" rule — AI-slop signature.) |

Existing scripts kept and enhanced:
- `lint-section-width.sh` — already enforces `max-w-7xl` outer container

Each script:
- `set -euo pipefail`
- Excludes `src/routes/admin/**`, `src/lib/components/ui/**`, `node_modules/**`
- Outputs `❌`-prefixed line with file:line:matched-pattern on fail
- Returns non-zero to fail CI

### 7.3 Wire-up

**Audit-verified current state:** `package.json` `scripts.lint` is currently:
```
"lint": "eslint src supabase/functions --max-warnings=50 && bash scripts/lint-section-width.sh"
```

Append the new bash scripts to that chain. Preferred: extract to `scripts/lint-all.sh` so `package.json` stays clean:

```bash
#!/usr/bin/env bash
# scripts/lint-all.sh — runs all design-system bash lints
set -euo pipefail
bash "$(dirname "$0")/lint-section-width.sh"
bash "$(dirname "$0")/lint-cal-sans-scope.sh"
bash "$(dirname "$0")/lint-pastel-on-cta.sh"
bash "$(dirname "$0")/lint-shadow-2xl.sh"
bash "$(dirname "$0")/lint-opacity-hover.sh"
bash "$(dirname "$0")/lint-muted-hover.sh"
bash "$(dirname "$0")/lint-hardcoded-color.sh"
bash "$(dirname "$0")/lint-glow-shadows.sh"
bash "$(dirname "$0")/lint-icon-box-wrapper.sh"
```

Then `package.json`:
```
"lint": "eslint src supabase/functions --max-warnings=50 && bash scripts/lint-all.sh"
```

`npm run test:ci` already invokes `npm run lint` (verified in `package.json` line 17), so CI gets all 9 design-system lints automatically.

### 7.4 Pre-commit hook

**Audit-verified:** husky is **NOT installed** (no `husky`/`lint-staged` keys in `package.json`). Two paths:

- **Path A (recommended):** rely on `npm run test:ci` running in CI (GitHub Actions / Firebase preview build). Developers run `npm run lint` manually before commits — already CLAUDE.md convention. Zero new dependencies.
- **Path B:** add `husky` + `lint-staged` to `devDependencies` in Phase 1, wire `npm run lint` to `pre-commit`. ~30s install, slightly faster developer feedback than CI.

**Decision:** **Path A.** Stay dependency-light. Document the manual `npm run lint` step in `CLAUDE.md` under the existing security/lint section.

---

## 8. Risks & open questions

| Risk | Mitigation |
|---|---|
| Cal Sans loading flash (FOUT) on first paint | Preload `.woff2` via `<link rel="preload">` in `app.html`, set `font-display: swap` and explicit Inter fallback metrics |
| Lint scripts produce false positives in 30 pages of legacy code during Phase 1 → 7 transition | Run lint scripts in `--warn-only` mode during Phases 2–6, flip to `--error` in Phase 7 cleanup. Document the toggle in each script header. |
| ESLint hardcoded-hex rule fires on existing pages | Audit existing hex usage before Phase 1 ships. Inventory in `docs/superpowers/specs/2026-05-01-cal-com-redesign-hex-audit.md` (auto-generated by an ad-hoc grep). |
| `FooterDark.svelte` rollout breaks SEO sitemap | Footer DOM stays semantically equivalent (same nav links, same locale toggle). Search Console verified post-Phase-1 deploy. |
| Phase 4 (11 pages) creates a giant PR | Split Phase 4 into 4a (`/productos` + index), 4b (`/features/*` 1–5), 4c (`/features/*` 6–9 + `/integrations`). Decision deferred to plan-write-up. |
| User wants to flip to Option A (Cal black primary) after Phase 2 | Single-token override in `app.css`: `--primary: oklch(0.18 0 0);`. ~30-minute change. Documented as "escape hatch" in §2. |

**Open questions resolved during audit:**
1. ~~Husky present?~~ → **No.** Path A: rely on `npm run test:ci`. Skip husky.
2. ~~`@fontsource/cal-sans` package?~~ → **Doesn't exist.** The npm package is `cal-sans`. Repo is `github.com/calcom/sans`. Default to `npm install cal-sans` (Option A); fall back to self-hosted `.woff2` from GitHub release if the npm package proves stale.
3. ~~`FooterLight.svelte` timing?~~ → **Phase 7 cleanup.** Phase 1 introduces `FooterDark` next to `FooterLight`; pages migrate phase-by-phase; final delete in Phase 7.

**Remaining open question:**
- After Phase 2 ships, decide whether to flip `--primary` from medical blue (`#034B8A`) to Cal black (`#111111`) — i.e., revisit Option C → Option A. Single-token override; no plan changes needed.

---

## 9. Success criteria (overall)

The redesign is "done" when:

- [ ] All 30 public routes use `FooterDark.svelte`, Cal Sans for h1/h2/h3, and the new component primitives where structurally appropriate.
- [ ] `npm run lint` passes with all 9 lint scripts active in error mode.
- [ ] `npm run audit:security` passes (existing AAA + hardcoded-color + PUBLIC_* env checks).
- [ ] Lighthouse Mobile Performance ≥ 90, Desktop ≥ 95, Accessibility = 100 on `/`, `/productos`, `/comparativa`, `/demo`.
- [ ] No `Footer.svelte` or `FooterLight.svelte` references in the codebase (deleted in Phase 7).
- [ ] DM Sans removed from `package.json` (Phase 1). Playfair Display removed (Phase 7 cleanup, after all 30 pages confirmed Cal-Sans-rendering).
- [ ] `--font-heading` no longer references Playfair anywhere in the bundle (Phase 7).
- [ ] `CLAUDE.md` updated to reflect: (a) Cal Sans is the active heading font, (b) `src/lib/components/cal/` is the new component home, (c) the 9 lint scripts now wired into `npm run lint`.
- [ ] `.impeccable.md` typography section updated to reflect Cal Sans (currently claims "Single family: Inter Variable" — stale).

---

## 10. References

- Brainstorm visual companion sessions (preserved in `.superpowers/brainstorm/71864-1777688467/`)
- Cal.com design vocabulary (provided in original prompt)
- huntabyte/shadcn-svelte (already in use for primitives in `src/lib/components/ui/`)
- `github.com/calcom/sans` — Cal Sans source, SIL OFL 1.1
- `npmjs.com/package/cal-sans` — official npm distribution
- Existing project context: `CLAUDE.md`, `.impeccable.md`, `feedback_ui_antipatterns.md` (auto-memory)
- Existing lint pattern: `scripts/lint-section-width.sh`

---

## 11. Audit changelog (post-write verification pass)

After the first draft of this spec was written, a verification audit was run against the actual codebase. The following corrections were applied. This section captures **what the spec used to claim vs. what the code actually says** — useful when downstream plans reference this spec.

| Section | Original claim (WRONG) | Reality (audit-verified) | Fix |
|---|---|---|---|
| §3, §4.1 | "Cal Sans replaces Inter for h1/h2/h3." | **Heading font is Playfair Display Variable**, set via `--font-heading` in `app.css:110`. Used 125 times across 30 files. Inter is body. | Cal Sans replaces Playfair via the `--font-heading` token. Playfair stays in fallback stack until Phase 7. |
| §4.1 | "Source: `calcom/font` GitHub repo." | The actual repo is `calcom/sans`. `calcom/font` is a different repo. | Updated source URL. |
| §4.1 | "Or use `@fontsource/cal-sans` if it exists on npm." | `@fontsource/cal-sans` does not exist. The official npm package is `cal-sans`. | Switched recommendation to `npm install cal-sans`. |
| §4.1 | "Remove DM Sans + Playfair from `package.json`." | Removing Playfair early would break 125 heading uses. Playfair must stay until Cal Sans is fully migrated. | Phase 1 removes only DM Sans. Phase 7 removes Playfair after all pages verified. |
| §4.2 | "`--surface-canvas-pure` (#FFFFFF) — alt canvas." | `--background` is **already** `#FFFFFF`. The token is redundant. | Token dropped. |
| §4.2 | "`--surface-dark` = `#0B1E3A` (Ethoz navy)." | The actual codebase brand-dark is `#051C2C` (McKinsey deep blue) — `--foreground` line 124, also the `rgba(5,28,44,...)` shadow color. There is no `#0B1E3A` in `app.css`. | `--surface-dark` set to `#051C2C` for consistency. `--on-dark-soft` re-tuned for AAA on `#051C2C`. |
| §4.4 | "Tokens added to `tailwind.config`." | **No `tailwind.config.{js,ts}` file exists.** Project uses Tailwind v4 with `@theme inline { }` block in `app.css` (lines 38–112). | Tokens added to existing `@theme inline` block. v4 auto-generates utilities from `--color-*` prefix. |
| §4.4 | Implied feature cards use `rounded-xl` = 8px. | Actual `--radius-xl` = 12px (`app.css:201`); `--radius-lg` = 8px. Cal feature cards land at 12px (rounded-xl) per Cal spec. | Clarified — feature cards `rounded-xl` (12px), buttons `rounded-md` (6px), hero card `rounded-2xl` (16px). |
| §4.4 | "Add new shadow utility for hero mockup card." | **`shadow-mockup` already exists** in `app.css:498` as `0 2px 8px rgba(5, 28, 44, 0.08)` — exactly the right value. | `HeroAppMockupCard` reuses existing utility; no new shadow added. |
| §5.6 | "FooterDark = 4 columns at desktop." | Existing `Footer.svelte` is **6 columns** at desktop (`lg:grid-cols-6`): `col-span-2` brand cluster + 4 link columns + locale toggle. | Updated to match 6-col structure. |
| §5.6 | "FooterDark replaces Footer.svelte directly." | Existing footer wordmark uses `text-foreground` ("Etho") + `text-primary` ("z") — on dark surface, the medical-blue "z" gives borderline AAA. Need fallback. | Documented: use `text-on-dark` for both letters if `text-primary` on `#051C2C` fails AAA verification. |
| §7.1 | Vague "via existing ignores" for hardcoded-hex rule. | Existing eslint config uses explicit `ignores` array at top — must add file-scoped exception block for the new rule. | Added explicit exclusion config block. |
| §7.2 | `lint-icon-stacked.sh` — detect icon+title in vertical flex. | Vertical-flex detection via grep is unreliable (depends on parent classes, ordering). The actual grep-able anti-pattern is "icon-in-colored-box wrapper." | Renamed to `lint-icon-box-wrapper.sh`. |
| §7.4 | "If husky is installed..." (conditional). | `package.json` has no husky/lint-staged. Verified. | Decision committed: Path A — rely on `npm run test:ci`, no husky. |
| §9 | "DM Sans and Playfair removed in Phase 7." | DM Sans removed Phase 1 (truly unused). Playfair removed Phase 7 only. | Split into two checklist items. |

**Implementation pivot (post-spec, during Phase 1 execution — 2026-05-01):**

After the spec was approved, the user explicitly directed "full cal" twice and re-pasted the original Cal.com spec emphasizing black `#111111` primary CTAs. Spec was written for Option C (medical-blue stays primary, dark navy footer). **Implementation pivoted to Option A** (full Cal monochrome): `--primary` flipped to `#111111`, `--surface-dark` set to `#101010` (Cal black footer, not Ethoz navy `#051C2C`). The spec's "brand-color escape hatch" section (§2) anticipated exactly this: a single-token override at the end. The override happened during Phase 1, not at the end.

**What this means for downstream sections:**
- §2 row Q1 (brand boundary) is effectively now Option A, not C. The hybrid approach was abandoned in favor of full Cal aesthetic.
- §4.2 (`--surface-dark` value): now `#101010` (Cal black), not `#051C2C` (Ethoz navy).
- §4.1 (Cal Sans wiring): unchanged — Playfair fallback retained until Phase 7 cleanup.
- §6 (phases): Phase 1 + Phase 2 (homepage) merged in this implementation pass. Phases 3–7 still pending per-page individual treatment if needed (token cascade gives most pages Cal aesthetic for free).

**Audit also verified (no spec change needed):**
- `shadow-card`, `shadow-card-hover`, `shadow-popover`, `shadow-glow-primary` (neutralized), `shadow-glow-destructive` (retained) all exist in `app.css` as expected.
- `npm run lint`, `npm run test:ci`, `npm run audit:security` all wired in `package.json`.
- `scripts/lint-section-width.sh` exists and works.
- 0 hardcoded hex literals in `src/lib/**/*.svelte` files (count via grep) — new ESLint hex rule won't break existing code.
- Existing `app.css` has `:focus-visible` global rule, `prefers-reduced-motion` global rule, and `[data-numeric]` numerics-only-tabular rule. All compatible with the new components.
- Cal Sans license: SIL OFL 1.1 — confirmed via `calcom/sans` repo. Free for commercial web use.
- Cal Sans ships **only at SemiBold (600)**. Existing headings are loaded at `font-weight: 500`. Phase 1 base bumps to 600. Spot-audit `font-medium` on `font-heading` per phase.

---

**Next step after spec approval:** invoke `superpowers:writing-plans` skill to create Phase 1 implementation plan first (foundation), then Phase 2 (homepage). Subsequent phases get their own plans triggered after each phase ships and validates.
