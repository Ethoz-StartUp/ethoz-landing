#!/usr/bin/env bash
# lint-glow-shadows.sh
# Launch UI v2 uses intentional amber glows. This lint now only blocks the
# deprecated shadow-glow-primary utility (neutralized in the old 8020 system).
# shadow-glow-destructive and shadow-glow-amber* are allowed.

set -euo pipefail

cd "$(dirname "$0")/.."

# Match shadow-glow-primary or shadow-glow-primary-hover, but NOT shadow-glow-destructive / amber
PATTERN='\bshadow-glow-primary(-hover)?\b'

HITS=$(grep -rEn "$PATTERN" \
  src/routes src/lib/components \
  --include="*.svelte" \
  2>/dev/null \
  | grep -v "/admin/" \
  | grep -v "/components/ui/" \
  || true)

if [ -n "$HITS" ]; then
  echo ""
  echo "❌ shadow-glow-primary detected. Utility is deprecated — use shadow-glow-amber or shadow-glow-destructive."
  echo ""
  echo "$HITS"
  echo ""
  exit 1
fi

echo "✓ Glow shadow lint: no deprecated glow utilities in use"
