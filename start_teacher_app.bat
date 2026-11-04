@echo off
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%"
cd /d "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\apps\mathnotes-teacher"
echo Starting Mathnotes Teacher App with Expo...
npx.cmd expo start
pause
