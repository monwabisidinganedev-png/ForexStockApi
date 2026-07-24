using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace ForexStockBot.Api.Domain
{
    public class ModelTrainer
    {
        private readonly MLContext _mlContext;

        public ModelTrainer()
        {
            _mlContext = new MLContext(seed: 1);
        }

        public ITransformer TrainModel(List<PriceData> trainingData)
        {
            if (trainingData.Count < 10)
                return null; // Not enough data

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);

            var pipeline = _mlContext.Transforms
                .Conversion.MapValueToKey("Label")
                .Append(_mlContext.Transforms.Concatenate("Features", "Close", "Previous", "MA5", "MA20"))
                .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy(labelColumnName: "Label"))
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            var model = pipeline.Fit(dataView);
            return model;
        }

        public ITransformer TrainModelWithValidation(List<PriceData> trainingData)
        {
            if (trainingData.Count < 20)
                return null;

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);
            var split = _mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);

            var pipeline = _mlContext.Transforms
                .Conversion.MapValueToKey("Label")
                .Append(_mlContext.Transforms.Concatenate("Features", "Close", "Previous", "MA5", "MA20"))
                .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy(labelColumnName: "Label"))
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            var model = pipeline.Fit(split.TrainSet);
            var predictions = model.Transform(split.TestSet);
            var metrics = _mlContext.MulticlassClassification.Evaluate(predictions, labelColumnName: "Label");

            Console.WriteLine($"[ML] Macro Accuracy: {metrics.MacroAccuracy:P2}, Micro Accuracy: {metrics.MicroAccuracy:P2}");

            return model;
        }

        public MLContext GetContext() => _mlContext;
    }
}
