#!/usr/bin/env bash
# lint-hardcoded-color.sh
# Bans hardcoded color literals in .svelte files. Tokens live in app.css; components
# reference them via Tailwind utilities or var(--token) / color-mix().
#
# Allowed exceptions:
#   - var(--token), color-mix(...)
#   - Lines annotated with `// lint-ok` or `/* lint-ok */`
#   - SVG attributes with fill="currentColor"

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"

PATTERN='#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|oklch\(|rgba?\(|hsla?\('

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -v 'fill="currentColor"' \
  | grep -vE '<title>|svg.+role="img"' \
  | grep -vE '^[^:]+:[0-9]+:\s*<!--' \
  | grep -vE '^[^:]+:[0-9]+:\s*\*' \
  | grep -vE '^[^:]+:[0-9]+:.*:global\(' \
  | grep -vE '^[^:]+:[0-9]+:.*@media print' \
  | grep -vE 'lint-ok' \
  || true)

LINT_OK_LINES=$(grep -rEn 'lint-ok' \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | awk -F: '{print $1":"$2+1}' \
  || true)
if [ -n "$LINT_OK_LINES" ]; then
  for line in $LINT_OK_LINES; do
    HITS=$(echo "$HITS" | grep -vF "$line:" || true)
  done
fi

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Hardcoded color detected. Use design tokens (bg-background, text-foreground, etc.):"
  else
    echo "❌ Hardcoded color detected. Use design tokens (bg-background, text-foreground, etc.):"
  fi
  echo "   SVG icons should use fill=\"currentColor\"."
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

echo "✓ Hardcoded color lint: no color literals in components"
