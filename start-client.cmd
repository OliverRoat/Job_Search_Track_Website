@echo off
setlocal

cd /d "%~dp0client"

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm.cmd install
  if errorlevel 1 exit /b %errorlevel%
)

call npm.cmd run dev
