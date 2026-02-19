@echo off
cd /d "%~dp0"
echo Starting dev server...
node node_modules/vite/bin/vite.js
pause
