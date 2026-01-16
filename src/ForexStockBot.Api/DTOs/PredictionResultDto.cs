namespace ForexStockBot.Api.DTOs
{
    public class PredictionResultDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public double Score { get; set; }
        public DateTime Timestamp { get; set; }
        public string Provider { get; set; } = string.Empty;
    }
}
