#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Lighthouse audit — runs against local dev server
# Usage: ./qa/lighthouse-audit.sh [port]
# Default port: 4321
# Reports saved to lighthouse-reports/
# ─────────────────────────────────────────────────────────────

PORT=${1:-4321}
BASE="http://localhost:$PORT"
DIR="lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_DIR="$DIR/$TIMESTAMP"

mkdir -p "$REPORT_DIR"

# Check if dev server is running
if ! curl -s "$BASE" > /dev/null 2>&1; then
  echo "❌ Dev server not running at $BASE"
  echo "   Start it with: npx astro dev --port $PORT"
  exit 1
fi

echo "🔍 Running Lighthouse audits against $BASE"
echo "   Reports → $REPORT_DIR/"
echo ""

PAGES=(
  "/"
  "/about/"
  "/projects/"
  "/services/"
  "/contact/"
)

CATEGORIES="accessibility,performance,seo,best-practices"

for page in "${PAGES[@]}"; do
  name=$(echo "$page" | sed 's/\//-/g; s/^-//; s/-$//')
  [ -z "$name" ] && name="home"

  echo "── $name ($BASE$page)"

  # Mobile audit
  npx lighthouse "$BASE$page" \
    --only-categories="$CATEGORIES" \
    --output=html \
    --output-path="$REPORT_DIR/${name}-mobile.html" \
    --chrome-flags="--headless --no-sandbox" \
    --quiet 2>/dev/null

  # Desktop audit
  npx lighthouse "$BASE$page" \
    --only-categories="$CATEGORIES" \
    --preset=desktop \
    --output=html \
    --output-path="$REPORT_DIR/${name}-desktop.html" \
    --chrome-flags="--headless --no-sandbox" \
    --quiet 2>/dev/null

  echo "   ✓ mobile + desktop"
done

echo ""
echo "✅ All reports saved to $REPORT_DIR/"
echo "   Open with: open $REPORT_DIR/*.html"
