# Brand migration: Orange/Cream → Medical-blue (2026-04-23)

Unification pass aligning the landing's visual system with the Ethoz-app
(`/Users/ignacioaraya/Projects/Ethoz-app`). Orange `#E8702A` + Cream `#FAF8F5`
+ Titanium `#1C1C1E` + DM Sans retired. Now: Medical blue `#034B8A` + Navy
`#0B1E3A` + Paper-blue `#F5F8FC` + Inter-only + sharp 2/4/8px radii + hairline
shadows, all AAA contrast.

## Completed this session

- `src/app.css` — full token layer rewrite (medical blue, navy, paper-blue).
  DM Sans import removed. Inter everywhere. Sharp radii capped at 8px.
  Hairline shadow utilities (`shadow-card`, `shadow-card-hover`, `ring-card`,
  `shadow-popover`). `shadow-glow-primary` neutralized to `none`.
  `shadow-glow-destructive` retained (safety signature).
- `src/app.html` — `theme-color` meta updated to navy `#0B1E3A`.
- `.impeccable.md` — full rewrite. New palette table, new design principles,
  Apple-Watch-Ultra framing removed. Unification-with-app principle added.
- `CLAUDE.md` — Design section updated so future Claude sessions don't
  reintroduce orange or DM Sans.
- `src/lib/components/NavBar.svelte` — dropdown switched from `shadow-lg` to
  `shadow-popover` (hairline). Token-based colors already clean.
- `src/lib/components/Footer.svelte` — no changes needed; tokens cascaded.
- `src/routes/+page.svelte` — hero bg gradient removed (flat, no gradients).
  Primary-glow shadows on 4 CTAs removed. Dashboard mockup `shadow-2xl` →
  `shadow-card-hover`. `AlertTriangle text-warning-foreground` corrected to
  `text-warning` (amber icon, not navy-on-amber pair).
- `src/routes/schedule/+page.svelte` — Cal.com `brandColor` swapped to
  `#034B8A` and comment updated.
- `src/routes/demo/[rbd]/+page.svelte` — inline Leaflet map-pin SVG swapped
  from orange to medical blue.
- `src/lib/components/PitchModal.svelte` — ~15 hardcoded orange oklch values
  swapped to medical-blue oklch (same alpha, same composition, hue shift).
- `src/routes/pitch/+page.svelte` — ~25 hardcoded orange oklch values swapped.
- `npm run build` — clean, zero errors, 16.59s.

## Pass 2 — static assets + page sweep

- `static/favicon.svg` — stroke colors swapped to navy `#0B1E3A` + medical
  blue `#034B8A`.
- `static/favicon.png` (32×32) — regenerated from new SVG via sharp.
- `static/apple-touch-icon.png` (192×192) — regenerated from new SVG via sharp.
- `static/logos/ethoz-final-dark.svg` — Inter family (DM Sans/Helvetica
  fallback retained), z and accent stroke swapped to bright medical blue
  `#3E8FE6` (AAA on dark surface).
- `static/logos/ethoz-final-light.svg` — Inter family, z and outline stroke
  swapped to navy `#0B1E3A` + medical blue `#034B8A`.
- `static/logos/ethoz-final-icon.svg` — navy + medical blue strokes.
- `static/images/og-default.svg` — full repaint. Gradient bg moved from
  titanium `#2C2C2E→#1C1C1E` to navy `#16304F→#0B1E3A`. DM Sans replaced
  with Inter. Wordmark white + bright blue. Badge and tagline in bright
  blue. This is the image LinkedIn / WhatsApp / Slack use for every share.
- Batch sweep across 30+ route files — removed every
  `shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30`,
  `shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30`,
  `shadow-primary/[N]`, and `hover:shadow-*-primary/*` pattern. Replaced
  `shadow-2xl` (used on card mockups across feature pages) with hairline
  `shadow-card-hover`.
- `npm run build` — still clean, zero errors, 14.73s.

## Pass 3 — audit + contrast fixes

The .impeccable.md brand rules claim WCAG AAA (7:1 text, 3:1 non-text UI per
1.4.11). A real contrast computation on every token pair exposed six
failures I'd inherited from the Ethoz-app's CSS:

