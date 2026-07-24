using System.Threading.Tasks;

namespace ForexStockBot.Api.Domain
{
    public interface IMarketDataProvider
    {
        string Name { get; }
        Task<double[]> GetForexSeries(string symbol);
        Task<double[]> GetStockSeries(string symbol);
        Task<ProviderDiagnostic> CheckCredentialsAsync();
    }
}
