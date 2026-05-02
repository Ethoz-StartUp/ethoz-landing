#!/usr/bin/env bash
# lint-muted-hover.sh
# Bans hover:bg-muted/N where N<40 — genuinely imperceptible.
# Allows /40+ which is the established 4-vector hover convention
# (border + bg/40 + translate + shadow — the OTHER vectors carry affordance).
# Anti-pattern memory #2 (revised threshold for established convention).

set -euo pipefail

cd "$(dirname "$0")/.."

# Match hover:bg-muted/N for N=1..39 only. N>=40 is allowed (4-vector convention).
PATTERN='hover:bg-muted/([1-9]|[1-3][0-9])\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ hover:bg-muted/N (N<40) detected — too subtle to read."
  echo "   Use hover:bg-muted/40 (4-vector convention) or higher, or hover:bg-primary/5 tinted."
  echo "   Anti-pattern memory #2."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Muted hover lint: hover states have visible contrast (>=/40 threshold)"
