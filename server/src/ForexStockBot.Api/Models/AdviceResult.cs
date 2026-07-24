namespace ForexStockBot.Api.Models
{
    public class AdviceResult
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Decision { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public double Score { get; set; }
        public string Label { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
