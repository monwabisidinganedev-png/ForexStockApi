namespace ForexStockBot.Api.Domain
{
    public class Advice
    {
        public string Decision { get; set; } = "ignore";
        public string Reason { get; set; } = "";
    }

    public class Advisor
    {
        public Advice GetAdvice(Prediction prediction)
        {
            if (prediction.Label == "insufficient") return new Advice { Decision = "ignore", Reason = "Not enough data" };

            if (prediction.Label == "buy")
            {
                return new Advice { Decision = "buy", Reason = $"Model score {prediction.Score:F2}: positive momentum and MA crossover" };
            }
            else if (prediction.Label == "sell")
            {
                return new Advice { Decision = "sell", Reason = $"Model score {prediction.Score:F2}: negative momentum and MA crossover" };
            }

            return new Advice { Decision = "hold", Reason = $"Model score {prediction.Score:F2}: neutral" };
        }
    }
}
