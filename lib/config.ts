// API Configuration
export const API_CONFIG = {
  // External API endpoint
  EXTERNAL_API_URL: 'http://srv931842.hstgr.cloud/api/v1/user/login',
  
  // Local API endpoint (proxy)
  LOCAL_API_URL: '/api/auth/login',
  
  // Use external API directly (true) or local proxy (false)
  // Set to false to avoid CORS issues in browser
  USE_EXTERNAL_API_DIRECTLY: false,
  
  // API timeout in milliseconds
  API_TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Get the appropriate API URL based on configuration
export const getLoginApiUrl = (): string => {
  return API_CONFIG.USE_EXTERNAL_API_DIRECTLY 
    ? API_CONFIG.EXTERNAL_API_URL 
    : API_CONFIG.LOCAL_API_URL;
};

// Environment-specific configurations
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
export const FEATURES = {
  ENABLE_LOGGING: isDevelopment,
  ENABLE_DEBUG_MODE: isDevelopment,
  ENABLE_MOCK_DATA: false, // Set to true to use mock data instead of real API
}; 