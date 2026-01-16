using ForexStockBot;
using ForexStockBot.Api.Domain;

namespace ForexStockBot.Api.Services.ML
{
    public class AdvisorAdapter
    {
        private readonly Advisor _advisor;
        public AdvisorAdapter()
        {
            _advisor = new Advisor();
        }
        public Advice GetAdvice(Prediction prediction)
        {
            return _advisor.GetAdvice(prediction);
        }
    }
}
