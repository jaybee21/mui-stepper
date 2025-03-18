export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  sessionStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  sessionStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Helper function for making authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeAuthToken();
    window.location.href = '/admin'; // Redirect to login
  }

  return response;
}; 