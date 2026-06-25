#!/usr/bin/env bash
# lint-eyebrow-tracking.sh
# Eyebrow / overline labels are mono-caps (8020 signature): they must read
# `font-mono font-semibold uppercase tracking-[0.1em]`. This lint locks the
# letter-spacing at 0.1em and flags any uppercase-semibold label that drifts.
#
# Scope: arbitrary tracking-[Xem] on uppercase-semibold labels only. Named-token
# tracking (e.g. tracking-widest on pill badges) is a distinct element, not covered.
# Allowed exceptions: lines annotated with `// lint-ok`.

set -euo pipefail
cd "$(dirname "$0")/.."

HITS=$(grep -rEn 'font-semibold uppercase tracking-\[[0-9.]+em\]' \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -v 'tracking-\[0.1em\]' \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Eyebrow tracking lint: eyebrows must use font-mono ... tracking-[0.1em]:"
  echo "$HITS"
  echo ""
  echo "  Fix: change the eyebrow to 'font-mono font-semibold uppercase tracking-[0.1em]'."
  echo "  Annotate genuine exceptions with // lint-ok."
  exit 1
fi

echo "✓ Eyebrow tracking lint: all eyebrows use mono-caps tracking-[0.1em]"
