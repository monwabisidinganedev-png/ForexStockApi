namespace ForexStockBot.Api.Models
{
    /// <summary>
    /// Represents a market data provider.
    /// </summary>
    public class Provider
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
