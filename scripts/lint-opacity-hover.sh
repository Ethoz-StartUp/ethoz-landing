#!/usr/bin/env bash
# lint-opacity-hover.sh
# Bans hover:opacity-N where N<100 used as reveal-hover affordance.
# Anti-pattern memory #1: opacity tricks hide content that should be readable at default.

set -euo pipefail

cd "$(dirname "$0")/.."

# Match hover:opacity-{0,5,10,...,95} but allow hover:opacity-100
PATTERN='hover:opacity-(0|[1-9]|[1-9][0-9])\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -vE "hover:opacity-100\b" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ hover:opacity-N (N<100) detected — using opacity as reveal-hover."
  echo "   Default state must be readable. If text matters, show at 100% always."
  echo "   Anti-pattern memory #1."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Opacity hover lint: no opacity-as-reveal patterns"
