#!/bin/bash
# Quick test script for ForexStockBot

set -e

echo "[Test] Building ForexStockBot..."
dotnet build --configuration Release

echo "[Test] Build successful!"
echo ""
echo "Next steps:"
echo "1. Edit appsettings.json with your Alpha Vantage API key"
echo "2. Run: dotnet run"
echo ""
echo "For environment variable setup:"
echo "  export AlphaVantage__ApiKey='YOUR_API_KEY'"
echo "  dotnet run"
