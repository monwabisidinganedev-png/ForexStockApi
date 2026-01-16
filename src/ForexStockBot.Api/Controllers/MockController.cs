using Microsoft.AspNetCore.Mvc;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Controls mock mode for the API.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MockController : ControllerBase
    {
        private readonly Services.IMockService _mockService;

        public MockController(Services.IMockService mockService)
        {
            _mockService = mockService;
        }

        /// <summary>
        /// Enable or disable mock mode.
        /// </summary>
        /// <param name="enabled">Set to true to enable mock mode, false to disable.</param>
        /// <returns>Status of mock mode.</returns>
        [HttpPost("toggle")]
        public IActionResult ToggleMock([FromQuery] bool enabled)
        {
            _mockService.SetMockMode(enabled);
            return Ok(new { MockEnabled = _mockService.IsMockEnabled });
        }
    }
}
