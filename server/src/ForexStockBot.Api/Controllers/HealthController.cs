using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace ForexStockBot.Api.Controllers
{
    /// <summary>
    /// Health check endpoint for services like database connection.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HealthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Checks the health of the API and its dependencies.
        /// </summary>
        /// <returns>Health status.</returns>
        [HttpGet]
        public IActionResult GetHealth()
        {
            // Example: Check DB connection (update with real connection string and logic)
            var connStr = _configuration.GetConnectionString("DefaultConnection");
            bool dbHealthy = false;
            if (!string.IsNullOrEmpty(connStr))
            {
                try
                {
                    using var conn = new SqlConnection(connStr);
                    conn.Open();
                    dbHealthy = conn.State == System.Data.ConnectionState.Open;
                }
                catch
                {
                    dbHealthy = false;
                }
            }
            return Ok(new { ApiHealthy = true, DatabaseHealthy = dbHealthy });
        }
    }
}
