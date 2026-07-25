using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Endpoints for viewing and adding price series data.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PriceSeriesController : ControllerBase
    {
        private readonly IPriceSeriesService _service;
        public PriceSeriesController(IPriceSeriesService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all price series for a symbol.
        /// </summary>
        [HttpGet("{symbol}")]
        public async Task<ActionResult<IEnumerable<PriceSeriesDto>>> GetBySymbol(string symbol)
        {
            var data = await _service.GetBySymbolAsync(symbol);
            return Ok(data);
        }
    }
}
