---
version: 2.0
name: Ethoz Launch UI v2 (dark-first)
description: Launch UI v2 dark-first design system. Near-black canvas (#0A0A0A) + elevated charcoal cards (#171717) with a single amber accent (#F97316). Inter Variable for all typography. Dark-only mode; mode-watcher and theme toggle removed. Subtle borders, dark shadows, light-gradient primary CTA. Full spec: .impeccable.md; live tokens: src/app.css.

colors:
  background: "#0A0A0A"        # near-black page canvas (the floor)
  foreground: "#FAFAFA"        # primary text, headings, icons
  primary: "#F97316"           # amber accent — TEXT, links, eyebrows, icons
  primary-hover: "#FB923C"
  primary-active: "#EA580C"    # active/pressed; also on primary tints for contrast
  primary-foreground: "#FAFAFA" # text on primary background
  cta-gradient-from: "#FFFFFF"  # light gradient CTA start
  cta-gradient-to: "#E4E4E7"    # light gradient CTA end
  cta-text: "#09090B"           # dark text on light gradient CTA
  card: "#171717"               # elevated card surface
  surface-card-hover: "#1F1F1F" # card hover lift
  surface-elevated: "#141414"   # slightly raised panels
  secondary: "#27272A"          # secondary backgrounds
  muted: "#27272A"              # muted backgrounds
  muted-foreground: "#A1A1AA"   # secondary text
  text-tertiary: "#71717A"      # tertiary/faint metadata
  border: "#27272A"             # default borders
  surface-border-strong: "#3F3F46" # stronger borders
  ring: "#F97316"               # focus ring
  destructive: "#EF4444"        # safety red
  warning: "#F59E0B"            # amber warning (pair with dark foreground)
  success: "#22C55E"            # success green
  amber-glow: "rgba(249,115,22,0.12)"  # subtle amber glow
  amber-glow-strong: "rgba(249,115,22,0.35)" # stronger hero glow

typography:
  display:
    fontFamily: "Inter Variable, Inter, sans-serif"   # --font-heading; all h1/h2/h3 + .font-heading
    weights: "500"
    letterSpacing: "-0.02em (XL/LG), -0.01em (MD/SM)"  # --tracking-display-*
    lineHeight: "1.05-1.20 progressing by size"
    textWrap: balance
  body:
    fontFamily: "Inter Variable, Inter, sans-serif"   # --font-sans; body, buttons, nav, captions
    weight: 400
    lineHeight: 1.6
    textWrap: pretty
  mono:
    fontFamily: "Inter Variable, Inter, sans-serif"   # mono-caps eyebrows reuse Inter for consistency
    uses: "mono-caps eyebrows (font-mono is stylistic, still Inter)"
  eyebrow:
    pattern: "font-mono font-semibold uppercase tracking-[0.1em] text-primary"  # lint-enforced
  banned: "DM Sans, JetBrains Mono, Cal Sans, Playfair Display, Newsreader (lint-stale-fonts.sh)"

radii:
  xs: "4px    # badges, tight pills"
  sm: "6px    # chips, small markers"
  lg: "10px   # inputs (input base = rounded-lg)"
  md: "12px   # buttons, nav pills, selects (button base = rounded-md)"
  xl: "16px   # cards (the card radius)"
  2xl: "20px  # hero mockup card only"
  pill: "chips and small pill markers"

shadows:
  allowed: "shadow-card-dark, shadow-card-dark-hover, shadow-mockup, shadow-popover, shadow-glow-amber (hero only)"
  banned: "shadow-xl/2xl; no warm 8020 shadows"

layout:
  container: "max-w-7xl (80rem); NavBar/content/footer share the same grid"
  sectionPadding: "section-editorial utility clamp(64px, 8vw, 96px); first section after NavBar pt-24 sm:pt-28"
  gridGaps: "gap-6 card grids, gap-8 step layouts"
  mobileFirst: "design at 375px; md:/lg: up"
  textures: "none; 8020 grid/dot textures retired"

components:
  cardPattern: "rounded-xl border border-foreground/10 bg-card shadow-card-dark"
  iconTitle: "icons + titles ALWAYS inline (same row), never stacked; no icon-in-colored-box wrappers (lint)"
  primaryCta: "bg-gradient-to-b from-cta-gradient-from to-cta-gradient-to text-cta-text"
