# ForexStockBot API

## Overview
This project is a layered ASP.NET Core Web API that exposes endpoints for market data, predictions, advice, diagnostics, provider state, and health checks. It is a web-based evolution of the original ForexStockBot console app, with full support for ML, provider fallback, and database tracking.

## Getting Started

### Prerequisites
- .NET 8 SDK
- SQL Server (local or remote)
- (Optional) Docker for containerized DB

### Setup
1. Clone the repository.
2. Run the SQL setup script in `ForexStockBot/sql/setup_schema.sql` to create the database and schema.
3. Configure your connection string in `src/ForexStockBot.Api/appsettings.json`.
4. (Optional) Use `start_and_setup_db.bat` to automate DB setup.
5. Build and run the API:
   ```sh
   dotnet build src/ForexStockBot.Api/ForexStockBot.Api.csproj
   dotnet run --project src/ForexStockBot.Api/ForexStockBot.Api.csproj
   ```
6. Access Swagger UI at `http://localhost:5000/swagger` (or the port configured).

### Testing
- Use `test.sh` or `test.bat` in the `ForexStockBot` folder for automated tests.
- Manual testing can be done via Swagger UI or Postman.

## Endpoints

### Mock Control
- `POST /api/mock/toggle?enabled=true|false` — Enable/disable mock mode globally.

### Providers
- `GET /api/providers` — List all available market data providers.

### Price Series
- `GET /api/priceseries/{symbol}` — Get all price series for a symbol.
- `POST /api/priceseries` — Add a new price series entry.

### Prediction
- `POST /api/predictionresult?symbol=SYMBOL&provider=PROVIDER` — Run a prediction for a symbol/provider. Also generates and stores advice.
- `GET /api/predictionresult/{symbol}` — Get all prediction results for a symbol.

### Advice
- `GET /api/advice/{symbol}` — Get all advice results for a symbol (auto-generated with predictions).

### Diagnostics
- `GET /api/diagnostics` — Run diagnostics for all providers and view their status.

### Provider State
- `GET /api/providerstate` — View all provider states (rate limits, fallback, etc).
- `GET /api/providerstate/{provider}` — View state for a specific provider.
- `POST /api/providerstate` — Update provider state (rate limits, fallback, etc).

### Health
- `GET /api/health` — Health check for API and database connection.

## SQL and Environment Files
- All SQL setup scripts are in `ForexStockBot/sql/`.
- DB setup automation: `ForexStockBot/start_and_setup_db.bat`.
- App settings: `src/ForexStockBot.Api/appsettings.json` and `appsettings.Development.json`.

## Project Structure
- `src/ForexStockBot.Api/` — Web API project (controllers, services, repositories, models, DTOs)
- `ForexStockBot/` — Original console app and shared logic
- `test/` — (Reserved for future unit/integration tests)

## Extending/Resetting Environment
- To reset the DB, rerun the SQL scripts or use the batch file.
- All configuration and setup files are tracked in the repo for easy onboarding.

## Contributing
- See this README and the code comments for guidance.
- New endpoints should follow the layered architecture and be documented here.

---
For any questions, see the code comments or contact the original authors.
