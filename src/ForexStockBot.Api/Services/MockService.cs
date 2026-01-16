namespace ForexStockBot.Api.Services
{
    /// <summary>
    /// Service for managing mock mode state.
    /// </summary>
    public interface IMockService
    {
        bool IsMockEnabled { get; }
        void SetMockMode(bool enabled);
    }

    public class MockService : IMockService
    {
        private bool _isMockEnabled;
        public bool IsMockEnabled => _isMockEnabled;
        public void SetMockMode(bool enabled) => _isMockEnabled = enabled;
    }
}
