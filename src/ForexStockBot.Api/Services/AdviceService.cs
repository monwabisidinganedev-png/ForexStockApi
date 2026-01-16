using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Domain;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;

namespace ForexStockBot.Api.Services
{
    public interface IAdviceService
    {
        Task<IEnumerable<AdviceResultDto>> GetBySymbolAsync(string symbol);
        Task<AdviceResultDto> AddAdviceAsync(AdviceResultDto dto);
    }

    public class AdviceService : IAdviceService
    {
        private readonly IAdviceResultRepository _repo;
        public AdviceService(IAdviceResultRepository repo)
        {
            _repo = repo;
        }
        public async Task<IEnumerable<AdviceResultDto>> GetBySymbolAsync(string symbol)
        {
            var data = await _repo.GetBySymbolAsync(symbol);
            return data.Select(a => new AdviceResultDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Decision = a.Decision,
                Reason = a.Reason,
                Score = a.Score,
                Label = a.Label,
                Provider = a.Provider,
                Timestamp = a.Timestamp
            });
        }
        public async Task<AdviceResultDto> AddAdviceAsync(AdviceResultDto dto)
        {
            var entity = new AdviceResult
            {
                Symbol = dto.Symbol,
                Decision = dto.Decision,
                Reason = dto.Reason,
                Score = dto.Score,
                Label = dto.Label,
                Provider = dto.Provider,
                Timestamp = dto.Timestamp
            };
            await _repo.AddAsync(entity);
            dto.Id = entity.Id;
            return dto;
        }
    }
}
