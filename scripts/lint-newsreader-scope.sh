#!/usr/bin/env bash
# lint-newsreader-scope.sh
# Bans `Newsreader` references in templates and CSS post-Cal clone migration.
# Cal Sans serves --font-heading; Newsreader (Stripe Press era) should not appear.
#
# History: was inverted multiple times during the May 2026 redesign loop:
#  - lint-cal-sans-scope.sh (banned Newsreader, enforced Cal Sans)
#  - lint-newsreader-scope.sh (banned Cal Sans, enforced Newsreader)  ← Stripe Press era
#  - lint-newsreader-scope.sh (banned Newsreader, enforced Cal Sans)  ← Cal clone — current
#
# Source of truth: ./DESIGN.md (installed via `npx getdesign add cal`).

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"

PATTERN='Newsreader'

HITS=$(grep -rEn "$PATTERN" \
  src/ \
  --include="*.svelte" --include="*.css" --include="*.ts" --include="*.js" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  'Newsreader' references found in code (banned post-Cal clone migration):"
  else
    echo "❌ 'Newsreader' references found in code (banned post-Cal clone migration):"
  fi
  echo "   --font-heading is now Cal Sans. Use h1/h2/h3 or the font-heading class."
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

echo "✓ Cal Sans scope lint: no Newsreader references"
