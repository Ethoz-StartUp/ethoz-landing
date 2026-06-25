# Ethoz — Project Context

## What is this
Ethoz (ethoz.cl) is a school protection platform for Chilean K-12 schools. SvelteKit 2 + Svelte 5 (runes), Tailwind CSS v4, Supabase (Auth + DB + Edge Functions), Firebase Hosting + Cloudflare DNS.

**Not a school management system** — complements existing ERPs (Napsis, Syscol, Lirmi) by adding security, compliance, and student data protection.

> **Design system: 8020 (sky-blue vertical).** `main` runs the 8020IQ Brand Guide v1.1 system: cream `#FAF8F5` + charcoal `#18181B` spine, sky-blue accent (`--primary #0B72C4` accessible / `--accent-bright #0495FE` swatch), DM Sans display + Inter body + JetBrains Mono data, mono-caps eyebrows, 16/12/10/pill radii, soft warm shadows. Full spec: `.impeccable.md`. Tokens: `src/app.css`. (Prior Cal.com + Stripe Press aesthetics are retired.)

## Architecture

```
src/routes/           — SvelteKit pages (landing + admin)
src/routes/admin/     — Admin panel (auth-gated): leads CRM, prospecting, content manager
src/lib/components/   — Shared UI (NavBar, Footer, shadcn-svelte)
src/lib/data/posts/   — Blog posts as TypeScript modules (auto-discovered via glob)
src/lib/content/      — Content strategy + pitch slides
src/lib/i18n/         — i18n (es/en) via t() function
scripts/              — Content pipeline (generate, publish, images, video)
supabase/functions/   — Edge Functions (social-publish, new-lead-notify, etc.)
static/data/          — schools.json (processed from Mineduc CSVs)
docs/                 — Documentation index (5 sections + knowledge base + content bank)
```

## Critical Rules

### Code
- Dev server: `npm run dev -- --port 5177` (ALWAYS port 5177)
- Build: `npm run build`
- Deploy: `npm run build && firebase deploy --only hosting` (deploys BOTH sites: ethoz.web.app + ethoz.cl)
- **NEVER** use `firebase deploy --only hosting:ethoz` alone — ethoz.cl is served by `gestion-estudiantil-dev`, NOT `ethoz`
- After deploy, verify: `curl -sI "https://ethoz.cl/" | grep cache-control` → must show `max-age=0`
- All text via `t()` i18n function — NEVER hardcode strings in templates
- URLs in English (`/features/safe-pickups`), content in ES/EN
- Svelte 5 runes API (`$state`, `$derived`, `$effect`) — no legacy reactive syntax
- Blog posts: export `BlogPost` from `src/lib/data/posts/*.ts` — auto-discovered, no manual registration

### Design (see .impeccable.md for full spec)
- Light mode first (charcoal dark used for footer + impact bands). **8020 aesthetic** (2026-06 migration from Cal.com): cream canvas `#FAF8F5` + warm-white cards `#F5F3EF` + charcoal `#18181B` + sky-blue accent.
- **Sky-blue accent policy:** `--primary #0B72C4` is the accessible sky for TEXT, links, eyebrows, and primary buttons (white label 4.98:1 AA). The bright swatch `--accent-bright`/`--brand-accent #0495FE` is for NON-text only (fills, large display numerals, icons, the logo). On primary tints (`bg-primary/5..20`) use `text-primary-active`/`text-primary-pressed`, never bare `text-primary` (lint-tint-contrast.sh enforces).
- **DM Sans** (`@fontsource-variable/dm-sans`) for h1/h2/h3 + `font-heading` class (display weights 700/800). **Inter** for body, buttons, nav, captions. **JetBrains Mono** for `[data-numeric]` and mono-caps eyebrows.
- **Eyebrows** are mono-caps: `font-mono font-semibold uppercase tracking-[0.1em]` in sky (lint-eyebrow-tracking.sh enforces).
- NEVER hardcode colors — use design tokens (`bg-primary`, `bg-card`, `text-muted-foreground`, `text-on-dark`, `text-accent-bright`, etc.). Use `// lint-ok` for legitimate exceptions (third-party SDK config, raw HTML strings).
- **NO em-dashes or en-dashes in copy** (8020 rule). Use commas, periods, or `a`/`to` for ranges. The `·` middot is the inline label separator.
- Icons + titles ALWAYS inline (same row), never stacked. No icon-in-colored-box wrappers (`scripts/lint-icon-box-wrapper.sh` enforces).
- Card pattern: `rounded-xl border border-hairline bg-card` (8020 §10 radii: `rounded-md`=12 buttons, `rounded-lg`=10 inputs, `rounded-xl`=16 cards, `rounded-2xl`=20 hero mockup).
- Flat on purpose. Soft warm shadows only (`shadow-card`, `shadow-card-hover`, `shadow-mockup`, `shadow-popover` — 8020 §10). `shadow-glow-primary` neutralized. `shadow-glow-destructive` retained (safety-critical). Textures: `bg-grid-fine` / `bg-dots-fine` (32px, under hero/sections only).
- One primary action per screen. Sky is the action color, treat it as a precision cut, not a wash. Pastel badges (`bg-badge-orange/pink/violet/emerald`) are metadata-only, NEVER on CTAs (`scripts/lint-pastel-on-cta.sh` enforces).
- Footer + dark CTA bands are the dark surfaces (`bg-surface-dark` = `#18181B`). Light text via `text-on-dark` / `text-on-dark-soft`. Accent on dark uses the lighter sky `#38A8FF`.
- Contrast targets: AAA 7:1 normal / AA 4.5:1 where the brand accent requires it. Body `#1C1C1E` on cream = 16:1 (AAA). Logo: evolved interseccion/shield (two overlapping rounded layers, charcoal + sky) + DM Sans wordmark with accent `z`.
- 8020 tone: confidently engineered, operator-grade, generous whitespace, fact-forward, single primary action per band.

