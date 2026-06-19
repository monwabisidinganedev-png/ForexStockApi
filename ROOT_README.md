# ForexStockApi - Full Stack Application

A modern full-stack application for forex and stock market data analysis with ML predictions and trading advice.

## Project Structure

```
ForexStockApi/
├── server/                     # ASP.NET Core 8 Backend API
│   ├── src/
│   │   ├── ForexStockBot.Api/  # Main Web API
│   │   └── ForexStockBot/      # Shared logic & console app
│   ├── sql/                    # Database setup scripts
│   ├── start_and_setup_db.bat  # DB automation
│   ├── ForexStockApi.sln       # Backend solution
│   └── README-BACKEND.md       # Backend documentation
│
└── web/                        # Angular 17 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/     # Feature components (6 panels)
    │   │   ├── services/       # API communication
    │   │   └── models/         # TypeScript DTOs
    │   ├── index.html
    │   └── styles.css
    ├── angular.json            # Angular configuration
    ├── package.json
    └── README.md               # Frontend documentation
```

## Quick Start

### Prerequisites
- **Backend**: .NET 8 SDK, SQL Server
- **Frontend**: Node.js 18+, npm

### Backend Setup

```bash
cd server

# Setup database (Windows)
.\start_and_setup_db.bat

# Or manually run SQL scripts in sql/ directory

# Build and run
dotnet build src/ForexStockBot.Api/ForexStockBot.Api.csproj
dotnet run --project src/ForexStockBot.Api/ForexStockBot.Api.csproj
```

API will be available at `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

```bash
cd web
npm install
ng serve
```

Application will be available at `http://localhost:4200`

## Features

### Backend API
- ✅ **Provider Management** - Multiple market data providers with fallback
- ✅ **Price Series** - Store and query OHLCV data
- ✅ **ML Predictions** - ML-based buy/sell/hold predictions
- ✅ **Trading Advice** - Automated advice generation
- ✅ **Provider State** - Rate limiting and health monitoring
- ✅ **Diagnostics** - System health checks
- ✅ **Mock Mode** - Testing without live data

### Frontend Dashboard
- 📊 **Providers Panel** - View available providers
- 💰 **Price Series Panel** - Query and add price data
- 🎯 **Predictions Panel** - Run predictions and view results
- 💡 **Advice Panel** - Display trading recommendations
- ⚙️ **Provider State Panel** - Manage provider configuration
- 🔍 **Diagnostics Panel** - Run system diagnostics
- 💚 **Health Monitoring** - Real-time API & DB health

## API Endpoints Reference

### Core Endpoints
```
GET    /api/providers                          # List all providers
GET    /api/health                             # API & DB health
POST   /api/mock/toggle?enabled=true|false    # Toggle mock mode
```

### Price Series
```
GET    /api/priceseries/{symbol}              # Get price data
POST   /api/priceseries                       # Add new price data
```

### Predictions & Advice
```
GET    /api/predictionresult/{symbol}         # Get predictions
POST   /api/predictionresult                  # Run prediction
GET    /api/advice/{symbol}                   # Get advice
```

### Provider Management
```
GET    /api/providerstate                     # Get all states
GET    /api/providerstate/{provider}          # Get specific state
POST   /api/providerstate                     # Update state
```

### Diagnostics
```
GET    /api/diagnostics                       # Run diagnostics
```

## Database Configuration

Update the connection string in `server/src/ForexStockBot.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ForexStockDb;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

## CORS Configuration

The backend is pre-configured to accept requests from `http://localhost:4200` (Angular dev server). For production, update the CORS policy in `server/src/ForexStockBot.Api/Program.cs`.

## Development Workflow

1. **Start Backend**:
   ```bash
   cd server
   dotnet run --project src/ForexStockBot.Api/ForexStockBot.Api.csproj
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd web
   npm install  # First time only
   ng serve
   ```

3. **Access Application**:
   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:5000/api`
   - Swagger: `http://localhost:5000/swagger`

## Building for Production

### Backend
```bash
cd server
dotnet build -c Release
dotnet publish -c Release -o out
```

### Frontend
```bash
cd web
ng build --configuration production
```

Production frontend build will be in `web/dist/`

## Project Stack

- **Backend**: ASP.NET Core 8, Entity Framework Core, Microsoft ML.NET
- **Frontend**: Angular 17, TypeScript, RxJS
- **Database**: SQL Server
- **API**: RESTful with Swagger/OpenAPI documentation

## Documentation

- Backend Details: See `server/README-BACKEND.md`
- Frontend Details: See `web/README.md`
- Original Backend README: See `README.md`

## Troubleshooting

### Frontend can't connect to API
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in `server/src/ForexStockBot.Api/Program.cs`
- Verify API service URL in `web/src/app/services/api.service.ts`

### Database connection fails
- Verify SQL Server is running
- Check connection string in `server/src/ForexStockBot.Api/appsettings.json`
- Run `start_and_setup_db.bat` to initialize database

### Angular build errors
- Clear node_modules: `cd web && rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
