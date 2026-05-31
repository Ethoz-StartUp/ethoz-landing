#!/usr/bin/env bash
# lint-arbitrary-text-px.sh
# Bans arbitrary pixel font sizes — text-[Npx] — in landing .svelte files.
#
# Font sizes must come from the scale: Tailwind defaults (text-xs..text-9xl)
# for real copy, or the product-mockup micro tokens for miniature app chrome:
#   text-mockup-3xs (8px) · text-mockup-2xs (9px) · text-mockup-xs (10px) · text-mockup-sm (11px)
# (defined in src/app.css @theme). text-[12px] => text-xs.
#
# Why: 448 raw text-[Npx] values had drifted across the landing pages. Tokenizing
# keeps the miniature scale consistent and rebrandable. This lint blocks regression.
#
# Allowed exceptions: lines annotated with `// lint-ok`.

set -euo pipefail

cd "$(dirname "$0")/.."

PATTERN='text-\[[0-9]+px\]'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -vE 'lint-ok' \
  || true)

if [ -n "$HITS" ]; then
  echo "✖ Arbitrary text-px lint: found raw text-[Npx] font sizes (use the type scale / text-mockup-* tokens):"
  echo "$HITS"
  echo ""
  echo "  Fix: text-[12px] -> text-xs · text-[11px] -> text-mockup-sm · text-[10px] -> text-mockup-xs"
  echo "       text-[9px] -> text-mockup-2xs · text-[8px]/[7px] -> text-mockup-3xs"
  echo "  Tokens defined in src/app.css @theme. Annotate genuine exceptions with // lint-ok."
  exit 1
fi

echo "✓ Arbitrary text-px lint: no raw text-[Npx] font sizes in landing"
