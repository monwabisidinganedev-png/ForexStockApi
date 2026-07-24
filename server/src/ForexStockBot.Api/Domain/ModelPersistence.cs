using System;
using System.IO;
using Microsoft.ML;

namespace ForexStockBot.Api.Domain
{
    public class ModelPersistence
    {
        private readonly MLContext _mlContext;
        private readonly string _modelsDir;

        public ModelPersistence(MLContext mlContext, string modelsDir = "Models")
        {
            _mlContext = mlContext;
            _modelsDir = modelsDir;
            if (!Directory.Exists(_modelsDir))
                Directory.CreateDirectory(_modelsDir);
        }

        public void SaveModel(ITransformer model, string symbol)
        {
            var path = Path.Combine(_modelsDir, $"{symbol}.zip");
            _mlContext.Model.Save(model, null, path);
            Console.WriteLine($"[Persistence] Model saved for {symbol} at {path}");
        }

        public ITransformer LoadModel(string symbol)
        {
            var path = Path.Combine(_modelsDir, $"{symbol}.zip");
            if (!File.Exists(path))
            {
                Console.WriteLine($"[Persistence] No model found for {symbol}");
                return null;
            }

            using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
            var model = _mlContext.Model.Load(stream, out var inputSchema);
            Console.WriteLine($"[Persistence] Model loaded for {symbol}");
            return model;
        }
    }
}
