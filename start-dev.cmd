@echo off
setlocal

cd /d "%~dp0"

start "Job Tracker API" cmd /k "%~dp0start-api.cmd"
start "Job Tracker Client" cmd /k "%~dp0start-client.cmd"
