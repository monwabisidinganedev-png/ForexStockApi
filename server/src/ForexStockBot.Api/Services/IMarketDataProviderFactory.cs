using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using ForexStockBot.Api.Domain;
using ForexStockBot.Api.Repositories;

namespace ForexStockBot.Api.Services
{
    public interface IMarketDataProviderFactory
    {
        Task<IEnumerable<IMarketDataProvider>> GetProvidersAsync();
    }

    public class MarketDataProviderFactory : IMarketDataProviderFactory
    {
        private readonly IConfiguration _config;
        private readonly IProviderRepository _providerRepository;

        public MarketDataProviderFactory(IConfiguration config, IProviderRepository providerRepository)
        {
            _config = config;
            _providerRepository = providerRepository;
        }

        public async Task<IEnumerable<IMarketDataProvider>> GetProvidersAsync()
        {
            var providers = await _providerRepository.GetAllAsync();
            var marketDataProviders = new List<IMarketDataProvider>();
            foreach (var provider in providers)
            {
                switch (provider.Name)
                {
                    case "MockProvider":
                        marketDataProviders.Add(new MockMarketDataProvider());
                        break;
                    default:
                        marketDataProviders.Add(new RepositoryProviderAdapter(provider.Name));
                        break;
                }
            }
            return marketDataProviders;
        }

        private sealed class RepositoryProviderAdapter : IMarketDataProvider
        {
            public RepositoryProviderAdapter(string name)
            {
                Name = name;
            }

            public string Name { get; }

            public Task<double[]> GetForexSeries(string symbol)
            {
                return Task.FromResult(new double[100]);
            }

            public Task<double[]> GetStockSeries(string symbol)
            {
                return Task.FromResult(new double[100]);
            }

            public Task<ProviderDiagnostic> CheckCredentialsAsync()
            {
                return Task.FromResult(new ProviderDiagnostic
                {
                    Provider = Name,
                    Success = false,
                    Message = "Provider is not configured for local execution."
                });
            }
        }
    }
}
