using Microsoft.ML.Data;

namespace ForexStockBot.Api.Domain
{
    public class PriceData
    {
        [LoadColumn(0)] public float Close { get; set; }
        [LoadColumn(1)] public float Previous { get; set; }
        [LoadColumn(2)] public float MA5 { get; set; }
        [LoadColumn(3)] public float MA20 { get; set; }
        [LoadColumn(4)] public float Label { get; set; } // 0=sell, 1=hold, 2=buy
    }
}