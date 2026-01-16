using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Repositories
{
    public class PredictionResultRepository : IPredictionResultRepository
    {
        private readonly ForexStockDbContext _context;
        public PredictionResultRepository(ForexStockDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<PredictionResult>> GetBySymbolAsync(string symbol)
        {
            return await _context.PredictionResults.Where(p => p.Symbol == symbol).ToListAsync();
        }
        public async Task AddAsync(PredictionResult result)
        {
            _context.PredictionResults.Add(result);
            await _context.SaveChangesAsync();
        }
    }
}
