using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Endpoints for viewing and adding advice results.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AdviceController : ControllerBase
    {
        private readonly IAdviceService _service;
        public AdviceController(IAdviceService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all advice results for a symbol.
        /// </summary>
        [HttpGet("{symbol}")]
        public async Task<ActionResult<IEnumerable<AdviceResultDto>>> GetBySymbol(string symbol)
        {
            var data = await _service.GetBySymbolAsync(symbol);
            return Ok(data);
        }

        /// <summary>
        /// Add a new advice result.
        /// </summary>
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost]
        public async Task<ActionResult<AdviceResultDto>> AddAdvice([FromBody] AdviceResultDto dto)
        {
            var result = await _service.AddAdviceAsync(dto);
            return Ok(result);
        }
    }
}
