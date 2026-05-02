#!/usr/bin/env bash
# lint-pastel-on-cta.sh
# Bans pastel/accent BG fills on <Button> or button-styled <a>.
# Cream-section CTAs use bg-primary (now navy via --primary repoint).
# bg-accent-mustard CTA is allowed only inside <SectionDark> — bash can't
# reliably detect that nesting, so mustard is excluded from this lint.
# bg-accent-brick and bg-accent-sage are large-area-only — banned on CTAs
# regardless of section context (5.3:1 / 5.5:1 boundary on cream fails 1.4.11).
# WARN_MODE=1 default during P1/P2 migration; flips to error in P6.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"  # P6 flipped default from 1→0 (strict by default after Stripe Press migration completed)

# Old pastel BG classes (legacy, still tokenized) + new accent-brick/sage
PATTERN_PASTEL='bg-badge-(orange|pink|violet|emerald)|bg-accent-(brick|sage)'

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
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Pastel/accent fill on a CTA detected — fails WCAG 1.4.11 boundary contrast on cream:"
  else
    echo "❌ Pastel/accent fill on a CTA detected — fails WCAG 1.4.11 boundary contrast on cream:"
  fi
  echo "   Cream-section CTAs use bg-primary (navy). Pastels and brick/sage are metadata-only."
  echo "   Mustard CTA is allowed only inside <SectionDark> (9.1:1 on navy bg)."
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

echo "✓ Pastel-on-CTA lint: pastels and brick/sage stay off CTAs"
