using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.ML;

namespace ForexStockBot.Api.Domain
{
    public class MLPredictor
    {
        private readonly ModelTrainer _trainer;
        private readonly ModelPersistence _persistence;
        private readonly Dictionary<string, ITransformer> _models;
        private readonly Dictionary<string, List<PriceData>> _trainingBuffer;
        private readonly int _bufferSize = 50;

        public MLPredictor()
        {
            _trainer = new ModelTrainer();
            _persistence = new ModelPersistence(_trainer.GetContext());
            _models = new Dictionary<string, ITransformer>();
            _trainingBuffer = new Dictionary<string, List<PriceData>>();
        }

        public Prediction Predict(double[] series, string symbol = "default")
        {
            if (series == null || series.Length < 20)
                return new Prediction { Score = 0, Label = "insufficient" };

            var n = series.Length;
            var last = series[n - 1];
            var prev = series[n - 2];

            var maShort = series.Skip(Math.Max(0, n - 5)).Average();
            var maLong = series.Skip(Math.Max(0, n - 20)).Average();

            var features = new PriceData
            {
                Close = (float)last,
                Previous = (float)prev,
                MA5 = (float)maShort,
                MA20 = (float)maLong
            };

            // Try ML model first, fall back to heuristic
            if (_models.ContainsKey(symbol) && _models[symbol] != null)
            {
                return PredictWithModel(symbol, features);
            }

            return PredictHeuristic(series, symbol, features);
        }

        private Prediction PredictWithModel(string symbol, PriceData features)
        {
            var engine = _trainer.GetContext().Model.CreatePredictionEngine<PriceData, PricePrediction>(_models[symbol]);
            var prediction = engine.Predict(features);

            var label = (int)prediction.PredictedLabel;
            var labelStr = label == 0 ? "sell" : label == 1 ? "hold" : "buy";

            var scores = prediction.Score ?? Array.Empty<float>();
            double score;
            if (scores.Length >= 3)
                score = (scores[2] - scores[0]) * 100; // buy vs sell confidence
            else if (scores.Length == 2)
                score = (scores[1] - scores[0]) * 100;
            else
                score = 0;

            return new Prediction { Score = score, Label = labelStr, Scores = prediction.Score };
        }

        private Prediction PredictHeuristic(double[] series, string symbol, PriceData features)
        {
            var n = series.Length;
            var momentum = (features.Close - features.Previous) / features.Previous;
            var score = momentum * 100 + (features.MA5 - features.MA20) / features.MA20 * 100;

            var label = score > 0.1 ? "buy" : score < -0.1 ? "sell" : "hold";

            // Add to training buffer for future model retraining
            var labelVal = label == "buy" ? 2f : label == "sell" ? 0f : 1f;
            var trainingPoint = new PriceData
            {
                Close = features.Close,
                Previous = features.Previous,
                MA5 = features.MA5,
                MA20 = features.MA20,
                Label = labelVal
            };

            if (!_trainingBuffer.ContainsKey(symbol))
                _trainingBuffer[symbol] = new List<PriceData>();

            _trainingBuffer[symbol].Add(trainingPoint);

            // Retrain if buffer is full (self-learning)
            if (_trainingBuffer[symbol].Count >= _bufferSize)
            {
                Console.WriteLine($"[ML] Retraining model for {symbol}...");
                _models[symbol] = _trainer.TrainModelWithValidation(_trainingBuffer[symbol]);
                if (_models[symbol] != null)
                    _persistence.SaveModel(_models[symbol], symbol);
                _trainingBuffer[symbol].Clear();
            }

            return new Prediction { Score = score, Label = label, Scores = new float[3] { (float)(score < -0.1 ? 1 : 0), 0.5f, (float)(score > 0.1 ? 1 : 0) } };
        }

        public void LoadOrInitializeModel(string symbol, List<PriceData> historicalData = null)
        {
            var loaded = _persistence.LoadModel(symbol);
            if (loaded != null)
            {
                _models[symbol] = loaded;
                return;
            }

            // If no saved model and we have historical data, train from scratch
            if (historicalData != null && historicalData.Count >= 10)
            {
                Console.WriteLine($"[ML] Training new model for {symbol}...");
                _models[symbol] = _trainer.TrainModelWithValidation(historicalData);
                if (_models[symbol] != null)
                    _persistence.SaveModel(_models[symbol], symbol);
            }
        }
    }
}