#!/usr/bin/env bash
# lint-tint-contrast.sh
# Bans bare `text-primary` co-located with a light primary tint
# (`bg-primary/5|10|15|20`). With --primary = sky #0B72C4, sky text on a faint
# sky tint over cream falls below WCAG AA (bg-primary/10 = 4.12:1). Use
# `text-primary-active` (#095C9E, ~5.7:1) or `text-primary-pressed` (#074B82)
# on tinted pills/badges/step-circles so functional text stays AA.
#
# Allowed exceptions: lines annotated with `// lint-ok`.

set -euo pipefail
cd "$(dirname "$0")/.."

HITS=$(grep -rnE 'bg-primary/(5|10|15|20)\b' \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -E 'text-primary([^-]|$)' \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Tint-contrast lint: bare text-primary on a primary tint (sub-AA on cream):"
  echo "$HITS"
  echo ""
  echo "  Fix: use text-primary-active (#095C9E) or text-primary-pressed (#074B82)"
  echo "  on the tinted pill/badge instead of text-primary. Annotate exceptions with // lint-ok."
  exit 1
fi

echo "✓ Tint-contrast lint: no bare text-primary on primary tints"
