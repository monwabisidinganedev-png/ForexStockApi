using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Endpoints for viewing and running predictions.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PredictionResultController : ControllerBase
    {
        private readonly IPredictionService _service;
        public PredictionResultController(IPredictionService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all prediction results for a symbol.
        /// </summary>
        [HttpGet("{symbol}")]
        public async Task<ActionResult<IEnumerable<PredictionResultDto>>> GetBySymbol(string symbol)
        {
            var data = await _service.GetBySymbolAsync(symbol);
            return Ok(data);
        }

        /// <summary>
        /// Run a prediction for a symbol and provider.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PredictionResultDto>> RunPrediction([FromQuery] string symbol, [FromQuery] string provider)
        {
            var result = await _service.RunPredictionAsync(symbol, provider);
            return Ok(result);
        }
    }
}
