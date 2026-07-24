@echo off
setlocal
cd /d "%~dp0"
dotnet run --project .\server\src\ForexStockBot.Api\ForexStockBot.Api.csproj --urls http://localhost:5137 > api.log 2>&1
