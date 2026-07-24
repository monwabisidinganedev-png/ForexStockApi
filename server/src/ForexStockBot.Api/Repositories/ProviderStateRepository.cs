using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Repositories
{
    public class ProviderStateRepository : IProviderStateRepository
    {
        private readonly ForexStockDbContext _context;
        public ProviderStateRepository(ForexStockDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ProviderState>> GetAllAsync()
        {
            return await _context.ProviderStates.ToListAsync();
        }
        public async Task<ProviderState?> GetByProviderAsync(string provider)
        {
            return await _context.ProviderStates.FirstOrDefaultAsync(p => p.Provider == provider);
        }
        public async Task AddOrUpdateAsync(ProviderState state)
        {
            var existing = await _context.ProviderStates.FirstOrDefaultAsync(p => p.Provider == state.Provider);
            if (existing == null)
            {
                _context.ProviderStates.Add(state);
            }
            else
            {
                existing.LastChecked = state.LastChecked;
                existing.Success = state.Success;
                existing.Message = state.Message;
                existing.StatusCode = state.StatusCode;
                existing.RateLimitRemaining = state.RateLimitRemaining;
                existing.RateLimitReset = state.RateLimitReset;
                existing.FallbackToMock = state.FallbackToMock;
            }
            await _context.SaveChangesAsync();
        }
    }
}
