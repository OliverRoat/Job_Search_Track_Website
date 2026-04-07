@echo off
setlocal

cd /d "%~dp0"

if not exist "client\node_modules" (
  echo Installing frontend dependencies...
  pushd "client"
  call npm.cmd install
  set "NPM_EXIT=%ERRORLEVEL%"
  popd
  if not "%NPM_EXIT%"=="0" exit /b %NPM_EXIT%
)

echo Building frontend for local use...
pushd "client"
call npm.cmd run build
set "BUILD_EXIT=%ERRORLEVEL%"
popd
if not "%BUILD_EXIT%"=="0" exit /b %BUILD_EXIT%

if not exist "src\JobTracker.Api\wwwroot" mkdir "src\JobTracker.Api\wwwroot"

robocopy "client\dist" "src\JobTracker.Api\wwwroot" /MIR >nul
set "ROBOCOPY_EXIT=%ERRORLEVEL%"
if %ROBOCOPY_EXIT% GEQ 8 exit /b %ROBOCOPY_EXIT%

echo Local app files are ready.
