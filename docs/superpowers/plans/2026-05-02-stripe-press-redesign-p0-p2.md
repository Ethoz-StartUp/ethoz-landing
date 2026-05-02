# Stripe Press Redesign — P0–P2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Ethoz public marketing surface from Cal.com aesthetic (cold gray-on-white) to Stripe Press editorial (warm cream + deep navy + per-section accents + Newsreader serif headlines), validated through homepage `/` shipping by end of P2.

**Architecture:** Token-first migration. Phase 1 swaps tokens + typography + shadows site-wide via `app.css` so every existing page picks up the new canvas/ink/serif headlines automatically (no per-page edits). Phase 2 then refactors the homepage with new component primitives (`SectionDark`, `FeatureCardCal accent` prop, `HeroAppMockupCard` left-rule wrapper) and per-section accent choreography. Lint scripts run in **warn mode** during P1–P2 so the migration doesn't trip CI mid-way; they flip to **error mode** in P6 (separate later plan).

**Tech Stack:** SvelteKit 2 + Svelte 5 runes, Tailwind CSS v4 (`@theme inline` block in `app.css` — no `tailwind.config.{ts,js}`), Inter Variable + Newsreader Variable + JetBrains Mono Variable from `@fontsource-variable/*`, Firebase Hosting (Cloudflare DNS) for staging deploys.

**Source spec:** `docs/superpowers/specs/2026-05-02-stripe-press-redesign-design.md` — read it before starting Task 1.

**Out of scope for this plan (deferred to separate plans after P2 validates):**
- P3 (audience + features wave, ~14 pages) — separate plan after Ignacio approves homepage
- P4 (conversion + authority wave, ~13 pages)
- P5 (blog + legal + about, ~5 pages)
- P6 (lint scripts flip to error, cleanup, Lighthouse pass)

---

## File structure

**Created:**
- `src/lib/components/cal/SectionDark.svelte` — full-bleed navy section wrapper for Compliance + Final CTA bands (P2.1)

**Modified:**
- `package.json` — drop `cal-sans` + `@fontsource-variable/playfair-display`, add `@fontsource-variable/newsreader` (P1.1, P1.2)
- `src/app.html` — preload Newsreader 500 woff2 (P1.6)
- `src/app.css` — major: imports, `:root` tokens, `@theme inline` exposure, heading base styles, radii, shadow alpha, section spacing utility (P1.3 → P1.10)
- `src/lib/components/cal/FeatureCardCal.svelte` — add `accent` prop with mustard | brick | sage | navy | none variants (P2.2)
- `src/lib/components/cal/HeroAppMockupCard.svelte` — wrap dashboard mockup in cream-elevated frame with 2px navy left-rule spine (P2.3)
- `src/lib/components/cal/NavPillGroup.svelte` — recolor active segment + outer wrapper (P2.4)
- `src/lib/components/cal/PastelBadge.svelte` — rename variants from `orange|pink|violet|emerald` to `mustard|brick|sage|navy` (P2.5)
- `src/lib/components/cal/ProductMockupCard.svelte` — recolor to cream-elevated bg + warm hairline (P2.6)
- `src/lib/components/Footer.svelte` — bump bg from `bg-surface-dark` (`#101010`) to deeper `#0A1628`; cream type via `text-on-navy` (P2.7)
- `src/routes/+page.svelte` — sections 1, 2, 3, 4, 6, 7, 8, 9, 10 refactored per spec §6 choreography (P2.9 → P2.17). Section 5 (pull-quote spread) deferred per spec §10.1.
- `scripts/lint-cal-sans-scope.sh` → `scripts/lint-newsreader-scope.sh` — git-renamed + body inverted (Cal Sans now banned, Newsreader enforced) but **runs in warn mode** during P1/P2 (P1.13)
- `scripts/lint-pastel-on-cta.sh` — token list updated, but runs in warn mode (P1.13)
- `scripts/lint-hardcoded-color.sh` — allow-list updated, warn mode (P1.13)
- `scripts/lint-muted-hover.sh` — adds `hover:bg-canvas-elevated/N<100` check, warn mode (P1.13)
- `CLAUDE.md` — note "active redesign in progress on `redesign/stripe-press` — light edits only on `main`" (P0.3)

**Not touched in this plan:**
- `src/routes/admin/**` — admin panel stays Cal aesthetic per spec §3 non-goals
- `src/lib/components/ui/**` — vendored shadcn-svelte, leave alone per spec §3
- All non-homepage public routes — those are P3/P4/P5 (later plans)
- ESLint config — modifications deferred to P6 (later plan)

---

## P0: Prep + branch

### Task P0.1: Cut redesign branch from main

**Files:** none (branch operation only)

- [ ] **Step 1: Confirm `main` is clean and up to date**

Run:
```bash
git status --short
git fetch origin
git log --oneline -1 origin/main main
```
Expected: empty status (or only `.claude/scheduled_tasks.lock` deletion which is fine), `main` and `origin/main` at same SHA.

- [ ] **Step 2: Cut the branch**

Run:
```bash
git checkout -b redesign/stripe-press
git status
```
Expected: `On branch redesign/stripe-press` and `nothing to commit, working tree clean`.

- [ ] **Step 3: Verify**

Run: `git branch --show-current`
Expected output: `redesign/stripe-press`.

(No commit on this task — branch creation only.)

### Task P0.2: Capture baseline screenshots of top-5 pages

**Files:**
- Create: `docs/superpowers/baselines/2026-05-02-pre-redesign/` directory + 5 PNG files

This is a manual step — agentic workers can use Playwright MCP if available, otherwise prompt the user to capture and save the files.

- [ ] **Step 1: Make the baseline directory**

Run:
```bash
mkdir -p docs/superpowers/baselines/2026-05-02-pre-redesign
```

- [ ] **Step 2: Start the dev server**

Run (in a separate terminal, or via Bash with `run_in_background`):
```bash
npm run dev -- --port 5177
```
Expected: server boots in <10s, listens on `http://localhost:5177`.

- [ ] **Step 3: Capture screenshots of `/`, `/demo`, `/compliance`, `/blog`, `/about`**

For each route, save as `docs/superpowers/baselines/2026-05-02-pre-redesign/<route-slug>.png` at viewport `1280x800` (desktop) — the dimensions matter for later before/after comparison.

If using a manual browser: open `http://localhost:5177/<route>`, F12 → Cmd+Shift+P → "Capture full size screenshot" (Chrome devtools), save to the path.

If using Playwright MCP: drive the browser via tool calls.

Files to produce:
- `docs/superpowers/baselines/2026-05-02-pre-redesign/home.png`
- `docs/superpowers/baselines/2026-05-02-pre-redesign/demo.png`
- `docs/superpowers/baselines/2026-05-02-pre-redesign/compliance.png`
- `docs/superpowers/baselines/2026-05-02-pre-redesign/blog.png`
- `docs/superpowers/baselines/2026-05-02-pre-redesign/about.png`

- [ ] **Step 4: Stop the dev server**

Send Ctrl+C to the dev server terminal, or `KillShell` the background process.

- [ ] **Step 5: Verify all 5 baseline files exist**

Run:
```bash
ls -la docs/superpowers/baselines/2026-05-02-pre-redesign/
```
Expected: 5 PNG files present, each non-zero in size.

- [ ] **Step 6: Commit baseline directory to the branch**

```bash
git add docs/superpowers/baselines/
git commit -m "chore(redesign): capture pre-migration baseline screenshots"
```

### Task P0.3: Add CLAUDE.md migration note

**Files:**
- Modify: `CLAUDE.md` — add a one-block note near the top warning collaborators of active redesign

- [ ] **Step 1: Add the note block right under the `## What is this` section**

In `CLAUDE.md`, after the line `**Not a school management system**...` (currently at the end of the "What is this" block), add a new paragraph:

```markdown
> **🚧 Active redesign in progress (`redesign/stripe-press` branch).** The Cal.com aesthetic on `main` is being replaced with Stripe Press editorial (warm cream + deep navy + Newsreader serif). Spec: `docs/superpowers/specs/2026-05-02-stripe-press-redesign-design.md`. Plan: `docs/superpowers/plans/2026-05-02-stripe-press-redesign-p0-p2.md`. **Light edits only on `main`** until the redesign branch merges. Avoid token churn or new component primitives on `main`.
```

- [ ] **Step 2: Verify the edit looks right**

