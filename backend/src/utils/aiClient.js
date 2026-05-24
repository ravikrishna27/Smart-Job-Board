import axios from 'axios';

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Create a dedicated Axios instance for the AI service
const aiClient = axios.create({
  baseURL: AI_URL,
  timeout: 10000, // Strict 10-second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Resilient request interceptor to retry once on failure/timeout
aiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    // If config does not exist or retry option is disabled, reject
    if (!config || config.__isRetryRequest) {
      console.error('[AI CLIENT] Final request failure:', error.message);
      return Promise.reject(error);
    }
    
    // Mark as a retry attempt to avoid infinite loops
    config.__isRetryRequest = true;
    
    console.warn(`[AI CLIENT] Request failed: "${error.message}". Retrying once in 1s...`);
    
    // Wait for 1 second before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Resend request
    return aiClient(config);
  }
);

export default aiClient;
