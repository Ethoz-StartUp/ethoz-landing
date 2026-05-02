#!/usr/bin/env bash
# lint-cal-sans-scope.sh
# Cal Sans renders via --font-heading. Direct font-family: 'Cal Sans' inline overrides should not exist
# anywhere outside app.css (where the @font-face + token live). Catches accidental hardcoded font-family.

set -euo pipefail

cd "$(dirname "$0")/.."

# Match font-family: ... 'Cal Sans' or "Cal Sans" inside .svelte files
PATTERN='font-family:[^;]*Cal Sans'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ Direct 'Cal Sans' font-family in .svelte detected. Use the font-heading class or h1/h2/h3."
  echo "   Cal Sans is wired via --font-heading token in app.css — don't hardcode it elsewhere."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Cal Sans scope lint: no inline font-family overrides"