Run:
```bash
grep -A 1 'Active redesign' CLAUDE.md | head -3
```
Expected: the note appears.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "chore(redesign): note active redesign branch in CLAUDE.md"
```

### Task P0.4: Capture lint + build + test baseline

**Files:** none (writes a small log file)

- [ ] **Step 1: Run the full test:ci suite and capture output**

```bash
npm run test:ci 2>&1 | tee docs/superpowers/baselines/2026-05-02-pre-redesign/test-ci.log
```
Expected: exits 0. The file `test-ci.log` records the green baseline.

- [ ] **Step 2: Verify the log captured the green run**

```bash
tail -5 docs/superpowers/baselines/2026-05-02-pre-redesign/test-ci.log
grep -c 'All design-system lints passed' docs/superpowers/baselines/2026-05-02-pre-redesign/test-ci.log
```
Expected: ≥ 1 match (the lint orchestrator success line).

- [ ] **Step 3: Commit the baseline log**

```bash
git add docs/superpowers/baselines/2026-05-02-pre-redesign/test-ci.log
git commit -m "chore(redesign): capture pre-migration test:ci baseline"
```

---

## P1: Foundation tokens + Newsreader (no per-page edits)

The principle: every change in P1 lands in `app.css`, `package.json`, `app.html`, or lint scripts. **Zero `.svelte` files are edited in P1.** When P1 ships, every existing page renders with new canvas + ink + serif headlines automatically because they all use `bg-background` / `text-foreground` utilities and base heading styles — which now resolve to the new tokens.

### Task P1.1: Install Newsreader, uninstall Cal Sans + Playfair Display

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Run the package operations**

```bash
npm uninstall cal-sans @fontsource-variable/playfair-display
npm install @fontsource-variable/newsreader@latest
```

Expected: removes 2 packages, adds 1. `package-lock.json` updates.

- [ ] **Step 2: Verify the deltas**

```bash
grep -E '"cal-sans"|"@fontsource-variable/(playfair-display|newsreader)"' package.json
```
Expected output: only `"@fontsource-variable/newsreader": "^X.Y.Z"` remains. The other two packages are absent.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(editorial): swap cal-sans + playfair → newsreader in deps"
```

### Task P1.2: Update `app.css` font imports

**Files:**
- Modify: `src/app.css` (top of file — `@import` block)

- [ ] **Step 1: Replace the import block**

In `src/app.css`, locate the top-of-file imports (currently lines 1–5):

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource-variable/playfair-display";
@import "@fontsource-variable/jetbrains-mono";
@import "cal-sans";
```

Replace with:

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource-variable/newsreader";
@import "@fontsource-variable/jetbrains-mono";
```

(Newsreader replaces both Playfair AND Cal Sans — 4 imports → 4 imports, but the set has changed.)

- [ ] **Step 2: Verify the change**

```bash
head -6 src/app.css | grep -E '@import'
```
Expected: `inter`, `newsreader`, `jetbrains-mono` present. `playfair-display` and `cal-sans` absent.

- [ ] **Step 3: No commit yet — bundled with the next step in Task P1.10**

### Task P1.3: Add canvas + ink + accent + dark-section tokens to `:root`

**Files:**
- Modify: `src/app.css` — `:root { ... }` block (currently around lines 132–266)

- [ ] **Step 1: Insert new tokens at the top of `:root`**

Find the line `:root {` in `src/app.css` (currently line 132). Right after it, INSERT the following block (do NOT remove existing tokens yet — coexistence is fine, deletions happen in P6):

```css
  /* ── Stripe Press canvas + ink ── */
  --canvas: #FBF7F0;                        /* warm cream — replaces #FFFFFF as page bg */
  --canvas-elevated: #F5EFE3;               /* nested cards, FAQ list bg */
  --canvas-strong: #EDE5D3;                 /* disabled bg, deepest cream tier */
  --ink: #0F1F3A;                           /* deep editorial navy — replaces Cal black + McK navy as primary text */
  --ink-soft: #3A4A6B;                      /* body text on cream — 8.4:1 AAA */
  --hairline-warm: #E5DDC9;                 /* warm hairline border (decorative-only — must pair with text affordance) */
  --hairline-warm-soft: #F0EAD9;            /* barely-visible divider */

  /* ── Per-section accent tokens ── */
  /* CTA / heading / large-decorative only on cream — body text uses -ink variants */
  --accent-mustard: #D4A017;                /* eyebrows, hairline rules, large numerals only on cream — FAILS 1.4.11 if used as CTA fill */
  --accent-mustard-ink: #5C4500;            /* mustard-tinted body text on cream — 8.6:1 AAA body */
  --accent-brick: #B23A2C;                  /* problem section, urgency dots, countdown rule */
  --accent-brick-ink: #8A2A1F;              /* brick body text on cream — 7.6:1 AAA body */
  --accent-sage: #4A6B47;                   /* features, success ticks, large step numerals */
  --accent-sage-ink: #2F4A2D;               /* sage body text on cream — 9.3:1 AAA body */

  /* ── Dark sections (Compliance, Final CTA) + footer ── */
  --section-navy: #0F1F3A;                  /* full-bleed dark sections — alias of --ink */
  --on-navy: #FBF7F0;                       /* cream type on navy — 15.8:1 AAA */
  --on-navy-soft: #C7D0DD;                  /* body text on navy — 10.9:1 AAA */
  --on-navy-mustard: #E8B82E;               /* mustard fill on dark-section CTAs + decorative — 9.1:1 AAA */
```

- [ ] **Step 2: Repoint `--background` and `--foreground` to the new tokens**

Find these two lines (currently around lines 144–146):

```css
  --background: #FFFFFF;                    /* Pure white default — Cal canvas */
  --foreground: #111111;                    /* Cal ink — replaces McK deep blue for primary text */
```

Replace with:

```css
  --background: var(--canvas);              /* repointed to warm cream — every bg-background utility now resolves here */
  --foreground: var(--ink);                 /* repointed to deep editorial navy — every text-foreground utility now resolves here */
```

This is the **single most impactful change in the entire plan** — repointing these two tokens flips the entire site's canvas + ink color in one move.

- [ ] **Step 3: Verify the file still parses**

```bash
npm run build 2>&1 | tail -8
```
Expected: build succeeds (it might warn about unused tokens — that's OK).

- [ ] **Step 4: No commit yet — batch with Task P1.10**

### Task P1.4: Expose new tokens to Tailwind via `@theme inline`

**Files:**
- Modify: `src/app.css` — `@theme inline { }` block (currently lines 39–130)

- [ ] **Step 1: Append the new `--color-*` aliases inside `@theme inline { }`**

Find the closing `}` of the `@theme inline { ... }` block (currently around line 130). Right BEFORE that closing brace, INSERT:

```css
  /* ── Stripe Press canvas + ink ── */
  --color-canvas: var(--canvas);
  --color-canvas-elevated: var(--canvas-elevated);
  --color-canvas-strong: var(--canvas-strong);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-hairline-warm: var(--hairline-warm);
  --color-hairline-warm-soft: var(--hairline-warm-soft);

  /* ── Per-section accents ── */
  --color-accent-mustard: var(--accent-mustard);
  --color-accent-mustard-ink: var(--accent-mustard-ink);
  --color-accent-brick: var(--accent-brick);
  --color-accent-brick-ink: var(--accent-brick-ink);
  --color-accent-sage: var(--accent-sage);
  --color-accent-sage-ink: var(--accent-sage-ink);

  /* ── Dark sections + footer ── */
  --color-section-navy: var(--section-navy);
  --color-on-navy: var(--on-navy);
  --color-on-navy-soft: var(--on-navy-soft);
  --color-on-navy-mustard: var(--on-navy-mustard);
```

This causes Tailwind v4 to auto-generate utilities like `bg-canvas`, `text-ink`, `bg-accent-mustard`, `border-hairline-warm`, `text-on-navy`, etc.

- [ ] **Step 2: Verify Tailwind picks up the new utilities**

Run:
```bash
npm run build 2>&1 | tail -3
```
Expected: build green.

- [ ] **Step 3: No commit yet — batch with Task P1.10**

### Task P1.5: Update `--font-heading` and heading base styles

**Files:**
- Modify: `src/app.css` — `--font-heading` declaration + base heading styles (currently lines 110–112 in the `@theme inline` block, plus the `h1, h2, h3...` block around line 294)

- [ ] **Step 1: Replace the font stack declaration**

Find this line in the `@theme inline` block (currently line ~111):

```css
  --font-heading: "Cal Sans", "Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Replace with:

```css
  --font-heading: "Newsreader Variable", "Newsreader", "Iowan Old Style", Georgia, "Times New Roman", serif;
```

- [ ] **Step 2: Update heading base styles**

Find the heading block (currently around lines 294–308 in `app.css`):

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--foreground);
  text-wrap: balance;
}

h1 { font-size: var(--fs-h1); font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; }
h2 { font-size: var(--fs-h2); font-weight: 600; letter-spacing: -0.04em; line-height: 1.1; }
h3 { font-size: 28px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2; }
h4 { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; }
h5 { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
```

Replace with:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--foreground);
  text-wrap: balance;
}

