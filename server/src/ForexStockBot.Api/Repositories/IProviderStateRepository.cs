using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.Models;

namespace ForexStockBot.Api.Repositories
{
    public interface IProviderStateRepository
    {
        Task<IEnumerable<ProviderState>> GetAllAsync();
        Task<ProviderState?> GetByProviderAsync(string provider);
        Task AddOrUpdateAsync(ProviderState state);
    }
}
