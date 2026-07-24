using Microsoft.ML.Data;

namespace ForexStockBot.Api.Domain
{
    public class PricePrediction
    {
        [ColumnName("PredictedLabel")] public float PredictedLabel { get; set; }
        public float[] Score { get; set; } = new float[3];
    }
}