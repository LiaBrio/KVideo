@echo off
echo ========================================
echo   KVideo APK 构建脚本
echo ========================================
echo.

REM 设置环境变量启用静态导出
set BUILD_APK=true

echo [1/2] 构建静态文件...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [错误] 构建失败！
    pause
    exit /b 1
)

echo.
echo [2/2] 构建完成！
echo.
echo 静态文件已生成在 out 目录中
echo 接下来需要使用 Capacitor 将静态文件打包成 APK
echo.
echo 提示：
echo 1. 安装 Capacitor Android: npm install @capacitor/android
echo 2. 初始化 Android 项目: npx cap add android
echo 3. 同步文件: npx cap sync android
echo 4. 在 Android Studio 中打开 android 目录并构建 APK
echo.
pause

