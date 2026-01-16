using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot;
using ForexStockBot;
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
                    // Add other providers as needed
                    default:
                        marketDataProviders.Add(provider);
                        break;
                }
            }
            return marketDataProviders;
        }
    }
}
