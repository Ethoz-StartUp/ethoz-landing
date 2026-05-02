#!/usr/bin/env bash
# lint-muted-hover.sh
# Bans hover:bg-muted/N OR hover:bg-canvas-elevated/N where N<40 — imperceptible.
# Allows /40+ which is the established 4-vector hover convention
# (border + bg/40 + translate + shadow — the OTHER vectors carry affordance).
# Anti-pattern memory #2 (revised threshold for established convention).
# WARN_MODE=1 default during P1/P2 migration; flips to error in P6.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-1}"

# Match hover:bg-muted/N OR hover:bg-canvas-elevated/N for N=1..39 only.
PATTERN='hover:bg-(muted|canvas-elevated)/([1-9]|[1-3][0-9])\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  hover:bg-{muted|canvas-elevated}/N (N<40) detected — too subtle to read:"
  else
    echo "❌ hover:bg-{muted|canvas-elevated}/N (N<40) detected — too subtle to read:"
  fi
  echo "   Use /40 minimum (4-vector convention) or hover:bg-primary/5 tinted."
  echo "   Anti-pattern memory #2."
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

echo "✓ Muted hover lint: hover states have visible contrast (>=/40 threshold)"
