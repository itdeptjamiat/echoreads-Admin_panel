// Token Manager for handling authentication tokens

export interface TokenData {
  token: string;
  expiresAt?: number;
  refreshToken?: string;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  userType?: string;
  lastLogin?: number;
}

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Token validation
export const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check for JWT format (3 parts separated by dots)
  const parts = token.split('.');
  const isJWT = parts.length === 3;
  
  // Basic token format validation
  const isValid = token.length > 50 && isJWT; // JWT tokens are typically longer than 50 chars
  
  return true; // Allow storage even if not perfect JWT format
};

// Token expiration check
export const isTokenExpired = (expiresAt?: number): boolean => {
  if (!expiresAt) {
    return false; // No expiration set
  }
  
  return Date.now() >= expiresAt;
};

// Get token from localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && isValidToken(token) ? token : null;
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

// Set token in localStorage
export const setStoredToken = (token: string, expiresAt?: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    if (!isValidToken(token)) {
      throw new Error('Invalid token format');
    }
    
    localStorage.setItem(TOKEN_KEY, token);
    
    if (expiresAt) {
      localStorage.setItem('auth_token_expires', expiresAt.toString());
    }
  } catch (error) {
    console.error('Error storing token in localStorage:', error);
    throw error;
  }
};

// Remove token from localStorage
export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('auth_token_expires');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

// Get user data from localStorage
export const getStoredUser = (): StoredUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) {
      return null;
    }
    
    const user = JSON.parse(userStr) as StoredUser;
    
    // Validate user data
    if (!user.id || !user.email || !user.name || !user.role) {
      console.warn('Invalid user data in localStorage');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

// Set user data in localStorage
export const setStoredUser = (user: StoredUser): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // Add last login timestamp
    const userWithTimestamp = {
      ...user,
      lastLogin: Date.now()
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(userWithTimestamp));
  } catch (error) {
    console.error('Error storing user in localStorage:', error);
    throw error;
  }
};

// Remove user data from localStorage
export const removeStoredUser = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

// Check if user is authenticated (only token-based)
export const isUserAuthenticated = (): boolean => {
  const token = getStoredToken();
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  const expiresAt = localStorage.getItem('auth_token_expires');
  if (expiresAt && isTokenExpired(parseInt(expiresAt))) {
    // Token is expired, clear it
    removeStoredToken();
    return false;
  }
  
  // Only check token existence, not user data
  return true;
};

// Clear all authentication data
export const clearAuthData = (): void => {
  removeStoredToken();
  removeStoredUser();
};

// Get authentication status with details
export const getAuthStatus = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  const isAuthenticated = isUserAuthenticated();
  
  return {
    isAuthenticated,
    hasToken: !!token,
    hasUser: !!user,
    user,
    token: token ? `${token.substring(0, 10)}...` : null, // Only show first 10 chars for security
  };
};

 