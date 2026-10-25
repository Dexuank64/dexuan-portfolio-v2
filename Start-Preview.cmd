@echo off
cd /d "%~dp0"
node --require ./preview-compat.cjs ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5188 --strictPort --open /#project-archive
pause
