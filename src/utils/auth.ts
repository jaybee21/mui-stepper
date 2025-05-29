import { jwtDecode } from 'jwt-decode';

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

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  department: string;
  email: string;
  isFirstLogin: number;
}

export const decodeToken = (): DecodedToken | null => {
  const token = getAuthToken();
  if (!token) return null;
  return jwtDecode(token);
};

export const fetchUserProfile = async (userId: number) => {
  const token = getAuthToken();
  const response = await fetch(`https://apply.wua.ac.zw/dev/api/api/v1/users/id/${userId}`, {
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
  const response = await fetch(`https://apply.wua.ac.zw/dev/api/api/v1/users/reset-password`, {
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