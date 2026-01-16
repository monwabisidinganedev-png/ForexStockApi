using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;

namespace ForexStockBot.Api.Repositories
{
    public interface IProviderRepository
    {
        Task<IEnumerable<Provider>> GetAllAsync();
        // Add more methods as needed
    }
}
