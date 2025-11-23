# Load Testing

This directory contains load tests for the Open2E application.

## Local Ollama Evaluation Load Test

Tests the local Ollama evaluation endpoint (`http://localhost:11434/api/chat`) that is used when running in offline mode.

### Prerequisites

1. **Install k6**:

   - Windows: `choco install k6` or download from https://k6.io/docs/getting-started/installation/
   - macOS: `brew install k6`
   - Linux: See k6 installation docs

2. **Start Ollama**:

   ```bash
   ollama serve
   ```

3. **Install the model** (if not already installed):
   ```bash
   ollama pull phi4-mini
   ```

### Running the Tests

From the project root directory:

```bash
# Standard load test (gradual ramp-up)
npm run load-test:local-eval

# Light test (2 virtual users for 2 minutes)
npm run load-test:local-eval:light

# Stress test (10 virtual users for 5 minutes)
npm run load-test:local-eval:stress
```

### Custom Configuration

You can customize the test by setting environment variables:

```bash
# Use a different Ollama URL
OLLAMA_URL=http://localhost:11434 k6 run test/local-evaluation-load-test.js

# Use a different model
MODEL=phi4-mini k6 run test/local-evaluation-load-test.js

# Custom virtual users and duration
k6 run --vus 5 --duration 3m test/local-evaluation-load-test.js
```

### Test Metrics

The test tracks:

- **HTTP Request Duration**: Response times (p50, p95, p99)
- **Error Rate**: Failed requests percentage
- **Evaluation Success Rate**: Valid evaluation responses
- **Request Rate**: Requests per second

### Thresholds

The test expects:

- 95% of requests to complete within 30 seconds (LLM responses can be slow)
- Error rate below 10%
- Evaluation success rate above 85%

### Notes

- Local LLM responses are typically slower than API calls, so thresholds are adjusted accordingly
- The test simulates real evaluation requests with proper message formatting
- Make sure Ollama is running before starting the test
- The test includes a health check in the setup phase to verify Ollama is available
