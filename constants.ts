// In a real deployment, this would be an environment variable
export const API_URL = 'http://localhost:5000/api';

// For the purpose of this portfolio demo running in a browser-only environment,
// we default to TRUE to simulate the backend. 
// Set this to FALSE to attempt connecting to a real running Node/Express backend.
export const USE_MOCK_BACKEND = false;

export const TOKEN_KEY = 'devflow_jwt_token';
export const USER_KEY = 'devflow_user_data';