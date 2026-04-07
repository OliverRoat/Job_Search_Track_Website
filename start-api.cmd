@echo off
setlocal

cd /d "%~dp0"
dotnet run --project "src\JobTracker.Api" --launch-profile http
