#!/usr/bin/env bash
# ============================================================
#  RC Microstock Research Pro — ONE-CLICK GITHUB PAGES DEPLOY
#  macOS / Linux user-der jonno:  bash deploy-mac-linux.sh
#  Dorkar: git + gh (GitHub CLI).  gh install: https://cli.github.com
# ============================================================
set -e
cd "$(dirname "$0")"

echo "=============================================="
echo " RC MICROSTOCK RESEARCH PRO — DEPLOY (Mac/Linux)"
echo "=============================================="

command -v git >/dev/null || { echo "[X] git install korun"; exit 1; }
command -v gh  >/dev/null || { echo "[X] GitHub CLI (gh) install korun: https://cli.github.com"; exit 1; }

echo "[1/6] GitHub login check..."
gh auth status >/dev/null 2>&1 || gh auth login -h github.com -p https -w
GHUSER="$(gh api user --jq .login)"
echo "      Logged in as: $GHUSER"

echo "[2/6] Repository: $GHUSER.github.io ..."
gh repo create "$GHUSER.github.io" --public \
  --description "RC Microstock Research Pro v3.4 by Riad Chowdhury — microstock design research suite" \
  >/dev/null 2>&1 || echo "      Repo age thekei ache — thik ache."

echo "[3/6] Git setup..."
git init -b main >/dev/null 2>&1 || true
git remote remove origin >/dev/null 2>&1 || true
git remote add origin "https://github.com/$GHUSER/$GHUSER.github.io.git"

echo "[4/6] Push..."
git add -A
git commit -m "RC Microstock Research Pro v3.4 — deploy" >/dev/null
git push -u origin main --force

echo "[5/6] GitHub Pages ON + auto-deploy workflow..."
gh api "repos/$GHUSER/$GHUSER.github.io/pages" -X POST -f build_type=workflow >/dev/null 2>&1 || true

echo "[6/6] Done! 1-2 minute por site LIVE:"
echo
echo "      https://$GHUSER.github.io/"
echo
echo "      Google index: https://search.google.com/search-console"
echo "      (URL prefix https://$GHUSER.github.io/ verify + sitemap.xml submit)"
echo
open "https://github.com/$GHUSER/$GHUSER.github.io/actions" 2>/dev/null || \
  xdg-open "https://github.com/$GHUSER/$GHUSER.github.io/actions" 2>/dev/null || true
