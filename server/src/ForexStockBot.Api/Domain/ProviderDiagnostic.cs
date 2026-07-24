using System.Collections.Generic;

namespace ForexStockBot.Api.Domain
{
    public class ProviderDiagnostic
    {
        public string Provider { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? StatusCode { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
    }
}
