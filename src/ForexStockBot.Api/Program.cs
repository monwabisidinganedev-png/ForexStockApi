
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;
using ForexStockBot.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Register DbContext with SQL Server (update connection string as needed)
builder.Services.AddDbContext<ForexStockDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<IProviderRepository, ProviderRepository>();
builder.Services.AddScoped<IAdviceService, AdviceService>();
builder.Services.AddScoped<IAdviceResultRepository, AdviceResultRepository>();
builder.Services.AddScoped<IProviderStateService, ProviderStateService>();
builder.Services.AddScoped<IProviderStateRepository, ProviderStateRepository>();
builder.Services.AddScoped<IPredictionService, PredictionService>(sp =>
    new ForexStockBot.Api.Services.PredictionService(
        sp.GetRequiredService<ForexStockBot.Api.Repositories.IPredictionResultRepository>(),
        sp.GetRequiredService<ForexStockBot.Api.Repositories.IAdviceResultRepository>(),
        sp.GetRequiredService<ForexStockBot.Api.Services.ML.MLPredictorAdapter>(),
        sp.GetRequiredService<ForexStockBot.Api.Services.ML.AdvisorAdapter>(),
        sp.GetRequiredService<ForexStockBot.Api.Services.IMarketDataProviderFactory>()
    ));
builder.Services.AddScoped<IPredictionResultRepository, PredictionResultRepository>();
builder.Services.AddScoped<IPriceSeriesService, PriceSeriesService>();
builder.Services.AddScoped<IPriceSeriesRepository, PriceSeriesRepository>();

// Register custom services
builder.Services.AddSingleton<ForexStockBot.Api.Services.IMockService, ForexStockBot.Api.Services.MockService>();
builder.Services.AddScoped<ForexStockBot.Api.Services.IProviderService, ForexStockBot.Api.Services.ProviderService>();
builder.Services.AddScoped<ForexStockBot.Api.Services.IDiagnosticsService, ForexStockBot.Api.Services.DiagnosticsService>();
builder.Services.AddSingleton<ForexStockBot.Api.Services.ML.MLPredictorAdapter>();
builder.Services.AddSingleton<ForexStockBot.Api.Services.ML.AdvisorAdapter>();
builder.Services.AddScoped<ForexStockBot.Api.Services.IMarketDataProviderFactory, ForexStockBot.Api.Services.MarketDataProviderFactory>();
builder.Services.AddScoped<ForexStockBot.Api.Services.IPredictionService, ForexStockBot.Api.Services.PredictionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthorization();
app.MapControllers();



app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
