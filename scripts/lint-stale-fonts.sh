#!/usr/bin/env bash
# lint-stale-fonts.sh
# Bans references to retired display fonts in templates and CSS.
#
# Font history on this codebase:
#   - Playfair Display / Newsreader (medical-blue + Stripe Press eras) — retired
#   - Cal Sans (Cal.com clone era)                                     — retired
#   - DM Sans (8020 design system)                                     — retired
#   - Inter Variable (Launch UI v2)                                    — canonical
#
# --font-sans and --font-heading are now Inter Variable. Use the font-sans or
# font-heading class; display weight is controlled by font-weight utilities.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"

# Retired font-family names. Word-boundary anchored to avoid false hits.
PATTERN='Newsreader|Cal Sans|CalSans|cal-sans|Playfair|DM Sans|DMSans|dm-sans|JetBrains Mono|JetBrainsMono|jetbrains-mono'

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
    echo "⚠  Retired font reference found (Newsreader / Cal Sans / DM Sans / JetBrains Mono / Playfair):"
  else
    echo "❌ Retired font reference found (Newsreader / Cal Sans / DM Sans / JetBrains Mono / Playfair):"
  fi
  echo "   --font-sans and --font-heading are now Inter Variable (Launch UI v2)."
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

echo "✓ Stale-fonts lint: no retired font references"
