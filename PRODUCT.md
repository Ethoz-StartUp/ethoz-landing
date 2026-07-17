# Product

## Register

brand

## Users

School directors, *sostenedores* (school-network administrators), and decision-makers at Chilean K-12 institutions with 500+ students, evaluating Ethoz as a compliance and student-safety platform. They browse on desktop during office hours, occasionally on mobile. Their job on the site: understand the product, feel trust, and schedule a demo. Conservative buyers — institutional credibility matters more than flash. Content is Spanish chileno profesional (bilingual es/en via i18n; no slang, no technical jargon outside /compliance).

## Product Purpose

Ethoz (ethoz.cl) is a school-protection platform: security, compliance, and student-data protection for Chilean schools. It **complements** existing school ERPs (Napsis, Syscol, Lirmi) — it never replaces them, and copy must never claim otherwise. The commercial engine is urgency around Ley 21.719 (data-protection law, full enforcement December 2026, fines up to 20,000 UTM). Success = qualified demo requests from sostenedores and directors (TAM: 12,038 schools, 5,777 sostenedores; Tier 1 = 402 multi-school operators).

## Brand Personality

**Simple. Secure. Professional.**

Confidently engineered, operator-grade, fact-forward. Non-technical tone: a school director understands everything without Googling a term. Emotional goals — primary: "trustworthy, and they get me" (built by people who understand running a school in Chile); secondary: urgency (the compliance deadline is real); tertiary: relief (finally someone handles the complexity).

## Anti-references

- **Generic AI slop** — the #1 enemy. No cookie-cutter layouts, stock photography, identical card grids repeated 4+ times, template-with-logo-swapped feel.
- Light sections or cream canvas. The entire site is dark (`#0A0A0A`); no cream, no warm-white cards, no mid-page light bands.
- Technical jargon in user-facing copy ("pgcrypto", "RLS" — /cumplimiento and /seguridad-datos only).
- Data-dense dashboard feel (no Grafana vibes), cartoon edtech illustrations, heavy gradients and glows (subtle amber glow reserved for the hero mockup only).
- Em/en-dashes in copy (Launch UI rule): commas, periods, or `a`/`to` ranges; `·` middot is the inline label separator.

## Design Principles

1. **Trust is the product.** Every band must read as institutional competence; nothing gimmicky, nothing broken.
2. **One primary action per screen.** Amber is a precision cut, not a wash.
3. **Fact-forward.** Real numbers (schools, fines, deadlines) beat adjectives.
4. **Complement, never replace.** Positioning against ERPs is additive; copy that implies replacement is a defect.
5. **Accessibility as foundation.** AAA 7:1 targets for body text; AA 4.5:1 minimum where the brand accent requires it; bilingual-first via `t()`.

## Accessibility & Inclusion

WCAG AA minimum, AAA where feasible (foreground `#FAFAFA` on `#0A0A0A` exceeds AAA). Reduced-motion alternatives required for all animation. 44px minimum touch targets on mobile. All text through the `t()` i18n function (es/en). Enforced by design lint scripts + `npm run audit:security`.

## Design system source of truth

The full visual spec (tokens, typography, radii, shadows, component patterns, lint rules) lives in `.impeccable.md` and `src/app.css`. DESIGN.md is the condensed machine-readable summary.
