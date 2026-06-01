#!/usr/bin/env bash
# lint-section-bg.sh
# Section backgrounds must use bg-secondary (the canonical light-surface token),
# not bg-muted. Both resolve to the same color (#f8f9fa) but the codebase had
# drifted between the two names; this locks one.
#
# Out of scope (allowed): opacity variants (bg-muted/30), bg-muted-foreground,
# and inner-element bg-muted (badges, dots, hover states, placeholders).
# Allowed exceptions: lines annotated with `// lint-ok`.

set -euo pipefail
cd "$(dirname "$0")/.."

HITS=$(grep -rEn '<section[^>]*\bbg-muted[ "]' \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Section-bg lint: <section> uses bg-muted — use bg-secondary instead:"
  echo "$HITS"
  echo ""
  echo "  Fix: bg-muted -> bg-secondary on section backgrounds (same color, canonical name)."
  echo "  Annotate genuine exceptions with // lint-ok."
  exit 1
fi

echo "✓ Section-bg lint: section backgrounds use bg-secondary"
