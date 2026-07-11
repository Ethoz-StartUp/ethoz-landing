#!/usr/bin/env bash
# lint-shadow-2xl.sh
# Blocks shadow-xl / shadow-2xl on .svelte files (non-admin). Launch UI uses
# intentional glows (shadow-glow-amber) and subtle card shadows (shadow-card-dark).

set -euo pipefail

cd "$(dirname "$0")/.."

PATTERN='\bshadow-(xl|2xl)\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ shadow-xl / shadow-2xl detected. Use shadow-card-dark / shadow-card-dark-hover / shadow-glow-amber / shadow-mockup."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Shadow lint: no shadow-xl/2xl outside admin"
