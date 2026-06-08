#!/usr/bin/env bash
# lint-hardcoded-color.sh
# Bans hardcoded color literals in .svelte files (markup AND component-scoped
# <style> blocks). Anti-pattern memory #7. Tokens live in app.css; components
# reference them via Tailwind utilities or var(--token) / color-mix().
#
# Coverage:
#   - Hex literals: #rrggbb / #rgb (e.g. #111111, #F5F5F5, #FBF7F0, #0F1F3A).
#   - Non-hex color-function literals: oklch( , rgb( , rgba( , hsl( , hsla( .
#     These slipped past the old hex-only matcher (e.g. /pitch's scoped <style>
#     hardcoded ~69 oklch() literals — 26 at the abandoned medical-blue hue 255 —
#     plus glow shadows — none of which the hex pattern could see).
#
# NOT flagged (these ARE the correct token-based patterns):
#   - var(--token)            — design-token reference
#   - color-mix(...)          — token-based blend / alpha (the sanctioned way to
#                               keep transparency while staying on a token)
#
# Common offenders to catch in current era (Stripe Press migration):
#   - Old Cal palette leaks: #111111, #F5F5F5, #101010, #FFFFFF
#   - New Stripe Press hexes that should reference tokens: #FBF7F0, #0F1F3A,
#     #D4A017, #B23A2C, #4A6B47, #FBF7F0, #0A1628
#   - Legacy medical-blue oklch leaks: oklch(0.36 0.14 255 / ...) etc.
#
# Allowed exceptions:
#   - SVG attributes inside data: URLs (rare) — caught by content matching
#   - Lines annotated with `// lint-ok` (CSS `/* lint-ok */` also works) on the
#     same line or the line above, for legitimate SDK config / raw HTML strings /
#     data-URL SVG / brand colors.
#
# WARN_MODE=1 default during P1/P2 migration; flips to error in P6.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"  # P6 flipped default from 1→0 (strict by default after Stripe Press migration completed)

# 6 or 3 char hex with #, plus non-hex color-function literals.
# color-mix( and var( are intentionally excluded — they are the token-based
# patterns we WANT. The function matchers require an opening paren so the bare
# word inside color-mix(in oklch, ...) is never matched on its own.
PATTERN='#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|oklch\(|rgba?\(|hsla?\('

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -v 'fill="currentColor"' \
  | grep -vE '<title>|svg.+role="img"' \
  | grep -vE '^[^:]+:[0-9]+:\s*<!--' \
  | grep -vE '^[^:]+:[0-9]+:\s*\*' \
  | grep -vE '^[^:]+:[0-9]+:.*:global\(' \
  | grep -vE '^[^:]+:[0-9]+:.*@media print' \
  | grep -vE 'lint-ok' \
  || true)

# Also skip lines whose previous line contains a lint-ok annotation.
# Two-pass: collect all line numbers preceded by a lint-ok comment line, then exclude.
LINT_OK_LINES=$(grep -rEn 'lint-ok' \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | awk -F: '{print $1":"$2+1}' \
  || true)
if [ -n "$LINT_OK_LINES" ]; then
  for line in $LINT_OK_LINES; do
    HITS=$(echo "$HITS" | grep -vF "$line:" || true)
  done
fi

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Hardcoded hex color detected. Use design tokens (bg-canvas, text-ink, etc.):"
  else
    echo "❌ Hardcoded hex color detected. Use design tokens (bg-canvas, text-ink, etc.):"
  fi
  echo "   Anti-pattern memory #7. SVG icons should use fill=\"currentColor\"."
  echo ""
  echo "$HITS"
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "  (warn mode — not failing CI; P6 flips to error)"
    exit 0
  else
    exit 1
  fi
fi

echo "✓ Hardcoded color lint: no hex literals in components"
