#!/usr/bin/env bash
# lint-copy-dashes.sh
# Bans em-dashes (—) and en-dashes (–) in user-facing copy sources (8020 rule:
# use commas, periods, or "a"/"to" ranges; the · middot is the inline label
# separator). Scans blog posts, pitch slides, and i18n translation catalogs.
# Code comments (lines starting with // or *) are allowed.
#
# Allowed exceptions: lines annotated with `// lint-ok`.

set -euo pipefail
cd "$(dirname "$0")/.."

HITS=$(grep -rn -e '—' -e '–' \
  src/lib/data/posts src/lib/data/pitch-slides.ts src/lib/i18n/translations \
  --include="*.ts" \
  2>/dev/null \
  | grep -vE '^[^:]*:[0-9]+:[[:space:]]*(//|\*|/\*)' \
  | grep -v 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Copy-dash lint: em/en-dashes in copy strings (8020 bans them):"
  echo "$HITS"
  echo ""
  echo "  Fix: replace — / – with commas, periods, or a/to ranges. Use the · middot"
  echo "  as the inline label separator. Annotate exceptions with // lint-ok."
  exit 1
fi

echo "✓ Copy-dash lint: no em/en-dashes in copy"
