
using System.Linq;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;
using ForexStockBot.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<ForexStockDbContext>(options =>
        options.UseInMemoryDatabase("ForexStockDb"));
}
else
{
    builder.Services.AddDbContext<ForexStockDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

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



app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ForexStockDbContext>();
    db.Database.EnsureCreated();

    if (!db.Providers.Any())
    {
        db.Providers.AddRange(
            new Provider { Name = "MockProvider" },
            new Provider { Name = "TwelveData" },
            new Provider { Name = "Finnhub" });
    }

    if (!db.ProviderStates.Any())
    {
        db.ProviderStates.AddRange(
            new ProviderState { Provider = "MockProvider", Success = true, Message = "Seeded mock provider", FallbackToMock = true },
            new ProviderState { Provider = "TwelveData", Success = false, Message = "Not configured", FallbackToMock = true });
    }

    db.SaveChanges();
}

app.Run();

public partial class Program { }
