#!/usr/bin/env bash
# lint-stale-fonts.sh
# Bans references to retired display fonts in templates and CSS.
#
# Font history on this codebase:
#   - Playfair Display / Newsreader (medical-blue + Stripe Press eras) — retired
#   - Cal Sans (Cal.com clone era)                                     — retired
#   - DM Sans (8020 design system, current)                            — canonical
#
# --font-heading is now DM Sans (8020 §08). Display headings come from the global
# h1-h6 selector or the `font-heading` class. DM Sans is a true variable font
# (weights 100-900 + real italics) so weight/italic utilities are SAFE — there is
# no synthesis problem to lint against (that check was Cal-Sans-specific, removed).
#
# Source of truth: 8020IQ Brand Guide v1.1, src/app.css token block.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"

# Retired font-family names. Word-boundary anchored to avoid false hits.
PATTERN='Newsreader|Cal Sans|CalSans|cal-sans|Playfair'

HITS=$(grep -rEn "$PATTERN" \
  src/ \
  --include="*.svelte" --include="*.css" --include="*.ts" --include="*.js" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Retired display-font reference found (Newsreader / Cal Sans / Playfair):"
  else
    echo "❌ Retired display-font reference found (Newsreader / Cal Sans / Playfair):"
  fi
  echo "   --font-heading is now DM Sans (8020 §08). Use h1/h2/h3 or the font-heading class."
  echo ""
  echo "$HITS"
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "  (warn mode — not failing CI)"
    exit 0
  else
    exit 1
  fi
fi

echo "✓ Stale-fonts lint: no retired display-font references"
