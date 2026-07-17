> **Canonical design source:** `.impeccable.md` (root) + the `### Design` section of `CLAUDE.md` (root) are the SINGLE SOURCE OF TRUTH for the design system. This file is a short summary that MUST NOT diverge from them — if anything here conflicts with those files, they win. Do not expand this summary into a full spec (that creates drift); read the canonical files for detail.

## Design Context

Ethoz (ethoz.cl) is a school protection platform for Chilean K-12 schools. The site runs the **Launch UI v2 dark-first design system** — near-black canvas `#0A0A0A`, elevated charcoal cards `#171717`, amber accent `#F97316`, light-gradient primary CTA. Prior 8020 cream/sky-blue, Cal.com, Stripe Press, medical-blue, and Apple-minimalism aesthetics are retired. Dark mode is the only mode.

For anything not covered below — colors, tokens, typography scale, spacing, components, accessibility — defer to `.impeccable.md` and the `### Design` section of `CLAUDE.md`.

### Users
School directors, *sostenedores* (school network administrators), and decision-makers at Chilean schools with 500+ students, evaluating Ethoz as a compliance and student-safety solution. Conservative buyers — trust and institutional credibility matter more than flash. Their job on the page: understand the product, feel trust, schedule a demo.

### Brand personality
**Simple. Secure. Professional.** Ethoz should feel like a competent institution — serious about data protection, approachable enough for a first-year teacher, unmistakable when safety is at stake. Tone is non-technical: a school director should understand everything without Googling a term.

### Launch UI v2 aesthetic — short summary (canonical detail in `.impeccable.md`)

- **Single action color: amber `#F97316`** (`--primary`). It drives ALL primary interactive elements (links, eyebrows, icons). Primary CTA buttons use the **light gradient** (`bg-gradient-to-b from-cta-gradient-from to-cta-gradient-to text-cta-text`) with dark text. Reserve amber — don't spray.
- **Typography:** **Inter Variable** for ALL typography — h1/h2/h3 via `--font-heading` / `font-heading` (weight 500), body/UI via `--font-sans`. DM Sans, JetBrains Mono, Cal Sans, Playfair, and Newsreader have been removed.
- **Surfaces:** near-black canvas `#0A0A0A` (`--background`) + elevated charcoal cards `#171717` (`bg-card` / `bg-surface-card`). Cards: `rounded-xl border border-foreground/10 bg-card shadow-card-dark`, icon + title ALWAYS inline (never stacked), no icon-in-colored-box wrappers.
- **Dark-only body**, flat-by-design: no light sections, no cream, no warm-white cards. Subtle amber glow is reserved for the hero mockup only. Pastel badges are metadata-only, never on CTAs.
- **Contrast:** target AA minimum, AAA where feasible. Body `#FAFAFA` on `#0A0A0A` exceeds AAA. On primary tints (`bg-primary/5..20`) use `text-primary-active`, never bare `text-primary`.
- **Tokens only — NEVER hardcode colors.** Use `bg-primary`, `text-muted-foreground`, `text-text-tertiary`, `bg-card`, `border-border`, etc. Use `// lint-ok` only for legitimate exceptions (SDK config, raw HTML strings).

### Content principles
- **Spanish chileno profesional**, non-technical. Write for a school director, not a developer.
- All UI text via the `t()` i18n function — NEVER hardcode strings in templates.
- Canonical public URLs are in Spanish (`/funcionalidades/retiros-seguros`, `/como-contratar`, `/agendar`). English legacy slugs redirect to the Spanish URLs with 301s.
- Ethoz **complements** existing systems (Napsis, Syscol, Lirmi) — never say "replaces".

### Accessibility
WCAG AA minimum, AAA where feasible. Respect `prefers-reduced-motion`. Never use color alone (icons + text + color). All interactive elements keyboard-focusable with a visible amber focus ring. Touch targets ≥ 44×44px.

---

**When in doubt, read `.impeccable.md` and `CLAUDE.md` (`### Design`). They are authoritative; this file is a pointer.**
