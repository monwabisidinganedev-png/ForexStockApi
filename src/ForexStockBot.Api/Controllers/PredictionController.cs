using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Provides endpoints for running predictions and advice.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly Services.IPredictionService _predictionService;

        public PredictionController(Services.IPredictionService predictionService)
        {
            _predictionService = predictionService;
        }

        /// <summary>
        /// Run prediction or advice for a given provider or all providers.
        /// </summary>
        /// <param name="provider">Optional: The provider to use. If not specified, runs for all.</param>
        /// <returns>Prediction or advice result.</returns>
        [HttpPost]
        public async Task<IActionResult> RunPrediction([FromQuery] string symbol, [FromQuery] string provider)
        {
            var result = await _predictionService.RunPredictionAsync(symbol, provider);
            return Ok(new { Result = result });
        }
    }
}
