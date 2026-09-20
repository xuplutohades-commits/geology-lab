#!/bin/bash
# 地质构造实验室 · 一键启动（macOS 双击运行）
cd "$(dirname "$0")"
PORT=4173
echo "正在启动 地质构造实验室 ..."
python3 -m http.server $PORT --directory "$(dirname "$0")" >/dev/null 2>&1 &
sleep 1
open "http://localhost:$PORT/"
echo "已打开 http://localhost:$PORT/  (关闭本窗口即停止服务)"
read -p "按回车键关闭服务并退出..."
kill %1 2>/dev/null
