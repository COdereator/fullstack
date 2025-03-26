// API configuration
const API_URL = import.meta.env.PROD 
  ? '/api' // In production, use relative path (handled by proxy or same origin)
  : 'http://localhost:5000/api'; // In development, use localhost

export default API_URL; 