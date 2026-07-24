using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.ML;
using ForexStockBot;
using ForexStockBot.Api.Domain;

namespace ForexStockBot.Api.Services.ML
{
    public class MLPredictorAdapter
    {
        private readonly MLPredictor _predictor;
        public MLPredictorAdapter()
        {
            _predictor = new MLPredictor();
        }
        public Prediction Predict(double[] series, string symbol = "default")
        {
            return _predictor.Predict(series, symbol);
        }
    }
}
