#!/usr/bin/env bash
# lint-section-width.sh
#
# Enforces: section-level containers use `mx-auto max-w-7xl px-...` (aligned
# with NavBar). Using `max-w-{2xl,3xl,4xl,5xl,6xl}` as an OUTER container
# with `px-...` padding creates narrow content that visually misaligns with
# the nav grid.
#
# If you need a narrower READING column (e.g. article body), wrap content
# in an inner `max-w-3xl` or `max-w-[68ch]` div INSIDE a `max-w-7xl` outer.
#
# Runs as part of `npm run lint`.
# Add-only: marketing routes (non-admin). Admin pages have different scale.

set -euo pipefail

cd "$(dirname "$0")/.."

# Pattern: mx-auto ... max-w-{2xl..6xl} ... px- (outer container signal).
# Allows intermediate utilities like `flex-1`, `w-full`, etc.
# Exclude: src/routes/admin/** (different scale convention).
PATTERN='mx-auto[^"]*max-w-(2xl|3xl|4xl|5xl|6xl)[^"]*px-'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ Section-width lint: narrow outer containers detected."
  echo ""
  echo "   Outer containers with px- padding must use 'max-w-7xl' to align"
  echo "   with the NavBar's container grid. For narrower reading columns,"
  echo "   wrap content in an inner '<div class=\"max-w-3xl\">' inside a"
  echo "   'max-w-7xl' outer."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Section-width lint: all outer containers aligned (max-w-7xl)"
