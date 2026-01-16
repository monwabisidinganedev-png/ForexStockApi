using System.Collections.Generic;
using System.Threading.Tasks;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Endpoints for viewing and updating provider state, rate limits, and fallback status.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProviderStateController : ControllerBase
    {
        private readonly IProviderStateService _service;
        public ProviderStateController(IProviderStateService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all provider states.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProviderStateDto>>> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        /// <summary>
        /// Get state for a specific provider.
        /// </summary>
        [HttpGet("{provider}")]
        public async Task<ActionResult<ProviderStateDto?>> GetByProvider(string provider)
        {
            var data = await _service.GetByProviderAsync(provider);
            if (data == null) return NotFound();
            return Ok(data);
        }

        /// <summary>
        /// Update provider state (rate limits, fallback, etc).
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddOrUpdate([FromBody] ProviderStateDto dto)
        {
            await _service.AddOrUpdateAsync(dto);
            return Ok();
        }
    }
}
