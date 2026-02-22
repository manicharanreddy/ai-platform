// API Configuration
const config = {
  // Use environment variable if available, otherwise default to development
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
};

export default config;