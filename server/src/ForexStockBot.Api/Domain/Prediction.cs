namespace ForexStockBot.Api.Domain
{
    public class Prediction
    {
        public double Score { get; set; }
        public string Label { get; set; } = "neutral";
        public float[] Scores { get; set; } = new float[3];
    }
}
