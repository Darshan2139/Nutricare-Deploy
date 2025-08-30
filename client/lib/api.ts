// Centralized API configuration
export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://nutricare-backend.onrender.com/api' : '/api');

// Debug: Log the API base URL
console.log('Client API Base URL:', API_BASE);
console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL);
console.log('PROD env var:', import.meta.env.PROD);

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  console.log('Making API call to:', url);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
