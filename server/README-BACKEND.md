# ForexStockBot API - Backend

## Overview
This backend is a layered ASP.NET Core Web API that exposes endpoints for market data, predictions, advice, diagnostics, provider state, and health checks. It is a web-based evolution of the original ForexStockBot console app, with full support for ML, provider fallback, and database tracking.

## Getting Started

### Prerequisites
- .NET 8 SDK
- SQL Server (local or remote)
- (Optional) Docker for containerized DB

### Setup
1. Navigate to the backend directory:
   ```sh
   cd server
   ```

2. Run the SQL setup script to create the database and schema:
   ```sh
   # Windows
   .\start_and_setup_db.bat
   
   # Or manually run the SQL script located at:
   # sql/setup_schema.sql
   ```

3. Configure your connection string in `src/ForexStockBot.Api/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.;Database=ForexStockDb;Integrated Security=true;TrustServerCertificate=true;"
     }
   }
   ```

4. Build and run the API:
   ```sh
   dotnet build src/ForexStockBot.Api/ForexStockBot.Api.csproj
   dotnet run --project src/ForexStockBot.Api/ForexStockBot.Api.csproj
   ```

5. Access Swagger UI at `http://localhost:5000/swagger` (or the port configured).

### Testing
- Use `test.sh` or `test.bat` for automated tests.
- Manual testing can be done via Swagger UI or Postman.

## API Endpoints

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

## Configuration Files
- **SQL Scripts**: All setup scripts are in `sql/` directory
- **DB Setup**: `start_and_setup_db.bat` — Automates database setup
- **App Settings**: 
  - `src/ForexStockBot.Api/appsettings.json` — Production settings
  - `src/ForexStockBot.Api/appsettings.Development.json` — Development settings

## Project Structure
```
server/
├── src/
│   ├── ForexStockBot.Api/       # Main Web API project
│   │   ├── Controllers/          # API endpoints
│   │   ├── Services/             # Business logic
│   │   ├── Repositories/         # Data access
│   │   ├── Models/               # Domain models
│   │   ├── DTOs/                 # Data transfer objects
│   │   ├── Domain/               # Domain logic
│   │   ├── appsettings.json      # Configuration
│   │   └── Program.cs            # Startup
│   └── ForexStockBot/            # Original console app (shared logic)
├── sql/                          # Database scripts
├── start_and_setup_db.bat        # Database setup automation
├── test.bat / test.sh            # Test scripts
└── README-BACKEND.md             # This file
```

## CORS Configuration

The API is configured to accept requests from the Angular frontend. CORS is enabled for:
- `http://localhost:4200` (Angular dev server)

To add more origins, update `Program.cs`:

```csharp
app.UseCors(policy => policy
    .WithOrigins("http://localhost:4200", "https://yourdomain.com")
    .AllowAnyMethod()
    .AllowAnyHeader());
```

## Extending
- To add new endpoints, follow the existing layered architecture pattern
- All controllers inherit from `ControllerBase`
- Services implement repository pattern for data access
- Models are mapped to DTOs for API responses

## Resetting Environment
- To reset the database, rerun the SQL scripts or use `start_and_setup_db.bat`
- All configuration and setup files are tracked in the repo for easy onboarding

## Contributing
- See the code comments for guidance
- New endpoints should follow the layered architecture documented here

---
For questions or issues, contact the development team.
