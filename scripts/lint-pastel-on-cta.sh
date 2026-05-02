#!/usr/bin/env bash
# lint-pastel-on-cta.sh
# Bans bg-badge-{orange,pink,violet,emerald} on <Button> or button-styled <a>.
# Pastels are metadata-only. CTAs use bg-primary (Cal black).

set -euo pipefail

cd "$(dirname "$0")/.."

# Look for pastel bg classes co-located with Button or button-like patterns
# Match Button / button= / role="button" within ~80 chars of a pastel class
PATTERN_PASTEL='bg-badge-(orange|pink|violet|emerald)'

# Find lines with pastel + button signal
HITS=$(grep -rEn "$PATTERN_PASTEL" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  | grep -v "/cal/PastelBadge.svelte" \
  | grep -E '<Button|role="button"|<button[ >]|button-' \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ Pastel badge color on a CTA detected. Pastels are metadata-only."
  echo "   Primary action uses bg-primary (Cal black). Use PastelBadge for tags."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Pastel-on-CTA lint: pastels stay on metadata"
