using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;

namespace ForexStockBot.Api.Repositories
{
    public interface IAdviceResultRepository
    {
        Task<IEnumerable<AdviceResult>> GetBySymbolAsync(string symbol);
        Task AddAsync(AdviceResult result);
    }
}
