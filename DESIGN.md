---
version: 1.0
name: Ethoz 8020 (sky-blue vertical)
description: 8020IQ Brand Guide v1.1 system. Cream canvas (#FAF8F5) + charcoal ink (#18181B) spine with a single sky-blue accent. DM Sans display (700/800) + Inter body + JetBrains Mono for numerals and mono-caps eyebrows. Warm-white cards with soft warm shadows, 16/12/10/pill radii, generous whitespace, one primary action per band. The deliberate dark surfaces are the closing-CTA band + charcoal footer stacked at page end; no other dark sections. Flat on purpose — no gradients, no glows (destructive safety glow is the only exception). Full spec: .impeccable.md; live tokens: src/app.css.

colors:
  background: "#FAF8F5"        # cream canvas (page floor; never pure white on cream)
  foreground: "#1C1C1E"        # charcoal ink, AAA 16:1 on cream
  primary: "#0B72C4"           # accessible sky — TEXT, links, eyebrows, primary buttons (white label 4.98:1 AA)
  primary-active: "#095C9E"
  primary-pressed: "#074B82"
  primary-disabled: "#CFE4F4"
  brand-accent: "#0495FE"      # bright sky swatch — NON-text only: fills, icons, large display numerals, logo
  accent-tint: "rgba(4,149,254,0.10)"
  card: "#F5F3EF"              # warm-white feature card
  surface-soft: "#F5F3EF"
  surface-strong: "#DDD7CE"
  surface-dark: "#18181B"      # charcoal footer + closing-CTA band (the only dark surfaces)
  surface-dark-elevated: "#2C2C2E"
  body: "#1C1C1E"
  muted-text: "#636366"        # secondary text (AA on cream)
  muted-soft: "#8E8E93"        # tertiary/faint metadata
  on-primary: "#FFFFFF"
  on-dark: "#FAF8F5"
  on-dark-soft: "rgba(255,255,255,0.62)"
  hairline: "#E8E4DE"
  hairline-soft: "#EFEBE4"
  ring: "#0B72C4"
  destructive: "#EF4444"       # safety red; retains glow signature (safety-critical only)
  warning: "#F59E0B"           # pair with charcoal ink fg (white on amber fails AAA)
  success: "#10B981"
  badge-orange: "#FB923C"      # pastel badges: metadata only, NEVER on CTAs (lint-enforced)
  badge-pink: "#EC4899"
  badge-violet: "#8B5CF6"
  badge-emerald: "#34D399"
  accent-on-dark: "#38A8FF"    # sky lifts on charcoal (dark bands, footer links)

typography:
  display:
    fontFamily: "DM Sans Variable, Inter Variable, Inter, sans-serif"   # --font-heading; all h1/h2/h3 + .font-heading
    weights: "800 (h1), 700 (h2/h3/h4)"
    letterSpacing: "-0.0313em (XL/LG), -0.0278em (MD), -0.0179em (SM)"  # --tracking-display-*
    lineHeight: "1.05-1.20 progressing by size"
    textWrap: balance
  body:
    fontFamily: "Inter Variable, Inter, sans-serif"                     # --font-sans; body, buttons, nav, captions
    weight: 400
    lineHeight: 1.55
    textWrap: pretty
  mono:
    fontFamily: "JetBrains Mono Variable, monospace"                    # --font-mono
    uses: "[data-numeric] tabular numerals + mono-caps eyebrows"
  eyebrow:
    pattern: "font-mono font-semibold uppercase tracking-[0.1em] text-primary"  # lint-enforced; 8020 signature marker
  banned: "Cal Sans, Playfair Display, Newsreader (lint-stale-fonts.sh)"

radii:
  xs: "4px    # badges, tight pills"
  sm: "6px    # chips, small markers"
  lg: "10px   # inputs (input base = rounded-lg)"
  md: "12px   # buttons, nav pills, selects (button base = rounded-md)"
  xl: "16px   # cards (the card radius)"
  2xl: "20px  # hero mockup card only"
  pill: "chips and small pill markers"

shadows:
  allowed: "shadow-card, shadow-card-hover, shadow-mockup, shadow-popover (soft warm, 8020 §10)"
  banned: "shadow-xl/2xl, shadow-glow-primary (neutralized); shadow-glow-destructive retained (safety-critical)"

layout:
  container: "max-w-7xl (80rem); NavBar/content/footer share the same grid"
  sectionPadding: "py-16 sm:py-20; first section after NavBar pt-28 sm:pt-32"
  gridGaps: "gap-6 card grids, gap-8 step layouts"
  mobileFirst: "design at 375px; md:/lg: up"
  textures: "bg-grid-fine / bg-dots-fine (32px) under hero/sections only"

components:
  cardPattern: "rounded-xl border border-hairline bg-card"
  iconTitle: "icons + titles ALWAYS inline (same row), never stacked; no icon-in-colored-box wrappers (lint)"
  calPrimitives: "FeatureCardCal, HeroAppMockupCard, ProductMockupCard, NavPillGroup, PastelBadge ($lib/components/cal/)"
  shadcn: "Table, DropdownMenu, Sheet, Dialog, Select, Input, Label, Badge, Button, Skeleton, Tabs, Tooltip, Sonner (admin)"
  darkBands: "closing-CTA band + footer on bg-surface-dark; text via text-on-dark / text-on-dark-soft; accent #38A8FF"

rules:
  - Never hardcode colors; design tokens only (// lint-ok escape for SDK config). 13 lint scripts enforce the system.
  - On primary tints (bg-primary/5..20) use text-primary-active/pressed, never bare text-primary (lint-tint-contrast.sh).
  - No em/en-dashes in copy; middot (·) is the inline label separator.
  - One primary action per band; sky is a precision cut, not a wash.
  - All copy via t() i18n (es/en); canonical public URLs use descriptive Spanish kebab-case slugs. Legacy English slugs exist only as direct 301 redirects.
  - Contrast: AAA 7:1 body, AA 4.5:1 minimum where the accent requires it.
  - 44px minimum touch targets on mobile.
---
