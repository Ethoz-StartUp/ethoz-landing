#!/usr/bin/env bash
# lint-cal-sans-weights.sh
# Bans synthesized Cal Sans weights/italics on h1/h2/h3 and font-heading elements.
#
# Cal Sans is a single-weight TTF (600 only) with no italic glyphs. Tailwind
# utilities font-bold (700), font-medium (500), font-normal (400), italic,
# and tracking-tight (-0.025em, looser than the Cal display tracking) cause
# the browser to synthesize → fuzzy rendering on Safari and Win Chrome.
#
# Fix: drop the utility. Let the global h1-h6 selector in app.css apply
# Cal Sans 600 + --fs-display-* clamps + --tracking-display-* letter-spacing.
# Use `not-italic` if a default-italicized HTML element (dfn, em, cite, address)
# needs to opt out of italic — that disables synthesis, doesn't trigger it.
#
# Implementation note: uses perl instead of grep -P because macOS BSD grep
# doesn't support PCRE. Negative lookbehind on italic excludes `not-italic`.

set -euo pipefail

cd "$(dirname "$0")/.."

WARN_MODE="${WARN_MODE:-0}"

FILES=$(find src/routes src/lib/components -name "*.svelte" \
  -not -path "*/admin/*" \
  -not -path "*/components/ui/*")

HITS=$(perl -ne '
  if (/<h[1-3]\s[^>]*class="[^"]*\b(?:font-bold|font-medium|font-normal|(?<!-)italic|tracking-tight)\b/ ||
      /class="[^"]*\bfont-heading\b[^"]*\b(?:font-bold|font-medium|font-normal|(?<!-)italic|tracking-tight)\b/ ||
      /class="[^"]*\b(?:font-bold|font-medium|font-normal|(?<!-)italic|tracking-tight)\b[^"]*\bfont-heading\b/) {
    print "$ARGV:$.:$_";
  }
  close ARGV if eof;
' $FILES || true)

if [ -n "$HITS" ]; then
  echo ""
  if [ "$WARN_MODE" = "1" ]; then
    echo "⚠  Cal Sans synthesis utility on h1-h3 or font-heading element:"
  else
    echo "❌ Cal Sans synthesis utility on h1-h3 or font-heading element:"
  fi
  echo "   Cal Sans is single-weight (600). font-bold/medium/normal/italic/tracking-tight"
  echo "   force the browser to synthesize → fuzzy rendering. Drop the utility and let"
  echo "   the global h1-h6 selector + --fs-display-* clamp apply."
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

echo "✓ Cal Sans weights lint: no synthesis utilities on display headings"
