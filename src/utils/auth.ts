import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  department: string;
  email: string;
  isFirstLogin: number;
}

export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
 
  sessionStorage.setItem('authToken', token);
  
  try {
   
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    
    sessionStorage.setItem('decodedToken', JSON.stringify(decodedToken));
    
  } catch (error) {
    
  }
};

export const removeAuthToken = () => {
  
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('decodedToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
 
  return !!token;
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

export const decodeToken = (): DecodedToken | null => {
  const token = getAuthToken();
 
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// New function to get user details from session storage
export const getUserDetails = (): DecodedToken | null => {
  const decodedTokenStr = sessionStorage.getItem('decodedToken');
  
  if (!decodedTokenStr) return null;
  try {
    const parsed = JSON.parse(decodedTokenStr);
    return parsed;
  } catch (error) {
    console.error('Error parsing user details:', error);
    return null;
  }
};

export const fetchUserProfile = async (userId: number) => {
  const token = getAuthToken();
  const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/users/id/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

export const updateUserProfile = async (userId: number, data: any) => {
  const token = getAuthToken();
  const response = await fetch(`https://apply.wua.ac.zw/dev/api/api/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export const resetPassword = async (username: string, newPassword: string) => {
  const token = getAuthToken();
  const response = await fetch(`https://apply.wua.ac.zw/dev/api/v1/users/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      newPassword,
    }),
  });
  if (!response.ok) throw new Error('Failed to reset password');
  return response.json();
}; 