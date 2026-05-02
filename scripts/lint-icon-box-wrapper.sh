#!/usr/bin/env bash
# lint-icon-box-wrapper.sh
# Detects "icon-in-colored-box wrapper" — AI-slop signature pattern.
# Looks for: <div class="...bg-primary/10 ... rounded ... p-... ">{icon only}</div>
# CLAUDE.md hard rule: icons go INLINE with titles, never in colored-box wrappers.

set -euo pipefail

cd "$(dirname "$0")/.."

# Match: bg-{primary,foreground,destructive,etc}/10 or /5 + rounded + small padding (signal of icon wrapper)
# This is a heuristic — possible false positives are acceptable; reviewer verifies.
PATTERN='bg-(primary|foreground|destructive|warning|success)/(5|10|15|20)[^"]*rounded(-[a-z]+)?[^"]*p-(2|3)\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "⚠ Possible icon-in-colored-box wrapper detected (AI-slop signature)."
  echo "  CLAUDE.md hard rule: icons go inline with titles, no colored-box wrappers."
  echo "  Verify each match is intentional (e.g. timeline node circles are OK)."
  echo "  If this is a false positive, the heuristic is intentionally lenient — reviewer judgment applies."
  echo ""
  echo "$HITS"
  echo ""
  # Warn-only during migration. Flip to exit 1 in Phase 7.
  exit 0
fi

echo "✓ Icon box wrapper lint: no obvious AI-slop icon wrappers"
