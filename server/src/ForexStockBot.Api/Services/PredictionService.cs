using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForexStockBot.Api.Domain;
using ForexStockBot.Api.DTOs;
using ForexStockBot.Api.Models;
using ForexStockBot.Api.Repositories;
using ForexStockBot.Api.Services.ML;

namespace ForexStockBot.Api.Services
{
    public interface IPredictionService
    {
        Task<IEnumerable<PredictionResultDto>> GetBySymbolAsync(string symbol);
        Task<PredictionResultDto> RunPredictionAsync(string symbol, string provider);
    }

    public class PredictionService : IPredictionService
    {
        private readonly IPredictionResultRepository _repo;
        private readonly IAdviceResultRepository _adviceRepo;
        private readonly MLPredictorAdapter _mlPredictor;
        private readonly AdvisorAdapter _advisor;
        private readonly IMarketDataProviderFactory _providerFactory;

        public PredictionService(
            IPredictionResultRepository repo,
            IAdviceResultRepository adviceRepo,
            MLPredictorAdapter mlPredictor,
            AdvisorAdapter advisor,
            IMarketDataProviderFactory providerFactory)
        {
            _repo = repo;
            _adviceRepo = adviceRepo;
            _mlPredictor = mlPredictor;
            _advisor = advisor;
            _providerFactory = providerFactory;
        }

        public async Task<IEnumerable<PredictionResultDto>> GetBySymbolAsync(string symbol)
        {
            var data = await _repo.GetBySymbolAsync(symbol);
            return data.Select(p => new PredictionResultDto
            {
                Id = p.Id,
                Symbol = p.Symbol,
                Label = p.Label,
                Score = p.Score,
                Timestamp = p.Timestamp,
                Provider = p.Provider
            });
        }

        public async Task<PredictionResultDto> RunPredictionAsync(string symbol, string provider)
        {
            var providers = await _providerFactory.GetProvidersAsync();
            var providerInstance = providers.FirstOrDefault(p => p.Name.Equals(provider, StringComparison.OrdinalIgnoreCase));
            if (providerInstance == null)
                throw new Exception($"Provider '{provider}' not found.");

            var series = await providerInstance.GetForexSeries(symbol);
            var prediction = _mlPredictor.Predict(series, symbol);
            var advice = _advisor.GetAdvice(prediction);

            var result = new PredictionResult
            {
                Symbol = symbol,
                Label = prediction.Label,
                Score = prediction.Score,
                Timestamp = DateTime.UtcNow,
                Provider = provider
            };
            await _repo.AddAsync(result);

            // Store advice as a side product
            var adviceResult = new AdviceResult
            {
                Symbol = symbol,
                Decision = advice.Decision,
                Reason = advice.Reason,
                Score = prediction.Score,
                Label = prediction.Label,
                Provider = provider,
                Timestamp = result.Timestamp
            };
            await _adviceRepo.AddAsync(adviceResult);

            return new PredictionResultDto
            {
                Id = result.Id,
                Symbol = result.Symbol,
                Label = result.Label,
                Score = result.Score,
                Timestamp = result.Timestamp,
                Provider = result.Provider
            };
        }
    }
}
