@echo off
setlocal

powershell -NoProfile -Command "$listener = Get-NetTCPConnection -LocalPort 5194 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($listener) { Stop-Process -Id $listener.OwningProcess; Write-Host 'Job Tracker stopped.' } else { Write-Host 'Job Tracker is not running.' }"