### Content
- Spanish chileno profesional (no slang, no extreme modismos)
- No markdown in social posts (no **, *, #, backticks)
- Max 2-3 emojis per post, ZERO on LinkedIn
- Ethoz COMPLEMENTS existing systems — never say "replaces"
- Knowledge base: `docs/5-knowledge-base/` (stats, competitors, laws, trends, messaging)
- Content bank: `docs/content-bank/` (posts, scripts, calendar)

### Brand context
- Company: ETHOZ SpA | RUT: 78.394.522-3 | Founded: 2026
- Tagline: "Proteccion escolar inteligente"
- Key urgency: Ley 21.719 (data protection) enters full enforcement December 2026
- Fines: up to 20,000 UTM (~$1,300M CLP) or 4% annual revenue
- TAM: 12,038 schools, 5,777 sostenedores. Tier 1: 402 multi-school operators

### APIs and Keys
All in `.env.local` (never commit): Supabase (anon + service_role), Kimi, Gemini, reCAPTCHA, Cal.com, Sentry, Cloudflare, Clarity.
Content pipeline: Kimi CLI (text) → Gemini (images) → Supabase Edge Functions (publish)

### Security (hardened 2026-04)
- **NEVER** add `PUBLIC_*` env vars for secrets — they ship to the client bundle
- **NEVER** hardcode emails, IPs, or PII in client-side code — it lands in the JS bundle
- **NEVER** pass OAuth `client_secret` in URL query params — always POST body
- **NEVER** log raw emails/phones/PII — use `maskEmail()` from `$lib/supabase`
- **NEVER** pass PII in URL query params — use `sessionStorage` for cross-page data
- **RLS is mandatory** on all Supabase tables. New tables must have admin-only policies (`auth.uid() = '<admin-uuid>'`), not `auth.role() = 'authenticated'`
- **Lead writes** must go through the `verify-lead` Edge Function (server-side reCAPTCHA). The `leads` table has **no anon insert policy** — direct inserts will fail
- **Edge Functions that receive webhooks** must verify signatures mandatorily (no `if (secret)` guards)
- **OAuth flows** must validate the `state` parameter with a timestamp check (see `social-auth-linkedin` pattern)
- **Edge Functions error responses** must not leak internal errors — log with `console.error`, return generic messages
- **Open Supabase registration is disabled** — do not re-enable. Admin users are created manually in the dashboard
- Run `npm run audit:security` before committing UI changes to check for regressions
- Run `npm run lint` to check ESLint rules (Svelte 5 syntax, design tokens, security patterns)
- `npm run test:ci` runs everything: lint + svelte-check + audit + unit + e2e

### UI components (shadcn-svelte + Cal primitives)
- Admin panel uses shadcn-svelte components from `$lib/components/ui/`
- Available: `Table`, `DropdownMenu`, `Sheet`, `Dialog`, `Select`, `Input`, `Label`, `Badge`, `Button`, `Skeleton`, `Tabs`, `Tooltip`, `Sonner` (via `svelte-sonner`)
- **Prefer shadcn components** over raw HTML. Don't reinvent tables, dropdowns, dialogs
- **Use `toast` from `svelte-sonner`** for feedback — never `alert()` or silent failures
- **Use `Skeleton`** for loading states — not just spinners
- **Use `Dialog`** for destructive confirmations — never `confirm()`
- Add new shadcn components via `npx shadcn-svelte add <name> --overwrite`

**Cal-flavored primitives** in `$lib/components/cal/`:
- `FeatureCardCal` — light-gray feature card (gray surface variant) or white-with-hairline variant. Icon + title inline. Optional CTA with persistent arrow.
- `HeroAppMockupCard` — hero right-side artifact wrapper for product UI fragments. Uses `shadow-mockup` + `rounded-2xl`.
- `ProductMockupCard` — generic product UI fragment wrapper for embedding in any marketing card.
- `NavPillGroup` — Cal pill-in-pill sub-nav with active segment having drop shadow inside the pill wrapper.
- `PastelBadge` — metadata badge with pastel variants (orange/pink/violet/emerald). Lint blocks pastel use on CTAs.

### Lint scripts (run via `npm run lint`)
13 design-system bash lints in `scripts/lint-*.sh`, orchestrated by `lint-all.sh`. They block: narrow outer containers, `shadow-xl/2xl`, neutralized glow shadows, `hover:opacity-N<100`, `hover:bg-muted/N<40`, hardcoded hex (with `// lint-ok` escape for SDK config), pastel-on-CTA, retired display fonts (`lint-stale-fonts.sh` bans Newsreader/Cal Sans/Playfair), icon-in-colored-box wrapper, arbitrary text-px, eyebrow tracking (mono-caps `tracking-[0.1em]`), section-bg token, and bare `text-primary` on primary tints (`lint-tint-contrast.sh`). All wired into `npm run test:ci`.

## Documentation Map
- `docs/1-landing/` — All public pages documented
- `docs/2-admin/` — Admin panel, auth, CRM, Edge Functions
- `docs/3-prospecting/` — Mineduc CSVs, scoring, outbound pipeline
- `docs/4-content-generation/` — 12 scripts, strategy.ts, publish flow
- `docs/5-knowledge-base/` — 10 files: stats, competitors, laws, trends, positioning, audiences, stories, quotes
- `docs/content-bank/` — 70+ social posts, 5 YT scripts, 30-day calendar
- `.impeccable.md` — Full design system spec (colors, typography, spacing, components, accessibility)

---

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
