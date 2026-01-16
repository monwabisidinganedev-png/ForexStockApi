using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Services;
using ForexStockBot;
using ForexStockBot.Api.Domain;

namespace ForexStockBot.Api.Services
{
    /// <summary>
    /// Service for running diagnostics.
    /// </summary>
    public interface IDiagnosticsService
    {
        Task<IEnumerable<ProviderDiagnostic>> RunDiagnosticsAsync();
    }

    public class DiagnosticsService : IDiagnosticsService
    {
        private readonly IMarketDataProviderFactory _providerFactory;
        public DiagnosticsService(IMarketDataProviderFactory providerFactory)
        {
            _providerFactory = providerFactory;
        }

        public async Task<IEnumerable<ProviderDiagnostic>> RunDiagnosticsAsync()
        {
            var providers = await _providerFactory.GetProvidersAsync();
            var diagnostics = new List<ProviderDiagnostic>();
            foreach (var provider in providers)
            {
                var diag = await provider.CheckCredentialsAsync();
                diagnostics.Add(diag);
            }
            return diagnostics;
        }
    }
}
