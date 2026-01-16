using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Repositories
{
    public class ProviderRepository : IProviderRepository
    {
        private readonly ForexStockDbContext _context;
        public ProviderRepository(ForexStockDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Provider>> GetAllAsync()
        {
            return await _context.Providers.ToListAsync();
        }
    }
}
