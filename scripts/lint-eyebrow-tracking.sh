#!/usr/bin/env bash
# lint-eyebrow-tracking.sh
# Eyebrow / overline labels (font-semibold uppercase tracking-[Xem]) must use a
# single letter-spacing: tracking-[0.18em]. Drift to 0.12em / 0.14em had
# accumulated across pages; this lint locks the eyebrow standard.
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
  | grep -v 'tracking-\[0.18em\]' \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Eyebrow tracking lint: eyebrows must use tracking-[0.18em]:"
  echo "$HITS"
  echo ""
  echo "  Fix: change the eyebrow's tracking-[Xem] to tracking-[0.18em]."
  echo "  Annotate genuine exceptions with // lint-ok."
  exit 1
fi

echo "✓ Eyebrow tracking lint: all eyebrows use tracking-[0.18em]"
