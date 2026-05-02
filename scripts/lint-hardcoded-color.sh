#!/usr/bin/env bash
# lint-hardcoded-color.sh
# Bans hardcoded hex literals in .svelte files (outside <style> blocks).
# Anti-pattern memory #7. Tokens live in app.css; components use Tailwind utilities.
#
# Common offenders to catch in current era (Stripe Press migration):
#   - Old Cal palette leaks: #111111, #F5F5F5, #101010, #FFFFFF
#   - New Stripe Press hexes that should reference tokens: #FBF7F0, #0F1F3A,
#     #D4A017, #B23A2C, #4A6B47, #FBF7F0, #0A1628
#
# Allowed exceptions:
#   - SVG attributes inside data: URLs (rare) — caught by content matching
#   - Inline <style> blocks (component-scoped) — must use tokens
#   - Lines annotated with `// lint-ok` (above or inline) for legitimate
#     SDK config / raw HTML strings.
#
# WARN_MODE=1 default during P1/P2 migration; flips to error in P6.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-1}"

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
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Hardcoded hex color detected. Use design tokens (bg-canvas, text-ink, etc.):"
  else
    echo "❌ Hardcoded hex color detected. Use design tokens (bg-canvas, text-ink, etc.):"
  fi
  echo "   Anti-pattern memory #7. SVG icons should use fill=\"currentColor\"."
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

echo "✓ Hardcoded color lint: no hex literals in components"
