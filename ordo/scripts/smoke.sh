#!/usr/bin/env bash
# Post-deploy / local smoke checks
set -euo pipefail

BASE="${1:-http://127.0.0.1:3000}"

echo "==> Health"
curl -fsS "$BASE/api/health" | head -c 400
echo
echo

echo "==> Sync health"
curl -fsS "$BASE/api/sync/health" | head -c 400
echo
echo

echo "==> Home headers"
curl -sI "$BASE/" | tr -d '\r' | grep -iE 'HTTP/|content-security-policy|x-frame-options|x-content-type-options' || true
echo

echo "==> Privacy / Terms / Sitemap"
for p in /privacy /terms /sitemap.xml /robots.txt; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p")
  echo "$code  $p"
done

echo
echo "Smoke OK against $BASE"
