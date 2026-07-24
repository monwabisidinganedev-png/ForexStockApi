
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;

namespace ForexStockBot.Api.Services
{
    /// <summary>
    /// Service for managing market data providers.
    /// </summary>

    public interface IProviderService
    {
        Task<IEnumerable<ProviderDto>> GetAllProvidersAsync();
    }

    public class ProviderService : IProviderService
    {
        private readonly IProviderRepository _providerRepository;
        public ProviderService(IProviderRepository providerRepository)
        {
            _providerRepository = providerRepository;
        }

        public async Task<IEnumerable<ProviderDto>> GetAllProvidersAsync()
        {
            var providers = await _providerRepository.GetAllAsync();
            return providers.Select(p => new ProviderDto { Id = p.Id, Name = p.Name });
        }
    }
}
