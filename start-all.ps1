Set-Location $PSScriptRoot
$api = Start-Process -FilePath "dotnet" -ArgumentList "run --project .\server\src\ForexStockBot.Api\ForexStockBot.Api.csproj --urls http://localhost:5137" -PassThru
Set-Location .\web
npm install
npm run start
