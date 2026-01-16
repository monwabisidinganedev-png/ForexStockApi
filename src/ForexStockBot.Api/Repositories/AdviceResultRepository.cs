using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Repositories
{
    public class AdviceResultRepository : IAdviceResultRepository
    {
        private readonly ForexStockDbContext _context;
        public AdviceResultRepository(ForexStockDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<AdviceResult>> GetBySymbolAsync(string symbol)
        {
            return await _context.AdviceResults.Where(a => a.Symbol == symbol).ToListAsync();
        }
        public async Task AddAsync(AdviceResult result)
        {
            _context.AdviceResults.Add(result);
            await _context.SaveChangesAsync();
        }
    }
}
