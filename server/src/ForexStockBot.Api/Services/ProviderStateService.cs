using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;

namespace ForexStockBot.Api.Services
{
    public interface IProviderStateService
    {
        Task<IEnumerable<ProviderStateDto>> GetAllAsync();
        Task<ProviderStateDto?> GetByProviderAsync(string provider);
        Task AddOrUpdateAsync(ProviderStateDto dto);
    }

    public class ProviderStateService : IProviderStateService
    {
        private readonly IProviderStateRepository _repo;
        public ProviderStateService(IProviderStateRepository repo)
        {
            _repo = repo;
        }
        public async Task<IEnumerable<ProviderStateDto>> GetAllAsync()
        {
            var data = await _repo.GetAllAsync();
            return data.Select(p => new ProviderStateDto
            {
                Id = p.Id,
                Provider = p.Provider,
                LastChecked = p.LastChecked,
                Success = p.Success,
                Message = p.Message,
                StatusCode = p.StatusCode,
                RateLimitRemaining = p.RateLimitRemaining,
                RateLimitReset = p.RateLimitReset,
                FallbackToMock = p.FallbackToMock
            });
        }
        public async Task<ProviderStateDto?> GetByProviderAsync(string provider)
        {
            var p = await _repo.GetByProviderAsync(provider);
            if (p == null) return null;
            return new ProviderStateDto
            {
                Id = p.Id,
                Provider = p.Provider,
                LastChecked = p.LastChecked,
                Success = p.Success,
                Message = p.Message,
                StatusCode = p.StatusCode,
                RateLimitRemaining = p.RateLimitRemaining,
                RateLimitReset = p.RateLimitReset,
                FallbackToMock = p.FallbackToMock
            };
        }
        public async Task AddOrUpdateAsync(ProviderStateDto dto)
        {
            var entity = new ProviderState
            {
                Provider = dto.Provider,
                LastChecked = dto.LastChecked,
                Success = dto.Success,
                Message = dto.Message,
                StatusCode = dto.StatusCode,
                RateLimitRemaining = dto.RateLimitRemaining,
                RateLimitReset = dto.RateLimitReset,
                FallbackToMock = dto.FallbackToMock
            };
            await _repo.AddOrUpdateAsync(entity);
        }
    }
}
