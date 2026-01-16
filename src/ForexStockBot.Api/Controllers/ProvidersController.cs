using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Provides endpoints to retrieve available market data providers.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProvidersController : ControllerBase
    {
        private readonly Services.IProviderService _providerService;

        public ProvidersController(Services.IProviderService providerService)
        {
            _providerService = providerService;
        }

        /// <summary>
        /// Get all available market data providers.
        /// </summary>
        /// <returns>List of providers.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllProviders()
        {
            var providers = await _providerService.GetAllProvidersAsync();
            return Ok(providers);
        }
    }
}