h1 { font-size: var(--fs-h1); font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; }
h2 { font-size: var(--fs-h2); font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; }
h3 { font-size: 28px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.2; }
h4 { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
h5 { font-size: 18px; font-weight: 600; letter-spacing: 0; }
```

(Newsreader wants looser tracking than Cal Sans — `-0.02em` instead of `-0.04em` on display sizes — and `font-weight: 500` for h1/h2 reads as the "literary" Newsreader weight, with 600 reserved for h3+ short headlines.)

- [ ] **Step 3: Verify**

```bash
grep -E 'font-heading|font-weight: 5[0-9][0-9]' src/app.css | head -10
```
Expected: shows the new values; no `Cal Sans` references remain.

- [ ] **Step 4: No commit yet — batch with Task P1.10**

### Task P1.6: Add Newsreader preload to `app.html`

**Files:**
- Modify: `src/app.html`

- [ ] **Step 1: Find the Newsreader 500 woff2 file in node_modules**

Run:
```bash
find node_modules/@fontsource-variable/newsreader/files -name '*latin-wght-normal*' -name '*.woff2' | head -3
```
Expected: a path like `node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2`. Note this exact filename — you'll need it for the preload `href`.

- [ ] **Step 2: Add the preload tag in `app.html`**

In `src/app.html`, find the `<head>` section. After the existing `<link rel="preconnect">` lines (around line 8–10) and before `%sveltekit.head%`, INSERT:

```html
		<!-- Preload Newsreader 500 — render-critical for every headline -->
		<link
			rel="preload"
			href="/node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"
			as="font"
			type="font/woff2"
			crossorigin
		/>
```

NOTE: the exact path may differ depending on the package version. After bundling, Vite hashes and emits the font under `/_app/immutable/assets/`. The preload-via-modulegraph approach SvelteKit uses (`%sveltekit.head%`) typically handles this — but adding the explicit preload ensures first-paint stability. If `npm run build` rewrites the path, that's fine; if it complains about the path, remove this preload (Vite will still serve the font, just without preload). Verify in P1.16.

- [ ] **Step 3: No commit yet — batch with Task P1.10**

### Task P1.7: Update radii values in `:root`

**Files:**
- Modify: `src/app.css` — radii block (currently lines 239–244)

- [ ] **Step 1: Replace the radii values**

Find this block:

```css
  /* ── Radius — institutional but not rectangular. 4/8/12/16 progression... ── */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
```

Replace with:

```css
  /* ── Radius — editorial-soft 4/6/10/14/20 progression (looser than Cal). ── */
  --radius-sm: 4px;
  --radius-md: 6px;     /* buttons, inputs */
  --radius-lg: 10px;    /* feature cards (was 8px) */
  --radius-xl: 14px;    /* hero mockup card, FAQ list wrapper (was 12px) */
  --radius-2xl: 20px;   /* full-bleed section card wrappers (was 16px) */
  --radius-3xl: 24px;
```

- [ ] **Step 2: No commit yet — batch with Task P1.10**

### Task P1.8: Update shadow alpha to ink color

**Files:**
- Modify: `src/app.css` — `@utility shadow-*` blocks (currently around lines 520–540)

- [ ] **Step 1: Replace shadow utilities**

Find each of these `@utility` blocks and update the `rgba(5, 28, 44, ...)` values to `rgba(15, 31, 58, ...)`:

```css
@utility shadow-card-hover {
  box-shadow: 0 2px 0 0 rgba(15, 31, 58, 0.10);
}

@utility shadow-popover {
  box-shadow: 0 8px 24px rgba(15, 31, 58, 0.10);
}

@utility shadow-mockup {
  box-shadow: 0 2px 12px rgba(15, 31, 58, 0.08);
}
```

(The `shadow-card`, `shadow-glow-primary`, and `shadow-glow-destructive` utilities don't need changes — `shadow-card` is `none`, glow-primary is `none`, glow-destructive uses `var(--destructive)` which we'll repoint in Task P1.9.)

- [ ] **Step 2: Update the `::selection` rule**

Find:

```css
::selection {
  background-color: rgba(17, 17, 17, 0.15);
  color: var(--foreground);
}
```

Replace with:

```css
::selection {
  background-color: rgba(15, 31, 58, 0.18);
  color: var(--foreground);
}
```

- [ ] **Step 3: No commit yet — batch with Task P1.10**

### Task P1.9: Repoint semantic tokens to warm palette

**Files:**
- Modify: `src/app.css` — semantic tokens in `:root` (currently lines 197–214)

- [ ] **Step 1: Update the destructive / warning / success / info values**

Find these in `:root` and replace with new values (keep the variable names — only the hex values change):

```css
  /* ── Semantic: Destructive (used in data-viz / safety only) ── */
  --destructive: #B23A2C;                   /* aligned with --accent-brick — single-source urgency */
  --destructive-foreground: #FBF7F0;        /* cream on brick — 5.3:1 (AAA-large only); for AAA body, override per-component */
  --danger: #8A2A1F;                        /* darker brick for danger states */
  --danger-foreground: #FBF7F0;

  /* ── Semantic: Warning — mustard with navy ink ── */
  --warning: #D4A017;                       /* aligned with --accent-mustard */
  --warning-foreground: #0F1F3A;            /* navy on mustard — 7.1:1 AAA body ✓ */
  --warning-text: #0F1F3A;

  /* ── Semantic: Success — sage ── */
  --success: #4A6B47;                       /* aligned with --accent-sage */
  --success-foreground: #FBF7F0;            /* cream on sage — 5.5:1 (AAA-large only) */

  /* ── Semantic: Info — navy anchor ── */
  --info: #0F1F3A;                          /* navy replaces McK blue — single anchor */
  --info-foreground: #FBF7F0;
```

- [ ] **Step 2: No commit yet — batch with Task P1.10**

### Task P1.10: Add `section-editorial` utility + commit P1 token batch

**Files:**
- Modify: `src/app.css` — append `@utility` block

- [ ] **Step 1: Add the section-editorial utility**

At the bottom of `src/app.css` (after the existing `@utility pb-safe` block), APPEND:

```css
@utility section-editorial {
  padding-block: clamp(80px, 9vw, 120px);
}
```

- [ ] **Step 2: Run a full build to confirm everything parses**

```bash
npm run build 2>&1 | tail -10
```
Expected: green build. Look at total CSS bundle size — should be roughly comparable to before (Newsreader Variable adds ~50KB of font, replaces Cal Sans ~25KB + Playfair Variable ~80KB, net DROP of ~55KB).

- [ ] **Step 3: Commit the entire token + typography batch**

```bash
git add src/app.css src/app.html
git commit -m "feat(editorial): foundation tokens + Newsreader + warm shadows + radii

Repoints --background to warm cream (#FBF7F0) and --foreground to deep
navy (#0F1F3A) — every existing bg-background and text-foreground
utility across 30+ pages now resolves to the new palette automatically,
no per-page edits required.

Adds Stripe Press accent tokens (mustard / brick / sage with -ink
darker variants for AAA body), dark-section tokens (--section-navy,
--on-navy, --on-navy-soft, --on-navy-mustard), and warm hairlines.
Tailwind utilities auto-generated via @theme inline block.

--font-heading switches from Cal Sans to Newsreader Variable. Heading
weights drop from 600 to 500 for h1/h2 (Newsreader 500 is the literary
display weight); h3-h5 stay at 600. Letter-spacing loosens from
-0.04em to -0.02em — Newsreader wants more air than Cal Sans.

Shadow alpha migrates from rgba(5,28,44) (McK navy) to rgba(15,31,58)
(new ink), so shadows track the ink color cleanly across surfaces.
Radii loosen one notch on lg/xl/2xl per editorial softness spec.

Spec: docs/superpowers/specs/2026-05-02-stripe-press-redesign-design.md
sections 4.1–4.6.
"
```

### Task P1.11: Update lint-cal-sans-scope.sh → lint-newsreader-scope.sh (warn mode)

**Files:**
- Rename: `scripts/lint-cal-sans-scope.sh` → `scripts/lint-newsreader-scope.sh`
- Modify: the renamed script body (invert the rule)
- Modify: `scripts/lint-all.sh` — update reference

- [ ] **Step 1: Inspect the existing script**

```bash
cat scripts/lint-cal-sans-scope.sh
```
Note its current logic — it likely greps for the wrong/right Cal Sans usage.

- [ ] **Step 2: Rename the file via git**

```bash
git mv scripts/lint-cal-sans-scope.sh scripts/lint-newsreader-scope.sh
```

- [ ] **Step 3: Rewrite the body to ban Cal Sans and warn (not error) for now**

Replace the contents of `scripts/lint-newsreader-scope.sh` with:

```bash
#!/usr/bin/env bash
#
# lint-newsreader-scope.sh
# Bans `Cal Sans` font references in templates and CSS (post-Stripe Press migration).
# Runs in WARN mode during P1/P2 so the migration doesn't trip CI mid-way.
# P6 flips this to ERROR mode (non-zero exit on hits).
#
set -euo pipefail

WARN_MODE="${WARN_MODE:-1}"  # default warn; export WARN_MODE=0 to flip to error in P6

violations=$(grep -rEn '"Cal Sans"|font-family:\s*Cal Sans|font-display.*cal-sans' \
  --include='*.svelte' --include='*.css' --include='*.ts' --include='*.js' \
  src/ scripts/ 2>/dev/null \
  | grep -v 'lint-newsreader-scope\|lint-cal-sans-scope\|2026-05-01-cal-com-redesign-design' || true)

if [[ -n "$violations" ]]; then
  echo "✘ Cal Sans references found (banned post-Stripe Press migration):"
  echo "$violations"
  if [[ "$WARN_MODE" == "1" ]]; then
    echo "  (warn mode — not failing CI; P6 flips to error)"
    exit 0
  else
    exit 1
  fi
fi

echo "✓ Newsreader scope lint: no Cal Sans references."
exit 0
```

- [ ] **Step 4: Make it executable**

```bash
chmod +x scripts/lint-newsreader-scope.sh
```

- [ ] **Step 5: Update `scripts/lint-all.sh` reference**

```bash
grep -n 'cal-sans-scope\|newsreader-scope' scripts/lint-all.sh
```
If `lint-cal-sans-scope.sh` is referenced in `lint-all.sh`, replace with `lint-newsreader-scope.sh`. Use:

```bash
sed -i.bak 's|lint-cal-sans-scope|lint-newsreader-scope|g' scripts/lint-all.sh
rm scripts/lint-all.sh.bak
```

- [ ] **Step 6: Run the renamed script standalone to verify it executes**

```bash
bash scripts/lint-newsreader-scope.sh
```
Expected: warns about any remaining Cal Sans refs but exits 0 (warn mode).

- [ ] **Step 7: No commit yet — batch with Task P1.13**

### Task P1.12: Update lint-pastel-on-cta.sh + lint-hardcoded-color.sh + lint-muted-hover.sh (warn mode)

**Files:**
- Modify: `scripts/lint-pastel-on-cta.sh`
- Modify: `scripts/lint-hardcoded-color.sh`
- Modify: `scripts/lint-muted-hover.sh`

- [ ] **Step 1: Update lint-pastel-on-cta.sh — add new accent tokens, force warn mode**

Read the existing script:

```bash
cat scripts/lint-pastel-on-cta.sh
```

Update its grep pattern to also look for `bg-accent-mustard`, `bg-accent-brick`, `bg-accent-sage` on `<Button>` / `<a class="...btn...">` elements, and add a warn-mode flag at the top matching P1.11. The exact replacement depends on the current script body — preserve the existing pastel-* checks and ADD the accent checks.

After editing, the body should include:

```bash
# Warn during P1/P2 migration; P6 flips to error
WARN_MODE="${WARN_MODE:-1}"
# ...
# Accent tokens: only mustard is allowed on CTAs (and only inside SectionDark)
# Brick and sage are large-area-only — banned on any Button/a[role="button"]
violations=$(grep -rEn 'class="[^"]*(bg-accent-(brick|sage))[^"]*"' \
  --include='*.svelte' src/routes/ src/lib/ 2>/dev/null \
  | grep -E 'Button|<a [^>]*role="button"|<button' || true)
```

If the existing script's structure makes this hard to add cleanly, REPLACE the whole script with a new version that combines pastel + accent checks.

- [ ] **Step 2: Update lint-hardcoded-color.sh allow-list**

Read the existing script:

```bash
cat scripts/lint-hardcoded-color.sh
```

Add the new ban-list hexes to the grep pattern (the OLD Cal hexes `#111111`, `#F5F5F5`, `#101010` and the NEW Stripe Press tokens `#FBF7F0`, `#0F1F3A`, `#D4A017`, `#B23A2C`, `#4A6B47` — both sets are banned outside `app.css`). Keep the existing `// lint-ok` annotation exemption.

After editing, the body should include WARN_MODE flag like above.

- [ ] **Step 3: Update lint-muted-hover.sh**

Read:

```bash
cat scripts/lint-muted-hover.sh
```

Extend the regex to also catch `hover:bg-canvas-elevated/N<100`. Add WARN_MODE flag.

- [ ] **Step 4: No commit yet — batch with Task P1.13**

### Task P1.13: Run full lint orchestrator + commit P1 lint batch

**Files:** none (verification + commit)

- [ ] **Step 1: Run `npm run lint`**

```bash
npm run lint 2>&1 | tail -30
```
Expected: green (no errors). The new lint scripts may print warnings about hex usages but won't fail because they're in warn mode.

- [ ] **Step 2: Commit the lint script batch**

```bash
git add scripts/
git commit -m "chore(editorial): update lint scripts for Stripe Press tokens (warn mode)

- Renames lint-cal-sans-scope.sh → lint-newsreader-scope.sh, inverts
  the rule (now bans Cal Sans references).
- Updates lint-pastel-on-cta.sh, lint-hardcoded-color.sh,
  lint-muted-hover.sh for the new accent + canvas tokens.
- All scripts run in WARN_MODE during P1/P2 (warn but exit 0) so the
  migration doesn't trip CI before homepage validates. P6 flips them
  to error mode after the page-wave migrations land.
"
```

### Task P1.14: Smoke test P1 by booting dev server

**Files:** none (manual verification)

- [ ] **Step 1: Start dev server**

```bash
npm run dev -- --port 5177 &
DEV_PID=$!
```
(Or run in a separate terminal — note the dev server PID for cleanup.)

- [ ] **Step 2: Visit `http://localhost:5177/` and verify**

Open the page in a browser (hard refresh with Cmd+Shift+R / Ctrl+Shift+R). Expected:

- Background is warm cream `#FBF7F0` (NOT pure white)
- Body text is deep navy `#0F1F3A` (NOT Cal black `#111`)
- Headlines render in **Newsreader serif** (NOT Cal Sans geometric sans)
- The page layout is unchanged from before — sections, cards, content all in same positions
- The accent system is NOT yet visible (per-section accents land in P2)

This confirms the token swap works at the foundation level.

- [ ] **Step 3: Visit `/demo`, `/compliance`, `/blog`, `/about`**

Same hard-refresh check on each. All should show:
- Cream canvas + navy ink + serif headlines
- Existing layout intact

- [ ] **Step 4: Stop dev server**

```bash
kill $DEV_PID 2>/dev/null || true
```
(Or Ctrl+C in the dev terminal.)

- [ ] **Step 5: Visual baseline — capture mid-migration screenshots (optional, useful for diff)**

If desired, capture `docs/superpowers/baselines/2026-05-02-post-p1/<page>.png` for the same 5 pages — a "midpoint" reference between pre-redesign baselines and the eventual P2 homepage.

(No commit on this task — verification only.)

### Task P1.15: Run test:ci and commit confirmation

**Files:** none (verification)

- [ ] **Step 1: Run the full test suite**

```bash
npm run test:ci 2>&1 | tail -20
```
Expected: exits 0. Lint is green (warn mode), svelte-check is green, audits pass, unit tests pass, e2e passes.

If e2e fails on visual regression — that's expected for the homepage which now renders cream-on-navy instead of white-on-Cal-black. Update or skip those e2e snapshots as a quick edit (not part of this plan — flag to user as a follow-up).

- [ ] **Step 2: If everything passes, P1 is done. Push the branch:**

```bash
git push -u origin redesign/stripe-press
```

- [ ] **Step 3: P1 reviewer signal**

P1 is complete when:
- `main` page (homepage) renders with cream + navy + Newsreader headlines
- All 30+ public pages render unchanged in layout
- `npm run test:ci` exits 0
- No commits violate the warn-mode lint scripts at error severity

P1 is the **token-only foundation phase**. Per-section accents and component refactors land in P2.

---

## P2: Homepage choreography (validation point)

The homepage `/` is the validation gate per spec §8. After P2 ships, Ignacio reviews in browser before P3+ are planned.

### Task P2.1: Build `<SectionDark>` component

**Files:**
- Create: `src/lib/components/cal/SectionDark.svelte`

- [ ] **Step 1: Create the file**

```svelte
<!--
  SectionDark.svelte — full-bleed navy section wrapper.
  Used by Compliance + Final CTA bands per spec §6 sections 7 + 10.
  Footer stays its own deeper-navy surface — does NOT use this wrapper.

  Inside SectionDark, all text MUST use text-on-navy / text-on-navy-soft / text-on-navy-mustard.
  Mustard CTAs are allowed inside (9.1:1 boundary on navy bg).
-->
<script lang="ts">
  type Variant = 'compliance' | 'cta';
  let { variant = 'compliance', children }: {
    variant?: Variant;
    children: import('svelte').Snippet;
  } = $props();

  // Both variants share bg + ink colors. Variant differs only in inner max-width.
  const innerMaxW = $derived(variant === 'cta' ? 'max-w-4xl' : 'max-w-7xl');
</script>

<section class="section-editorial bg-section-navy text-on-navy">
  <div class="mx-auto {innerMaxW} px-4 sm:px-6 lg:px-8">
    {@render children()}
  </div>
</section>
```

- [ ] **Step 2: Verify type checking passes**

```bash
npx svelte-kit sync && npx svelte-check --tsconfig tsconfig.json 2>&1 | tail -10
```
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/cal/SectionDark.svelte
git commit -m "feat(editorial): add SectionDark — full-bleed navy band wrapper

Used by Compliance + Final CTA per spec §6 sections 7 + 10. Two
navy bookends ahead of the dark footer create the editorial 'rest'
rhythm the spec calls for. Variant prop only affects inner max-width
('cta' = max-w-4xl for tighter close, 'compliance' = max-w-7xl for
the countdown grid).
"
```

### Task P2.2: Add `accent` prop to `FeatureCardCal.svelte`

**Files:**
- Modify: `src/lib/components/cal/FeatureCardCal.svelte`

- [ ] **Step 1: Read the current component**

```bash
cat src/lib/components/cal/FeatureCardCal.svelte
```

Note its current props and structure. The change is additive — keep all existing props/slots, add a new `accent` prop with five values (`mustard | brick | sage | navy | none`).

- [ ] **Step 2: Update the script section**

Add to the `<script lang="ts">` block:

```ts
type Accent = 'mustard' | 'brick' | 'sage' | 'navy' | 'none';
let { /* existing props */, accent = 'none' }: {
  /* existing types */;
  accent?: Accent;
} = $props();

const accentClass = $derived(
  accent === 'mustard' ? 'border-l-2 border-accent-mustard' :
  accent === 'brick'   ? 'border-l-2 border-accent-brick' :
  accent === 'sage'    ? 'border-l-2 border-accent-sage' :
  accent === 'navy'    ? 'border-l-2 border-ink' :
  ''
);
```

- [ ] **Step 3: Update the wrapper element classes**

In the markup, find the outermost card element (typically a `<div>` or `<a>` with `class="rounded-xl border ..."`). Update its class to:

- If `accent === 'none'`: keep current `border` (full border on all sides)
- If accent !== 'none': replace `border` with `accentClass` (left rule only — `border-t-0 border-r-0 border-b-0`)

Use a derived class:

```ts
const wrapperClass = $derived(
  accent === 'none'
    ? 'rounded-lg border border-hairline-warm bg-canvas-elevated'
    : `rounded-lg ${accentClass} border-t-0 border-r-0 border-b-0 bg-canvas-elevated`
);
```

Apply to the markup root:

```svelte
<div class="{wrapperClass} p-6 transition-all duration-[160ms] hover:bg-canvas-strong hover:-translate-y-[1px] hover:shadow-card-hover">
  <!-- existing inner content unchanged -->
</div>
```

For accented cards, on hover the left rule grows from 2px to 4px:

```svelte
{#if accent !== 'none'}
  <style>
    /* per-instance hover rule grow — relies on the parent group */
    .group:hover { border-left-width: 4px; }
  </style>
{/if}
```

(If the existing component doesn't use the `group` class, add it on the wrapper.)

- [ ] **Step 4: Verify type checking and build**

```bash
npx svelte-check --tsconfig tsconfig.json 2>&1 | tail -10
npm run build 2>&1 | tail -8
```
Expected: both green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/cal/FeatureCardCal.svelte
git commit -m "feat(editorial): FeatureCardCal — accent prop with left-rule editorial device

Adds optional accent ∈ {mustard | brick | sage | navy | none}. Default
'none' keeps the existing full-border card. Non-none renders a 2px
colored left rule (top/right/bottom borderless) on cream-elevated bg.
Hover grows the left rule 2→4px paired with 1px translate-y up — the
canonical 4-vector card hover the spec calls 'editorial-column device.'

This is the visual hook that says 'publication' instead of 'SaaS card.'
"
```

### Task P2.3: Update `HeroAppMockupCard.svelte` with cream-elevated frame + navy left rule

**Files:**
- Modify: `src/lib/components/cal/HeroAppMockupCard.svelte`

- [ ] **Step 1: Read the current component**

```bash
cat src/lib/components/cal/HeroAppMockupCard.svelte
```

- [ ] **Step 2: Wrap the existing white-card markup in a cream-elevated frame**

In the `<HeroAppMockupCard>` template, locate the outermost wrapper. Current pattern is likely a single white card with hairline border. Change to a two-layer structure:

```svelte
<!-- Outer cream-elevated frame with navy left-rule spine -->
<div class="rounded-xl border-l-2 border-ink bg-canvas-elevated p-3 sm:p-4">
  <!-- Inner white card containing the dashboard mockup (unchanged) -->
  <div class="overflow-hidden rounded-lg border border-hairline-warm bg-background shadow-mockup">
    <!-- existing slot / content here, unchanged -->
    <slot />
  </div>
</div>
```

(The dashboard mockup INSIDE needs to stay white because the carousel content was designed for white bg. The OUTER frame is cream — it's the "editorial column" the dashboard is mounted on.)

- [ ] **Step 3: Verify**

```bash
npx svelte-check 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/cal/HeroAppMockupCard.svelte
git commit -m "feat(editorial): HeroAppMockupCard — cream frame + navy left-rule spine

The dashboard mockup itself stays white inside, but is now mounted in
a cream-elevated outer frame with a 2px navy left rule. Reads as 'a
clipping mounted in an editorial column with a navy spine' per spec
§5.2."
```

### Task P2.4: Recolor `NavPillGroup.svelte`

**Files:**
- Modify: `src/lib/components/cal/NavPillGroup.svelte`

- [ ] **Step 1: Read current implementation**

```bash
cat src/lib/components/cal/NavPillGroup.svelte
```

- [ ] **Step 2: Update the active + inactive segment classes**

- Outer pill wrapper: change `bg-canvas-pure` (or whatever the previous Cal name was) → `bg-canvas-elevated`
- Active segment: change to `bg-canvas` (cream) with `shadow-card-hover` (was `bg-canvas-pure` with `shadow-card`)
- Inactive segment: stays transparent text in `text-muted-foreground`

If the file doesn't reference `bg-canvas-pure` (because it used `bg-background`), the token-repoint in P1 already handled it — just verify visually.

- [ ] **Step 3: Verify and commit**

```bash
npx svelte-check 2>&1 | tail -3
git add src/lib/components/cal/NavPillGroup.svelte
git commit -m "feat(editorial): NavPillGroup — recolor active segment to bg-canvas + shadow-card-hover"
```

### Task P2.5: Rename `PastelBadge.svelte` variants to accent system

**Files:**
- Modify: `src/lib/components/cal/PastelBadge.svelte`

- [ ] **Step 1: Read the current component**

```bash
cat src/lib/components/cal/PastelBadge.svelte
```

- [ ] **Step 2: Replace pastel variants with accent variants**

Old variant prop: `variant: 'orange' | 'pink' | 'violet' | 'emerald'`
New variant prop: `variant: 'mustard' | 'brick' | 'sage' | 'navy'`

Update the variant-to-class lookup map:

```ts
type Variant = 'mustard' | 'brick' | 'sage' | 'navy';
const VARIANT_CLASS: Record<Variant, string> = {
  mustard: 'bg-accent-mustard text-ink',          // small badge so 1.4.11 boundary OK in context
  brick:   'bg-accent-brick text-on-navy',        // cream on brick — 5.3:1 (AAA-large only — keep badge text small/short)
  sage:    'bg-accent-sage text-on-navy',         // cream on sage — 5.5:1 (AAA-large only)
  navy:    'bg-section-navy text-on-navy',        // navy badge on cream
};
```

- [ ] **Step 3: Find and update existing usages site-wide**

```bash
grep -rn 'variant="(orange|pink|violet|emerald)"' src/ 2>&1
```
Each match needs to be remapped — but this plan handles only homepage usages in P2. For non-homepage usages (mostly blog posts), leave them; P3/P4/P5 plans will fix them.

For the homepage (`+page.svelte`) — there are no current `<PastelBadge>` usages (verified — homepage uses inline pill markup). If there ARE any, swap variant names:
- `orange` → `mustard`
- `pink` → `brick`
- `violet` → `navy`
- `emerald` → `sage`

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/cal/PastelBadge.svelte
git commit -m "feat(editorial): PastelBadge — rename variants to accent system (mustard/brick/sage/navy)

Pastel orange/pink/violet/emerald variants deprecate. New variants align
with the accent token system. Homepage has no current PastelBadge
usages so no callsite migration needed in P2; non-homepage callsites
migrate in their respective P3/P4/P5 plans."
```

### Task P2.6: Recolor `ProductMockupCard.svelte`

**Files:**
- Modify: `src/lib/components/cal/ProductMockupCard.svelte`

- [ ] **Step 1: Read**

```bash
cat src/lib/components/cal/ProductMockupCard.svelte
```

- [ ] **Step 2: Update wrapper to cream-elevated bg + warm hairline**

Find the outermost wrapper class. Update:
- `bg-card` (which now resolves to `#FFFFFF` — no, we didn't repoint card; check) → keep as `bg-canvas-elevated`
- `border-border` → `border-hairline-warm`

The internal padding (`p-6`) stays.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/cal/ProductMockupCard.svelte
git commit -m "feat(editorial): ProductMockupCard — cream-elevated bg + warm hairline"
```

### Task P2.7: Recolor `Footer.svelte` to deeper navy

**Files:**
- Modify: `src/lib/components/Footer.svelte`

- [ ] **Step 1: Read current footer**

```bash
cat src/lib/components/Footer.svelte | head -40
```

- [ ] **Step 2: Update bg + text classes**

Find any `bg-surface-dark` (which currently resolves to `#101010`) on the outer footer element, change to `bg-[#0A1628]` — actually NO, never hardcode hex. The right fix is: in `app.css`, add a token alias and reference it. But to keep P2 surgical, repoint `--surface-dark` itself in `app.css` to `#0A1628`:

This means going back to Task P1.3 territory — let me clarify: in `app.css`, find:

```css
  --surface-dark: #101010;                  /* Cal dark footer + featured pricing tier */
```

And update to:

```css
  --surface-dark: #0A1628;                  /* Stripe Press deeper navy footer (warmer than Cal #101010) */
```

This is a one-line change in `app.css`. Add it as a quick app.css edit before touching the Svelte file.

Then verify Footer.svelte already uses `bg-surface-dark` (it should from the Cal migration). If it does, no Svelte change needed — the token swap cascades.

- [ ] **Step 3: Verify text classes use on-navy tokens**

In `Footer.svelte`, find any `text-on-dark` / `text-on-dark-soft` classes. Those currently resolve to white/grey. They'll need to become `text-on-navy` / `text-on-navy-soft` to use the new tokens — but `--on-dark` and `--on-navy` are essentially the same (cream on navy). The cleanest move:
- Keep `text-on-dark` / `text-on-dark-soft` references in the Svelte template
- In `app.css`, repoint `--on-dark` → `var(--on-navy)` and `--on-dark-soft` → `var(--on-navy-soft)`

This way Footer.svelte stays untouched and the cascade does the work.

- [ ] **Step 4: Add the `--surface-dark` + `--on-dark` repoints in `app.css`**

In `:root`, find these existing tokens (likely lines 151–156):

```css
  --surface-dark: #101010;
  --surface-dark-elevated: #1A1A1A;
  --on-dark: #FFFFFF;
  --on-dark-soft: #A1A1AA;
```

Replace with:

```css
  --surface-dark: #0A1628;                  /* Stripe Press deeper navy footer */
  --surface-dark-elevated: #14213A;         /* nested cards inside dark surfaces (warmer than #1A1A1A) */
  --on-dark: var(--on-navy);                /* alias to new on-navy (cream) — keeps Footer.svelte untouched */
  --on-dark-soft: var(--on-navy-soft);
```

- [ ] **Step 5: Verify and commit**

```bash
npm run build 2>&1 | tail -3
git add src/app.css
git commit -m "feat(editorial): footer surface migrates to deeper navy + cream type

Repoints --surface-dark from Cal #101010 to Stripe Press #0A1628 (warmer
navy, sits closer to the section-navy bookends). --on-dark and
--on-dark-soft alias to --on-navy / --on-navy-soft so Footer.svelte
needs no template changes — the token cascade does the work."
```

### Task P2.8: Refactor homepage hero (section 1)

**Files:**
- Modify: `src/routes/+page.svelte` — the `<section>` containing the hero (currently around lines 252–423)

- [ ] **Step 1: Read the current hero**

```bash
sed -n '249,330p' src/routes/+page.svelte
```

- [ ] **Step 2: Update the hero section per spec §6 row 1**

Key changes (preserve all i18n keys and existing logic — change ONLY classes and add the HeroAppMockupCard wrapper):

1. **Eyebrow / countdown badge** — change `border-primary/20 bg-primary/[0.06] ... text-foreground` → `border-accent-mustard-ink/30 bg-accent-mustard/10 ... text-accent-mustard-ink`. (Mustard pill with darker mustard ink — AAA-borderline body so use the -ink variant.)

2. **Primary CTA** — currently uses default `<Button>` (which resolves to navy fill via `--primary` repoint to `#0F1F3A`... wait, let me check). Confirm: in `app.css` `:root`, `--primary` should be repointed to `var(--ink)` so existing `<Button>` (which uses `bg-primary text-primary-foreground`) automatically becomes navy fill + cream text. **This is a one-line fix in `app.css` you may need:**

   ```css
   /* find and update */
   --primary: var(--ink);                   /* was #111111 */
   --primary-foreground: var(--canvas);     /* was #FFFFFF */
   --primary-hover: #1A2D4A;                /* slightly lighter navy for hover */
   --primary-pressed: #1A2D4A;
   ```

   Add this to `:root` if it isn't already from P1.3. (This was implicit in P1's `--foreground = var(--ink)` but `--primary` wasn't repointed — fix that now.)

3. **Outline secondary CTA** — already uses default outline variant which is now navy outline, ink fill on hover. Works as-is.

4. **Dashboard mockup wrapper** — wrap the existing `<div class="overflow-hidden rounded-xl border border-border bg-card shadow-mockup">...</div>` block in `<HeroAppMockupCard>`:

   ```svelte
   <HeroAppMockupCard>
     <!-- existing carousel markup -->
   </HeroAppMockupCard>
   ```

   Import at the top: `import HeroAppMockupCard from '$lib/components/cal/HeroAppMockupCard.svelte';`

- [ ] **Step 3: Verify**

```bash
npx svelte-check 2>&1 | tail -5
```

- [ ] **Step 4: Visual check via dev server**

```bash
npm run dev -- --port 5177 &
```
Visit `http://localhost:5177/`. Verify:
- Hero eyebrow renders as mustard pill with brick dot
- Primary CTA is navy filled with cream text
- Dashboard mockup sits inside cream frame with navy left rule

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte src/app.css
git commit -m "feat(editorial): homepage hero — navy CTA, mustard eyebrow, navy-rule mockup frame

- Eyebrow countdown badge: mustard pill with brick dot, darker
  mustard-ink text for AAA body.
- Primary CTA: navy fill + cream text (16:1 AAA boundary). Driven by
  --primary repoint to var(--ink) in app.css :root.
- Outline secondary CTA: navy outline, ink fill on hover.
- Dashboard mockup wrapped in <HeroAppMockupCard> — cream-elevated
  frame with 2px navy left rule.
"
```

### Task P2.9: Refactor trust strip (section 2)

**Files:**
- Modify: `src/routes/+page.svelte` — section 2 (currently around lines 430–458)

- [ ] **Step 1: Update the trust strip per spec §6 row 2**

Find the `<section class="reveal border-y border-border bg-secondary py-10" aria-label="Arquitectura verificable">` block.

Update class to `<section class="reveal border-y border-hairline-warm bg-canvas py-10" ...>`.

Inside, each fact column currently has an icon (Building / Lock / Zap / Shield) + label + value. Per spec, replace each icon with a tiny mustard rule above the label:

For each `<div class="flex flex-col items-center px-4 text-center lg:px-6">`:

```svelte
<div class="flex flex-col items-center px-4 text-center lg:px-6">
  <span class="mb-2 block h-px w-6 bg-accent-mustard" aria-hidden="true"></span>
  <dt class="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-mustard-ink">Datos</dt>
  <dd class="mt-2 text-sm font-medium leading-snug text-foreground">{t('trust.servers')}</dd>
</div>
```

(Remove the icon `<Building class="size-5 text-primary" />` — replaced by the mustard rule. Do this for all 4 columns: Datos, Cifrado, Integración, Cumplimiento.)

- [ ] **Step 2: Verify and commit**

```bash
npx svelte-check 2>&1 | tail -3
git add src/routes/+page.svelte
git commit -m "feat(editorial): trust strip — mustard rule above each fact, no icons

Replaces the 4-icon row with editorial fact strip per spec §6 row 2.
Tiny 24px mustard rule above each fact reads as a 'spec sheet' header,
not a badge row."
```

### Task P2.10: Refactor editorial anchor (section 3)

**Files:**
- Modify: `src/routes/+page.svelte` — section 3 (currently around lines 466–509)

- [ ] **Step 1: Update per spec §6 row 3**

Find the `<section class="reveal py-14 sm:py-20" aria-labelledby="editorial-heading">` block.

Verify (or update):
- `<blockquote>` already uses `font-heading` (will resolve to Newsreader after P1) — good
- Italic styling preserved (`italic` Tailwind class)
- Stats grid: numbers in `font-heading` Newsreader, labels in `text-muted-foreground` (which is now `--ink-soft`)

Class updates:
- `border-y border-border` → `border-y border-hairline-warm`
- `divide-x divide-border` → `divide-x divide-hairline-warm`
- `text-foreground` (numbers) — stays (resolves to ink)
- `text-muted-foreground` (labels) — stays (resolves to ink-soft)

Add a small mustard rule above the eyebrow (per the editorial pattern) — find:

```svelte
<span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
```

Update to:

```svelte
<span class="mx-auto block h-px w-12 bg-accent-mustard" aria-hidden="true"></span>
```

(Mustard rule = decorative-only on cream, OK.)

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): editorial anchor — mustard short rule, warm hairlines"
```

### Task P2.11: Refactor problem section (section 4) with brick accent

**Files:**
- Modify: `src/routes/+page.svelte` — section 4 (currently around lines 514–558)

- [ ] **Step 1: Update per spec §6 row 4**

Find the `<section class="reveal py-16 sm:py-20 lg:py-24" id="problem">` block.

1. Eyebrow text (`<span class="text-primary">{t('problem.overline')}</span>`) — change to `<span class="text-accent-brick-ink">{t('problem.overline')}</span>` (brick-ink for AAA body).

2. Three problem cards — currently use the inline div pattern. Replace each card with `<FeatureCardCal>` with `accent="brick"`:

   ```svelte
   <FeatureCardCal
     icon={AlertTriangle}
     title={t('problem.card1.title')}
     description={t('problem.card1.desc')}
     accent="brick"
   />
   ```

   (And similarly for card2 with `Shield` icon and card3 with `FileCheck`.)

   Add the import at the top: `import FeatureCardCal from '$lib/components/cal/FeatureCardCal.svelte';`

3. Inside `<FeatureCardCal>`, the icon color tracks accent — handled in P2.2.

- [ ] **Step 2: Verify**

```bash
npx svelte-check 2>&1 | tail -5
npm run build 2>&1 | tail -3
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): problem section — brick accent eyebrow + brick left-rule cards

Three problem cards use FeatureCardCal accent='brick' — 2px brick left
rule grows to 4px on hover. Eyebrow switches from text-primary to
text-accent-brick-ink (7.6:1 AAA body)."
```

### Task P2.12: Refactor features section (section 6) with sage accent

**Files:**
- Modify: `src/routes/+page.svelte` — section 6 (currently around lines 563–656)

- [ ] **Step 1: Update per spec §6 row 6**

Find the `<section class="reveal bg-secondary py-16 sm:py-20 lg:py-24" id="features">` block.

1. Section bg: `bg-secondary` → `bg-canvas-elevated` (slightly deeper cream tier per spec).

2. Eyebrow: `text-primary` → `text-accent-sage-ink`.

3. Featured Ficha 360° card — currently a large `<a>` with grid layout. Wrap in `FeatureCardCal accent="sage"` IF the existing markup is too custom to fit the component, KEEP the existing markup and just update its classes:
   - `border border-border` → `border-l-2 border-accent-sage` + `border-t-0 border-r-0 border-b-0`
   - `bg-card` → `bg-canvas-elevated`
   - The big "01" numeral: `text-primary` → `text-accent-sage`

4. Three supporting cards (currently inline `<a>` blocks) — same treatment: sage left rule, cream-elevated bg, sage numerals (02, 03, 04).

5. Compliance banner row at bottom: `bg-card` → `bg-canvas-elevated`, hairline warm, sage shield icon (`text-primary` → `text-accent-sage`).

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): features section — sage accent, cream-elevated bg, sage numerals

Section bg deepens to bg-canvas-elevated. Featured Ficha 360° card and
3 supporting cards all use sage left-rule + cream-elevated bg per spec
§6 row 6. The big '01' numeral and supporting numerals (02-04) render
in --accent-sage Newsreader 500."
```

### Task P2.13: Refactor compliance + countdown (section 7) with `<SectionDark>`

**Files:**
- Modify: `src/routes/+page.svelte` — section 7 (currently around lines 663–746)

- [ ] **Step 1: Wrap the entire section 7 in `<SectionDark variant="compliance">`**

Find the existing `<section class="reveal py-16 sm:py-20 lg:py-24" id="compliance">` block. Replace with:

```svelte
<SectionDark variant="compliance" id="compliance">
  <!-- existing inner content, but with text colors flipped -->
</SectionDark>
```

Add import at top: `import SectionDark from '$lib/components/cal/SectionDark.svelte';`

(Note: `<SectionDark>` doesn't currently accept `id` — extend it to accept `id?: string` if needed. Add to its `$props()`.)

- [ ] **Step 2: Update inner text colors for navy bg**

All inner text needs to flip from cream-bg colors to navy-bg colors:
- `text-foreground` → `text-on-navy`
- `text-muted-foreground` → `text-on-navy-soft`
- `text-primary` (eyebrow) → `text-on-navy-mustard`
- `border-border` → `border-on-navy-soft/30`
- `border-primary` → `border-on-navy-mustard`

The countdown digit panels (`<div class="group relative rounded-lg border border-border bg-card p-5 text-center transition-colors hover:border-foreground sm:p-8">`) become:

```svelte
<div class="group relative rounded-lg border border-on-navy-soft/30 bg-section-navy/40 p-5 text-center transition-colors hover:border-on-navy-mustard sm:p-8">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-on-navy-mustard"></div>
  <span class="font-heading block text-6xl font-medium tabular-nums leading-none tracking-[-0.03em] text-on-navy sm:text-8xl">
    {countdownDays}
  </span>
  <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-on-navy-soft sm:text-xs">
    {t('compliance.countdown.days')}
  </span>
</div>
```

The CTA inside section 7 — change from default `<Button>` (which is navy on cream) to a mustard variant. Update:

```svelte
<Button size="xl" href="/demo" class="bg-on-navy-mustard text-ink hover:bg-on-navy-mustard/90">
  {t('hero.cta.primary')}
  <ArrowRight class="size-5" />
</Button>
```

(Mustard fill, navy text — 9.1:1 boundary on navy, 7.1:1 text on mustard. AAA across.)

- [ ] **Step 3: Verify**

```bash
npx svelte-check 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/cal/SectionDark.svelte
git commit -m "feat(editorial): compliance + countdown — full-bleed navy SectionDark

Section 7 wrapped in <SectionDark variant='compliance'>. All inner text
flipped to text-on-navy / text-on-navy-soft / text-on-navy-mustard.
Countdown digits in cream Newsreader on navy bg with mustard 2px rule
above each digit panel. CTA uses mustard fill + navy text (9.1:1
boundary AAA on navy)."
```

### Task P2.14: Refactor how-it-works (section 8) — mustard numerals + sage step-3

**Files:**
- Modify: `src/routes/+page.svelte` — section 8 (currently around lines 752–818)

- [ ] **Step 1: Update per spec §6 row 8**

Find the `<section class="reveal py-16 sm:py-20 lg:py-24" id="how">` block.

1. Eyebrow: `text-primary` → `text-accent-mustard-ink`.

2. Three step numerals (`<span class="font-heading text-4xl font-medium leading-none tracking-tight text-primary" data-numeric>01</span>` etc.):
   - Step 1: `text-primary` → `text-accent-mustard` (large numeral, decorative — OK at 2.2:1 because ≥40px decorative)
   - Step 2: `text-primary` → `text-accent-mustard`
   - Step 3: `text-primary` → `text-accent-sage` (the "arrival" — sage = success per spec)

3. Step 3 sub-eyebrow (`<span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{t('home.how.step3.time')}</span>`) — change to `text-accent-sage-ink`.

4. Dividers `divide-border` → `divide-hairline-warm`.

5. Bottom CTA — uses default `<Button>` (navy fill via repoint) — fine, no change.

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): how-it-works — mustard 01/02 + sage 03 (the arrival)

Step numerals render as large decorative mustard (steps 1+2) with
sage on step 3 — the 'arrival' the spec calls out. Sage marks success
in the section's color thread. Eyebrow + step-3 sub-eyebrow use the
darker -ink variants for AAA body."
```

### Task P2.15: Refactor FAQ section (section 9)

**Files:**
- Modify: `src/routes/+page.svelte` — section 9 (currently around lines 824–879)

- [ ] **Step 1: Update per spec §6 row 9**

Find the `<section class="reveal bg-secondary py-16 sm:py-20 lg:py-24" id="faq">` block.

1. Section bg: `bg-secondary` → `bg-canvas-elevated`.

2. Eyebrow text: `text-primary` → `text-ink` (navy direct — section accent is navy here).

3. Accordion list wrapper:
   - `border border-border bg-card shadow-sm` → `border border-hairline-warm bg-canvas`
   - `divide-y divide-border` → `divide-y divide-hairline-warm`

4. Each FAQ button hover: `hover:bg-muted` → `hover:bg-canvas-elevated`.

5. Plus / Minus icons: `text-muted-foreground` → keep (resolves to ink-soft).

6. Bottom contact link: `text-primary hover:text-primary-pressed` → `text-ink hover:text-ink-soft`.

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): FAQ — navy eyebrow, cream-elevated section, warm hairlines"
```

### Task P2.16: Refactor final CTA (section 10) with `<SectionDark variant="cta">`

**Files:**
- Modify: `src/routes/+page.svelte` — section 10 (currently around lines 890–926)

- [ ] **Step 1: Replace with SectionDark wrapper**

Find the existing `<section class="reveal py-16 sm:py-20 lg:py-24" id="cta" aria-labelledby="final-cta-heading">` block. Replace with:

```svelte
<SectionDark variant="cta" id="cta" aria-labelledby="final-cta-heading">
  <p class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-navy-soft">
    <span class="text-on-navy-mustard">El momento es ahora</span>
    <span aria-hidden="true" class="text-on-navy-soft/40">·</span>
    <span><span data-numeric class="font-bold text-on-navy">{countdownDays}</span> días para Ley 21.719</span>
  </p>
  <h2 id="final-cta-heading" class="mt-5 text-balance text-3xl font-bold tracking-tight text-on-navy sm:text-4xl lg:text-5xl">
    {t('cta.title')}
  </h2>
  <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-navy-soft">
    {t('cta.subtitle')}
  </p>
  <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
    <Button
      size="xl"
      href="/demo"
      class="bg-on-navy-mustard text-ink hover:bg-on-navy-mustard/90"
      onclick={() => trackEvent('hero_cta_clicked', { cta: 'book_demo', location: 'final_cta' })}
    >
      {t('cta.primary')}
      <ArrowRight class="size-5" />
    </Button>
    <Button
      variant="outline"
      size="xl"
      onclick={() => (showPitch = true)}
      class="border-on-navy text-on-navy hover:bg-on-navy hover:text-ink"
    >
      <Play class="size-5" />
      {t('hero.video_short')}
    </Button>
  </div>
</SectionDark>
```

(Remove the inner `bg-surface-card-cal` div wrapper — `<SectionDark>` is the band, no nested card needed.)

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat(editorial): final CTA — full-bleed navy SectionDark, mustard CTA

Mirrors section 7 (compliance) treatment. Mustard fill CTA + cream
outline secondary close into <Footer> (deeper navy #0A1628) for the
page's closing dark passage."
```

### Task P2.17: Run full test:ci + visual smoke + deploy to staging

**Files:** none (verification + deploy)

- [ ] **Step 1: Full test:ci**

```bash
npm run test:ci 2>&1 | tail -20
```
Expected: exits 0. If e2e visual snapshots fail (likely, since the homepage looks completely different now), regenerate them — note this as P2 follow-up.

- [ ] **Step 2: Hover smoke test**

Start dev server (`npm run dev -- --port 5177`), visit `http://localhost:5177/`, hover EVERY interactive element, and verify each shows ≥ 2 property changes per anti-pattern memory #5:
- Hero CTAs, secondary CTA, video CTA
- Carousel dots
- Trust strip facts (no hover state expected — confirm visually)
- Problem cards (left-rule grow + bg deepen + translate-y)
- Features cards (same)
- FAQ items (bg + icon)
- Final CTA buttons

If any hover is invisible or single-vector, fix it before continuing.

- [ ] **Step 3: AAA contrast check on the rendered page**

Open DevTools → Lighthouse → run accessibility audit. Score should be 100. Any contrast failures need to be hand-fixed and re-verified.

- [ ] **Step 4: Mobile render check at 320px**

In DevTools, toggle device toolbar → set width to 320px. Verify:
- No horizontal scroll
- h1 doesn't wrap mid-word with broken letterspacing
- Hero CTAs are full-width and tappable (≥44px)
- Cards collapse cleanly to single column

- [ ] **Step 5: Push branch and deploy**

```bash
git push origin redesign/stripe-press
```

For staging deploy, the user controls this — flag to user:

> "P2 complete on `redesign/stripe-press`. Run `npm run build && firebase deploy --only hosting` to ship to ethoz.cl staging URL for review. Or stay on local dev for the visual review pass."

Per the spec, P2 is the **validation gate** — Ignacio reviews the homepage in browser. The next step is Ignacio's approval, not P3 work.

- [ ] **Step 6: Document P2 completion**

Append to `docs/superpowers/specs/2026-05-02-stripe-press-redesign-design.md` a new section after §13:

```markdown
---

## 14. P2 completion note

P2 shipped on `redesign/stripe-press` at SHA <fill in>. Homepage validation gate
reached. Ignacio reviewing homepage in browser before P3 (audience + features
wave) plan is written.

Open follow-ups from P2:
- e2e visual snapshots regenerated (homepage layout changed materially)
- (any hover/contrast hand-fixes from P2.17 smoke pass)
- Pull-quote spread (section 5) deferred per spec §10.1 — defer to content pass
```

Commit this note:

```bash
git add docs/superpowers/specs/2026-05-02-stripe-press-redesign-design.md
git commit -m "docs(redesign): mark P2 complete, log validation gate"
```

---

## Self-review

I (the plan author) reviewed this against the source spec section by section.

**1. Spec coverage — every spec section mapped to tasks:**

| Spec section | Tasks covering it |
|---|---|
| §1 Context, §2 Brainstorm decisions, §3 Goals, §10 Open questions, §11 Verification, §12 References | Inherited / informational (no implementation step) |
| §4.1 Palette tokens | P1.3 (root tokens), P1.4 (Tailwind exposure), P1.7 (radii), P1.8 (shadows), P1.9 (semantic), P2.7 (--surface-dark + --on-dark repoint) |
| §4.2 Tailwind wiring | P1.4 |
| §4.3 Typography | P1.1 (deps), P1.2 (imports), P1.5 (font-heading + heading sizes), P1.6 (preload) |
| §4.4 Radii | P1.7 |
| §4.5 Shadows | P1.8 |
| §4.6 Section spacing | P1.10 |
| §5.1 FeatureCardCal accent | P2.2 |
| §5.2 HeroAppMockupCard | P2.3 |
| §5.3 NavPillGroup | P2.4 |
| §5.4 PastelBadge | P2.5 |
| §5.5 ProductMockupCard | P2.6 |
| §5.6 SectionDark | P2.1 |
| §5.7 Component contract | covered implicitly — each P2 task uses Svelte 5 runes, tokens-only, AAA contrast |
| §6 Section choreography | P2.8–P2.16 (one task per homepage section) |
| §7 Lint scripts (warn mode for P1/P2) | P1.11, P1.12 |
| §7 ESLint additions | **deferred to P6 plan** — explicitly out of scope per "Out of scope" header |
| §7 lint-accent-body-text.sh | **deferred to P6 plan** |
| §8 P0 | P0.1–P0.4 |
| §8 P1 | P1.1–P1.15 |
| §8 P2 | P2.1–P2.17 |
| §8 P3–P6 | **deferred — separate plans after P2 validates** |
| §9 Risks | mitigations baked into task choices (warn-mode lint, validation gate at P2.17) |
| §13 Self-review changelog | informational only — corrections already applied to spec |

No gaps for P0–P2 scope. P3–P6 are explicit non-goals of this plan.

**2. Placeholder scan:** searched the plan for "TBD", "TODO", "implement later", "fill in details", "Add appropriate error handling". Found one "fill in" in P2.17 step 6 (`SHA <fill in>`) — that's intentional (the SHA is unknown until P2 ships). Acceptable.

**3. Type consistency:**
- `accent` prop type `'mustard' | 'brick' | 'sage' | 'navy' | 'none'` consistent across P2.2 and P2.5 (PastelBadge variant uses same names minus 'none').
- `<SectionDark>` `variant: 'compliance' | 'cta'` consistent in P2.1, P2.13, P2.16.
- Token names (`--canvas`, `--ink`, `--accent-mustard`, etc.) consistent across all P1 tasks and P2 callsites.
- `bg-on-navy-mustard` / `text-on-navy` utility names consistent across P2.13 and P2.16.

No type/name drift detected.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-stripe-press-redesign-p0-p2.md`.**
