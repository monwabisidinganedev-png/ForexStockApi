using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;

namespace ForexStockBot.Api.Services
{
    public interface IPriceSeriesService
    {
        Task<IEnumerable<PriceSeriesDto>> GetBySymbolAsync(string symbol);
        Task AddAsync(PriceSeriesDto dto);
    }

    public class PriceSeriesService : IPriceSeriesService
    {
        private readonly IPriceSeriesRepository _repo;
        public PriceSeriesService(IPriceSeriesRepository repo)
        {
            _repo = repo;
        }
        public async Task<IEnumerable<PriceSeriesDto>> GetBySymbolAsync(string symbol)
        {
            var data = await _repo.GetBySymbolAsync(symbol);
            return data.Select(p => new PriceSeriesDto
            {
                Id = p.Id,
                Symbol = p.Symbol,
                Type = p.Type,
                Timestamp = p.Timestamp,
                Open = p.Open,
                High = p.High,
                Low = p.Low,
                Close = p.Close,
                Volume = p.Volume
            });
        }
        public async Task AddAsync(PriceSeriesDto dto)
        {
            var entity = new PriceSeries
            {
                Symbol = dto.Symbol,
                Type = dto.Type,
                Timestamp = dto.Timestamp,
                Open = dto.Open,
                High = dto.High,
                Low = dto.Low,
                Close = dto.Close,
                Volume = dto.Volume
            };
            await _repo.AddAsync(entity);
        }
    }
}
