namespace ForexStockBot.Api.Models
{
    public class PriceSeries
    {
        public int Id { get; set; }
        public int SymbolId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Forex or Stock
        public DateTime Timestamp { get; set; }
        public double Open { get; set; }
        public double High { get; set; }
        public double Low { get; set; }
        public double Close { get; set; }
        public double Volume { get; set; }
    }
}
