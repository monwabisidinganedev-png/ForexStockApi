using System;
using System.Threading.Tasks;
using ForexStockBot.Api.Domain;

namespace ForexStockBot.Api.Services
{
    public class MockMarketDataProvider : IMarketDataProvider
    {
        public string Name => "MockProvider";

        public Task<double[]> GetForexSeries(string symbol)
        {
            // Return mock data - random prices for testing
            var random = new Random();
            var data = new double[100];
            for (int i = 0; i < data.Length; i++)
            {
                data[i] = 1.0 + random.NextDouble() * 0.1; // Random values around 1.0
            }
            return Task.FromResult(data);
        }

        public Task<double[]> GetStockSeries(string symbol)
        {
            // Return mock data - random prices for testing
            var random = new Random();
            var data = new double[100];
            for (int i = 0; i < data.Length; i++)
            {
                data[i] = 100.0 + random.NextDouble() * 50.0; // Random values around 100.0
            }
            return Task.FromResult(data);
        }

        public Task<ProviderDiagnostic> CheckCredentialsAsync()
        {
            return Task.FromResult(new ProviderDiagnostic
            {
                Provider = "MockProvider",
                Success = true,
                Message = "Mock provider is always healthy"
            });
        }
    }
}
