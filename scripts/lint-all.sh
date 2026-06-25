#!/usr/bin/env bash
# lint-all.sh — runs all design-system bash lints in sequence.
# Wired into package.json scripts.lint. CI invokes via npm run test:ci.

set -euo pipefail

cd "$(dirname "$0")/.."

bash scripts/lint-section-width.sh
bash scripts/lint-shadow-2xl.sh
bash scripts/lint-glow-shadows.sh
bash scripts/lint-opacity-hover.sh
bash scripts/lint-muted-hover.sh
bash scripts/lint-hardcoded-color.sh
bash scripts/lint-pastel-on-cta.sh
bash scripts/lint-stale-fonts.sh
bash scripts/lint-icon-box-wrapper.sh
bash scripts/lint-arbitrary-text-px.sh
bash scripts/lint-eyebrow-tracking.sh
bash scripts/lint-section-bg.sh

echo ""
echo "✓ All design-system lints passed"
