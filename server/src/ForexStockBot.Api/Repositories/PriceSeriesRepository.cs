using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Repositories
{
    public class PriceSeriesRepository : IPriceSeriesRepository
    {
        private readonly ForexStockDbContext _context;
        public PriceSeriesRepository(ForexStockDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<PriceSeries>> GetBySymbolAsync(string symbol)
        {
            return await _context.PriceSeries.Where(p => p.Symbol == symbol).ToListAsync();
        }
        public async Task AddAsync(PriceSeries series)
        {
            _context.PriceSeries.Add(series);
            await _context.SaveChangesAsync();
        }
    }
}
