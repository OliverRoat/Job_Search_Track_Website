@echo off
setlocal

cd /d "%~dp0"

powershell -NoProfile -Command "try { Invoke-WebRequest 'http://localhost:5194/api/job-applications' -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }"
if "%ERRORLEVEL%"=="0" (
  start "" "http://localhost:5194"
  exit /b 0
)

call "%~dp0build-local-client.cmd"
if errorlevel 1 exit /b %errorlevel%

echo Starting the local app...
powershell -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/k', '\"%~dp0run-local-app.cmd\"' -WorkingDirectory '%~dp0' -WindowStyle Minimized"

powershell -NoProfile -Command "$url = 'http://localhost:5194/api/job-applications'; for ($i = 0; $i -lt 60; $i++) { try { Invoke-WebRequest $url -UseBasicParsing | Out-Null; Start-Process 'http://localhost:5194'; exit 0 } catch { Start-Sleep -Milliseconds 500 } }; Write-Error 'The local app did not start in time.'; exit 1"
