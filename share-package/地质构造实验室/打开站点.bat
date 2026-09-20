@echo off
chcp 65001 >nul
echo 正在启动 地质构造实验室 ...
cd /d "%~dp0"
start "" http://localhost:4173/
python -m http.server 4173 --directory "%~dp0"
pause
