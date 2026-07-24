# Forex Stock API - Angular Frontend

A modern, responsive Angular frontend for the ForexStockApi backend.

## Features

- **Provider Management**: View all available market data providers
- **Price Series Management**: Query and add price series data
- **Predictions**: Run ML predictions and view prediction results
- **Trading Advice**: Get buy/sell/hold advice based on predictions
- **Provider State Monitoring**: Track provider status, rate limits, and fallback states
- **System Diagnostics**: Run comprehensive system diagnostics
- **Health Monitoring**: Check API and database health status
- **Mock Mode**: Toggle mock mode for testing

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

## Installation

```bash
cd web
npm install
```

## Development

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any of the source files.

## Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## API Configuration

Update the API URL in `src/app/services/api.service.ts` if your backend is running on a different host/port:

```typescript
private apiUrl = 'http://localhost:5000/api';
```

## Structure

```
web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          # Main dashboard component
│   │   │   ├── providers-panel/    # Providers panel
│   │   │   ├── price-series-panel/ # Price series panel
│   │   │   ├── predictions-panel/  # Predictions panel
│   │   │   ├── advice-panel/       # Advice panel
│   │   │   ├── provider-state-panel/  # Provider state panel
│   │   │   └── diagnostics-panel/  # Diagnostics panel
│   │   ├── services/
│   │   │   └── api.service.ts      # API communication service
│   │   ├── models/
│   │   │   └── index.ts            # TypeScript DTOs
│   │   ├── app.component.ts        # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Routes
│   ├── index.html
│   ├── main.ts
│   └── styles.css                  # Global styles
│
├── package.json
├── tsconfig.json
├── angular.json
└── README.md
```

## Available Panels

### Providers Panel
- Display all available market data providers
- Refresh provider list

### Price Series Panel
- Query price series by symbol
- Add new price series entries
- View OHLCV data in table format

### Predictions Panel
- Query predictions by symbol
- Run new predictions with symbol and provider selection
- View prediction results with buy/sell/hold labels
- Color-coded result badges

### Advice Panel
- Query trading advice by symbol
- View detailed advice with reasons
- Decision cards with color coding (Buy, Sell, Hold, Ignore)

### Provider State Panel
- View all provider states
- Monitor rate limits and fallback status
- Edit provider state configurations
- Update provider health and message

### Diagnostics Panel
- Run comprehensive system diagnostics
- View diagnostics results in JSON format

## Error Handling

All components include comprehensive error handling with user-friendly error messages displayed when API calls fail.

## CORS Configuration

Ensure your backend API has CORS enabled for `http://localhost:4200`:

In your `.NET` startup configuration, add:

```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowAngularApp");
```

## License

MIT
