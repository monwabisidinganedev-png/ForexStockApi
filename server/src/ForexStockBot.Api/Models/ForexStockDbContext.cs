
using Microsoft.EntityFrameworkCore;

namespace ForexStockBot.Api.Models
{
    public class ForexStockDbContext : DbContext
    {
        public ForexStockDbContext(DbContextOptions<ForexStockDbContext> options) : base(options) { }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<PriceSeries> PriceSeries { get; set; }
        public DbSet<AdviceResult> AdviceResults { get; set; }
        public DbSet<ProviderState> ProviderStates { get; set; }
        public DbSet<PredictionResult> PredictionResults { get; set; }
    }
}
