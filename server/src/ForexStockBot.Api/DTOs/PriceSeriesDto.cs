namespace ForexStockBot.Api.DTOs
{
    public class PriceSeriesDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double Open { get; set; }
        public double High { get; set; }
        public double Low { get; set; }
        public double Close { get; set; }
        public double Volume { get; set; }
    }
}