| Pair | Measured | Target | Status |
|---|---|---|---|
| `--border` vs white card | **2.48:1** | 3.0:1 | FAIL |
| `--border` vs paper-blue bg | **2.27:1** | 3.0:1 | FAIL |
| `--success` text on white | **6.06:1** | 7.0:1 | FAIL |
| white on `--success` | **6.06:1** | 7.0:1 | FAIL |
| navy fg on `--warning` amber | **5.82:1** | 7.0:1 | FAIL |
| `--sidebar-border` vs card | **2.48:1** | 3.0:1 | FAIL |

(Math: OKLch → OKLab → linear sRGB → `0.2126·R + 0.7152·G + 0.0722·B` for
relative luminance → `(L_hi+0.05)/(L_lo+0.05)` for contrast ratio, per
WCAG 2.1 spec.)

**Note on the app:** the Ethoz-app's `src/app.css` comments claim
`--color-border: oklch(0.72 0.01 250)` is "WCAG 1.4.11 ≥3:1 vs white".
It's not — it's 2.48:1. That claim is wrong in the upstream too. This
should be fixed in the app on a follow-up sync.

### Fix

Adjusted three tokens to hit the AAA claim:

- `--border` / `--input` / `--sidebar-border`: `oklch(0.72 0.01 250)` →
  `oklch(0.62 0.01 250)`. Now 3.64:1 vs white and 3.34:1 vs paper-blue.
  Visually heavier than the app's value — borders less "hairline" but
  still subtle. Accepting this trade-off because the AAA claim is a
  commitment in `.impeccable.md`.
- `--success`: `oklch(0.48 0.13 155)` → `oklch(0.42 0.13 155)`. Now
  7.73:1 white-on-green, pure AAA.
- `--warning`: `oklch(0.68 0.15 65)` → `oklch(0.75 0.13 70)`. Amber
  lightened so navy foreground hits 7.63:1. White on amber still fails
  (≈2.3:1) — this was always the semantics, documented.

After the fix, every pair passes its target:

```
ratio   target  status  pair
15.94   7.0    PASS    foreground on background
17.38   7.0    PASS    foreground on card
14.59   7.0    PASS    foreground on muted
15.03   7.0    PASS    foreground on secondary
15.49   7.0    PASS    foreground on accent
 9.16   7.0    PASS    muted_fg on background
 9.99   7.0    PASS    muted_fg on card
10.91   7.0    PASS    primary text on card
10.01   7.0    PASS    primary text on background
10.91   7.0    PASS    primary_fg on primary (button)
 9.98   7.0    PASS    destructive text on card
 9.98   7.0    PASS    destructive_fg on destructive
 7.73   7.0    PASS    success text on card
 7.73   7.0    PASS    success_fg on success
 7.63   7.0    PASS    warning_fg on warning (navy on amber)
 3.64   3.0    PASS    border vs card (1.4.11 ≥3:1)
 3.34   3.0    PASS    border vs background (1.4.11 ≥3:1)
10.01   3.0    PASS    ring vs background (focus ring ≥3:1)
Result: 18 PASS / 0 FAIL
```

### Divergences from Ethoz-app — catalogued for future sync

1. `--secondary` — landing uses `oklch(0.95 0.008 250)` (subtle paper-blue)
   vs app's white. Reason: landing uses `bg-secondary` for visual
   section alternation across 50+ pages; white would invert the rhythm.
2. `--border` / `--input` / `--sidebar-border` — landing darkened to
   `oklch(0.62 0.01 250)` for real ≥3:1. App's 0.72 value fails 1.4.11
   and should be fixed upstream.
3. `--success` — landing at `oklch(0.42 0.13 155)` to hit AAA 7:1.
   App's 0.48 clears AA only.
4. `--warning` — landing at `oklch(0.75 0.13 70)` so navy-on-amber hits
   AAA 7:1. App's 0.68 clears AA only.

### Residual sweep

Post-audit cleanup caught three `shadow-2xl` in `src/lib/components/`
(`FeedbackModal.svelte`, `FeedbackOverlay.svelte`) the original sed
missed — it only covered `src/routes/`. Replaced with `shadow-popover`.

