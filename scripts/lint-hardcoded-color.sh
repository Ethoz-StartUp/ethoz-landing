#!/usr/bin/env bash
# lint-hardcoded-color.sh
# Bans hardcoded hex literals in .svelte files (outside <style> blocks where SVG fill="#..." is acceptable
# but actually most are fill="currentColor"). Anti-pattern memory #7.
#
# Allowed exceptions:
#   - SVG attributes inside data: URLs (rare) — caught by content matching
#   - Inline <style> blocks (component-scoped) — must use tokens

set -euo pipefail

cd "$(dirname "$0")/.."

# 6 or 3 char hex with #
PATTERN='#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b'

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

# Also skip lines whose previous line contains a lint-ok annotation.
# Two-pass: collect all line numbers preceded by a lint-ok comment line, then exclude.
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
  echo "❌ Hardcoded hex color detected. Use design tokens (bg-primary, text-foreground, etc.)."
  echo "   Anti-pattern memory #7. SVG icons should use fill=\"currentColor\"."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Hardcoded color lint: no hex literals in components"
