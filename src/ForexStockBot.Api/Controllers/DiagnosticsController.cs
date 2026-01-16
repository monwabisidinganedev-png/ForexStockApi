using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Provides diagnostics endpoints for the API and providers.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly Services.IDiagnosticsService _diagnosticsService;

        public DiagnosticsController(Services.IDiagnosticsService diagnosticsService)
        {
            _diagnosticsService = diagnosticsService;
        }

        /// <summary>
        /// Run diagnostics for all providers and services.
        /// </summary>
        /// <returns>Diagnostics result.</returns>
        [HttpGet]
        public async Task<IActionResult> RunDiagnostics()
        {
            var result = await _diagnosticsService.RunDiagnosticsAsync();
            return Ok(result);
        }
    }
}
