using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;

namespace ForexStockBot.Api.Repositories
{
    public interface IPredictionResultRepository
    {
        Task<IEnumerable<PredictionResult>> GetBySymbolAsync(string symbol);
        Task AddAsync(PredictionResult result);
        // Add more methods as needed
    }
}
