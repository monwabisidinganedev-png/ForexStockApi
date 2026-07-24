@echo off
setlocal

rem Usage: start_and_setup_db.bat [InstanceName] [PathToSqlFile]
rem If InstanceName is omitted, script assumes the default instance.

if "%1"=="" (
  set "INSTANCE="
) else set "INSTANCE=%~1"

if "%2"=="" (
  set "SQL_FILE=%~dp0..\sql\setup_schema.sql"
) else set "SQL_FILE=%~2"

rem Treat explicit MSSQLSERVER as default (no named instance)
if /I "%INSTANCE%"=="MSSQLSERVER" set "INSTANCE="

if "%INSTANCE%"=="" goto :default_instance
set "SERVICE_NAME=MSSQL%INSTANCE%"
set "SQL_SERVER_HOST=localhost\%INSTANCE%"
goto :after_service

:default_instance
set "SERVICE_NAME=MSSQLSERVER"
set "SQL_SERVER_HOST=localhost"

:after_service
echo Using service "%SERVICE_NAME%" and server "%SQL_SERVER_HOST%".

if not exist "%SQL_FILE%" (
  echo SQL file not found: "%SQL_FILE%"
  exit /b 2
)

where sqlcmd >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo sqlcmd not found. Install SQLCMD and ensure it's in PATH.
  exit /b 3
)

sc query "%SERVICE_NAME%" | findstr /i "RUNNING" >nul
if %ERRORLEVEL% NEQ 0 goto :start_service
echo Service "%SERVICE_NAME%" is already running.
goto :wait_loop

:start_service
echo Service "%SERVICE_NAME%" is not running. Starting...
net start "%SERVICE_NAME%"
if %ERRORLEVEL% NEQ 0 (
  echo Failed to start service "%SERVICE_NAME%".
  exit /b 4
)

:wait_loop
set /a retries=0
set /a maxRetries=30
:wait_check
sqlcmd -S "%SQL_SERVER_HOST%" -Q "SELECT 1" -b -o nul 2>nul
if %ERRORLEVEL% EQU 0 goto :runsql
set /a retries+=1
if %retries% GEQ %maxRetries% (
  echo Timed out waiting for SQL Server to accept connections.
  exit /b 5
)
echo Waiting for SQL Server (%retries%/%maxRetries%)...
timeout /t 2 >nul
goto :wait_check

:runsql
echo Applying schema from "%SQL_FILE%"...
sqlcmd -S "%SQL_SERVER_HOST%" -i "%SQL_FILE%" -b
if %ERRORLEVEL% NEQ 0 (
  echo Failed executing SQL script.
  exit /b 6
)
echo Schema applied successfully.
endlocal
exit /b 0
