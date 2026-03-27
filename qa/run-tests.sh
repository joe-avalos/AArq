#!/bin/bash
# ─────────────────────────────────────────────────────────────
# QA test runner — Playwright stress tests
# Usage: ./qa/run-tests.sh [port] [filter]
#
# Examples:
#   ./qa/run-tests.sh              # Run all tests against :4321
#   ./qa/run-tests.sh 4324         # Custom port
#   ./qa/run-tests.sh 4321 about   # Only about-tabs tests
#   ./qa/run-tests.sh 4321 mobile  # Only Mobile Safari project
#
# First run installs Playwright browsers (one-time, ~200MB in ~/.cache)
# ─────────────────────────────────────────────────────────────

PORT=${1:-4321}
FILTER=${2:-}
BASE="http://localhost:$PORT"
QA_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if dev server is running
if ! curl -s "$BASE" > /dev/null 2>&1; then
  echo "❌ Dev server not running at $BASE"
  echo "   Start it with: npx astro dev --port $PORT"
  exit 1
fi

# Install browsers if needed (cached in ~/.cache/ms-playwright)
npx playwright install --with-deps chromium webkit 2>/dev/null

echo ""
echo "🧪 Running Playwright tests against $BASE"
echo ""

ARGS=(
  --config="$QA_DIR/playwright.config.ts"
)

# Override base URL with actual port
export PLAYWRIGHT_BASE_URL="$BASE"

if [ -n "$FILTER" ]; then
  ARGS+=(--grep "$FILTER")
fi

npx playwright test "${ARGS[@]}"

echo ""
echo "📊 To view report: npx playwright show-report"