Final state:
- Zero `#E8702A` / `#FAF8F5` / `#1C1C1E` hex anywhere.
- Zero `DM Sans` / `dm-sans` references outside the migration comment.
- Zero `shadow-primary/[N]` / `shadow-2xl` across src.
- Zero `from-primary/[0.04]` or other primary gradients.
- `npm run build` — clean, zero errors.
- Contrast: 18/18 PASS.

One divergence from the app's tokens: landing's `--secondary` is set to a
subtle paper-blue (`oklch(0.95 0.008 250)`) rather than the app's pure white.
Reason: the landing uses `bg-secondary` as a section alternation class across
50+ pages; with pure white it would become lighter than the paper-blue page
bg and invert the visual rhythm. Button/Badge `variant="secondary"` still
reads as recessive. Documented in `src/app.css`.

## Remaining work — static assets

These are image/art assets baked with orange. All need regeneration before
the brand migration is visibly complete on search engines, social shares,
and browser tabs:

- `static/favicon.svg` — bracket stroke still `#1C1C1E` + `#E8702A`. Should
  become `#0B1E3A` + `#034B8A`.
- `static/favicon.png` (32×32) — orange variant. Regenerate from the new SVG.
- `static/apple-touch-icon.png` (192×192) — orange variant. Regenerate.
- `static/logos/ethoz-final-dark.svg` — orange z.
- `static/logos/ethoz-final-light.svg` — orange z.
- `static/logos/ethoz-final-icon.svg` — orange stroke.
- `static/images/og-default.svg` — orange z, titanium bg gradient, DM Sans
  font reference. Referenced by every page's `og:image` meta. This one is
  high-priority — it's what LinkedIn/WhatsApp previews use.

Any pre-rendered OG images, LinkedIn post templates, podcast covers, YouTube
thumbnails, or pitch deck PDFs will also carry the old palette and need a
separate pass.

## Remaining work — marketing pages

The token swap cascaded through every page, so all pages render in the new
system. But the following were composed *around* the warmth of orange/cream
and may benefit from a targeted audit in a follow-up session — any
orange-dependent gradients, warm glows, or card rhythms they have will be
flat medical-blue now, which usually reads fine but occasionally looks
recessive:

- `src/routes/features/*` — 9 feature pages (student-profile, safe-pickups,
  access-control, smart-search, privacy-compliance, analytics, attendance,
  alerts, emergency)
- `src/routes/para-sostenedores`, `src/routes/para-directores`,
  `src/routes/para-porteros` — audience pages
- `src/routes/comparativa`, `src/routes/proyecciones`,
  `src/routes/roi-calculator` — conversion pages
- `src/routes/ley-21719`, `src/routes/circular-30`, `src/routes/glosario`,
  `src/routes/seguridad-datos` — authority pages
- `src/routes/compliance`, `src/routes/about`, `src/routes/blog`,
  `src/routes/contact`, `src/routes/demo`, `src/routes/resources/*`
- `src/routes/admin/*` — admin panel (lowest priority; shadcn tokens
  cascade correctly but hardcoded touches may exist)
- `src/routes/pitch` content — semantic red/amber severity dots
  (`oklch(0.55 0.22 25 ...)`, `oklch(0.5 0.2 25 ...)`, `oklch(0.6 0.18 55 ...)`)
  could migrate to `var(--destructive)` / `var(--warning)` tokens for full
  hygiene. They render correctly now, just aren't token-driven.

## Remaining decisions — dark mode

The Ethoz-app ships light + dark with navy surface depth. The landing ships
light-only. If a visitor moves landing → app with system dark preference,
they'll hit a sudden mode change. If you want full continuity, port the
app's `.dark` block from `Ethoz-app/src/app.css` into the landing's
`src/app.css` and add `mode-watcher` wiring to the layout. Not done this
session per stated scope — can be a follow-up.

## Rollback

Everything in this pass is git-tracked. `git diff main` shows the full set of
changes. To roll back: `git restore src/app.css src/app.html .impeccable.md
CLAUDE.md src/lib/components/NavBar.svelte src/routes/+page.svelte
src/routes/schedule/+page.svelte src/routes/demo/\[rbd\]/+page.svelte
src/lib/components/PitchModal.svelte src/routes/pitch/+page.svelte` and
re-run `npm run build`.
