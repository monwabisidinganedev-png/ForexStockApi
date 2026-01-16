using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;

namespace ForexStockBot.Api.Repositories
{
    public interface IPriceSeriesRepository
    {
        Task<IEnumerable<PriceSeries>> GetBySymbolAsync(string symbol);
        Task AddAsync(PriceSeries series);
        // Add more methods as needed
    }
}
