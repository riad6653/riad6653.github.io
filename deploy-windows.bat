@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
REM ============================================================
REM  RC Microstock Research Pro — ONE-CLICK GITHUB PAGES DEPLOY
REM  Windows user-der jonno. Double-click korlei cholbe.
REM  Dorkar: GitHub account (free) + GitHub CLI (gh) + Git
REM  gh install:  winget install --id GitHub.cli
REM  Git install: winget install --id Git.Git
REM ============================================================
title RC Site Deploy — Riad Chowdhury
cd /d "%~dp0"

echo.
echo  ==============================================
echo   RC MICROSTOCK RESEARCH PRO — DEPLOY (Windows)
echo  ==============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [X] Git install kora nei. Age install korun:  winget install --id Git.Git
  pause & exit /b 1
)

where gh >nul 2>nul
if errorlevel 1 (
  echo [X] GitHub CLI (gh) install kora nei. Age install korun:
  echo     winget install --id GitHub.cli
  echo     tarpor notun terminal khule abar ei file double-click korun.
  pause & exit /b 1
)

echo [1/6] GitHub login check...
gh auth status >nul 2>nul
if errorlevel 1 (
  echo      Browser khulbe — GitHub account diye login korun (free account).
  call gh auth login -h github.com -p https -w
  if errorlevel 1 ( echo [X] Login hoyeni. Abar try korun. & pause & exit /b 1 )
)
for /f "delims=" %%u in ('gh api user --jq .login') do set GHUSER=%%u
echo      Logged in as: !GHUSER!

echo [2/6] Repository banano hocche: !GHUSER!.github.io ...
gh repo create "!GHUSER!.github.io" --public --description "RC Microstock Research Pro v3.4 by Riad Chowdhury — microstock design research suite" >nul 2>nul
if errorlevel 1 ( echo      Repo age thekei ache — thik ache, egie use korbo. )

echo [3/6] Git setup...
git init -b main >nul 2>nul
git remote remove origin >nul 2>nul
git remote add origin "https://github.com/!GHUSER!/!GHUSER!.github.io.git"

echo [4/6] Files push kora hocche (ekhon internet e upload hocche)...
git add -A
git commit -m "RC Microstock Research Pro v3.4 — deploy" >nul
git push -u origin main --force

echo [5/6] GitHub Pages ON kora hocche + auto-deploy workflow...
gh api repos/!GHUSER!/!GHUSER!.github.io/pages -X POST -f build_type=workflow >nul 2>nul
if errorlevel 1 ( echo      Pages age thekei enable kora ache. )

echo [6/6] Done! 1-2 minute por site LIVE:
echo.
echo      https://!GHUSER!.github.io/
echo.
echo      Google-e index korate: https://search.google.com/search-console
echo      (URL prefix = https://!GHUSER!.github.io/ diye verify korun,
echo       tarpor sitemap.xml submit korun)
echo.
start "" "https://github.com/!GHUSER!/!GHUSER!.github.io/actions"
pause
