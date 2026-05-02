#!/usr/bin/env bash
# lint-glow-shadows.sh
# Bans shadow-glow-primary (utility neutralized — using it is dead weight).
# shadow-glow-destructive is EXEMPT (safety signature for panic button + critical confirmations).

set -euo pipefail

cd "$(dirname "$0")/.."

# Match shadow-glow-primary or shadow-glow-primary-hover, but NOT shadow-glow-destructive
PATTERN='\bshadow-glow-primary(-hover)?\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ shadow-glow-primary detected. Utility is neutralized — remove it."
  echo "   shadow-glow-destructive is the only retained glow (safety signature)."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Glow shadow lint: no neutralized glow utilities in use"
