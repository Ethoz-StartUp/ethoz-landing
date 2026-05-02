#!/usr/bin/env bash
# lint-newsreader-scope.sh
# Bans `Cal Sans` references in templates and CSS post-Stripe Press migration.
# Newsreader Variable serves --font-heading; Cal Sans should not appear in code.
# WARN_MODE=1 default during P1/P2 migration; flips to error in P6.
#
# Inverted from the prior lint-cal-sans-scope.sh which enforced Cal Sans
# scope. Cal Sans is removed entirely from the design system as of
# 2026-05-02 (commit 17046839).

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"  # P6 flipped default from 1→0 (strict by default after Stripe Press migration completed)

PATTERN='Cal Sans'

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
    echo "⚠  'Cal Sans' references found in code (banned post-Stripe Press migration):"
  else
    echo "❌ 'Cal Sans' references found in code (banned post-Stripe Press migration):"
  fi
  echo "   --font-heading is now Newsreader Variable. Use h1/h2/h3 or font-heading class."
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

echo "✓ Newsreader scope lint: no Cal Sans references"
