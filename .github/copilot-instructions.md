> **Canonical design source:** `.impeccable.md` (root) + the `### Design` section of `CLAUDE.md` (root) are the SINGLE SOURCE OF TRUTH for the design system. This file is a short summary that MUST NOT diverge from them — if anything here conflicts with those files, they win. Do not expand this summary into a full spec (that creates drift); read the canonical files for detail.

## Design Context

Ethoz (ethoz.cl) is a school protection platform for Chilean K-12 schools. The site migrated (2026-05-01) to a **Cal.com modern-SaaS aesthetic** — away from the earlier McKinsey/medical-blue, Apple-minimalism look. Any older guidance describing "System blue", `oklch(...)` primaries, Inter `font-bold` headlines, "Apple-inspired minimalism", or "no dark sections" is **obsolete** and must not be followed.

For anything not covered below — colors, tokens, typography scale, spacing, components, accessibility — defer to `.impeccable.md` and the `### Design` section of `CLAUDE.md`.

### Users
School directors, *sostenedores* (school network administrators), and decision-makers at Chilean schools with 500+ students, evaluating Ethoz as a compliance and student-safety solution. Conservative buyers — trust and institutional credibility matter more than flash. Their job on the page: understand the product, feel trust, schedule a demo.

### Brand personality
**Simple. Secure. Professional.** Ethoz should feel like a competent institution — serious about data protection, approachable enough for a first-year teacher, unmistakable when safety is at stake. Tone is non-technical: a school director should understand everything without Googling a term.

### Cal.com aesthetic — short summary (canonical detail in `.impeccable.md`)

- **Single action color: Cal black `#111111`** (`--primary`). It drives ALL primary interactive elements (CTAs, links, headline ink). Reserve it — don't spray. The `--brand-accent` blue (`#3B82F6`) is defined but RESERVED and is **never** used on CTAs. Do not reintroduce blue/`oklch` primaries.
- **Typography:** **Cal Sans** display font for h1/h2/h3 via the `--font-heading` token + `font-heading` class (weight 600). **Inter** for body, buttons, nav, captions. **JetBrains Mono** for `[data-numeric]` only. Headlines are Cal Sans — not Inter `font-bold`.
- **Surfaces:** white canvas `#FFFFFF` (`--background`) + light-gray feature cards `#F5F5F5` (`bg-surface-card-cal`). Cards: `rounded-xl border border-hairline`, icon + title ALWAYS inline (never stacked), no icon-in-colored-box wrappers.
- **Two INTENTIONAL dark surfaces — NOT defects, do not delete:** a **dark closing-CTA band** + the **dark footer** (`#101010`, `bg-surface-dark`), stacked at the very END of each page. These are deliberate and ship in production. The ban is only on *mid-page / above-the-fold* dark sections — never remove the closing-CTA band or footer thinking they violate "light mode".
- **Light mode body**, flat-by-design: no gradients, no glow effects (except the retained `shadow-glow-destructive` safety signature), no soft pastel CTAs. Pastel badges are metadata-only, never on CTAs.
- **AAA contrast:** target 7:1 normal text / 4.5:1 large text. Cal black on white = 17:1 (effortless AAA).
- **Tokens only — NEVER hardcode colors.** Use `bg-primary`, `text-muted-foreground`, `text-on-dark`, `bg-surface-dark`, etc. Use `// lint-ok` only for legitimate exceptions (SDK config, raw HTML strings).

### Content principles
- **Spanish chileno profesional**, non-technical. Write for a school director, not a developer.
- All UI text via the `t()` i18n function — NEVER hardcode strings in templates.
- URLs in English (`/features/safe-pickups`), content in ES/EN.
- Ethoz **complements** existing systems (Napsis, Syscol, Lirmi) — never say "replaces".

### Accessibility
WCAG AAA target. Respect `prefers-reduced-motion`. Never use color alone (icons + text + color). All interactive elements keyboard-focusable with a visible focus ring. Touch targets ≥ 44×44px.

---

**When in doubt, read `.impeccable.md` and `CLAUDE.md` (`### Design`). They are authoritative; this file is a pointer.**
