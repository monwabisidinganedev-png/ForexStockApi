using System;

namespace ForexStockBot.Api.DTOs
{
    public class ProviderStateDto
    {
        public int Id { get; set; }
        public string Provider { get; set; } = string.Empty;
        public DateTime LastChecked { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? StatusCode { get; set; }
        public int? RateLimitRemaining { get; set; }
        public DateTime? RateLimitReset { get; set; }
        public bool FallbackToMock { get; set; }
    }
}
