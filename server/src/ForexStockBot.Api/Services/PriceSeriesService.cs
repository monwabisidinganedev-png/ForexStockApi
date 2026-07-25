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
            
            var priceSeries = data.Select(p => new PriceSeries
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

            await _repo.AddAsync(priceSeries.First());

            return (IEnumerable<PriceSeriesDto>) priceSeries;
        }
    }
}
