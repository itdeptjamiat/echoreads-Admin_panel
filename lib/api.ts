// API utility functions for authentication
import { getLoginApiUrl, API_CONFIG } from './config';
import { 
  setStoredToken, 
  setStoredUser, 
  removeStoredToken, 
  removeStoredUser, 
  getStoredToken, 
  getStoredUser,
  isUserAuthenticated,
  clearAuthData
} from './tokenManager';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userType?: string;
}

// Token management (using new token manager)
export const getToken = (): string | null => {
  return getStoredToken();
};

export const setToken = (token: string): void => {
  setStoredToken(token);
};

export const removeToken = (): void => {
  removeStoredToken();
};

export const getUser = (): User | null => {
  return getStoredUser();
};

export const setUser = (user: User): void => {
  setStoredUser(user);
};

export const removeUser = (): void => {
  removeStoredUser();
};

// API call functions
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    const apiUrl = getLoginApiUrl();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    // Handle the external API response format
    if (response.ok && (data.success || data.message === 'Login successful')) {
      // Extract token from response (handle different possible formats)
      let token = data.token || data.access_token || data.accessToken || data.jwt || data.user?.jwtToken || data.user?.user?.jwtToken || data.user?.token || data.user?.user?.token;
      
      // If no token found in standard locations, search more thoroughly
      if (!token) {
        // Search through the entire response object for JWT-like strings
        const searchForToken = (obj: any): string | null => {
          if (typeof obj === 'string') {
            // Check if this string looks like a JWT token
            if (obj.includes('.') && obj.split('.').length === 3 && obj.length > 50) {
              return obj;
            }
            return null;
          }
          
          if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
              const result = searchForToken(value);
              if (result) {
                return result;
              }
            }
          }
          
          return null;
        };
        
        token = searchForToken(data);
      }
      
      // Extract user data from response (handle nested user structure)
      const userInfo = data.user?.user || data.user || data;
      const userData = {
        id: userInfo?.id || userInfo?._id || `user-${Date.now()}`,
        email: userInfo?.email || credentials.email,
        name: userInfo?.name || userInfo?.username || 'User',
        role: userInfo?.role || 'user',
        userType: userInfo?.userType || 'user'
      };

      // Check if userType is admin
      if (userData.userType !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      // Store only the token, not user data
      if (token) {
        try {
          setToken(token);
        } catch (tokenError) {
          console.error('Failed to store token:', tokenError);
          // Continue with login even if token storage fails
        }
      } else {
        // Try to extract token from user object if available
        if (data.user && typeof data.user === 'object') {
          const userKeys = Object.keys(data.user);
          
          // Look for any key that might contain a token
          for (const key of userKeys) {
            const value = data.user[key];
            if (typeof value === 'string' && value.length > 50 && value.includes('.')) {
              try {
                setToken(value);
                break;
              } catch (tokenError) {
                console.error('Failed to store extracted token:', tokenError);
              }
            }
          }
        }
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        token: token,
        user: userData // Return user data but don't store it
      };
    } else {
      return {
        success: false,
        message: data.message || 'Invalid email or password',
      };
    }
  } catch (error: unknown) {
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.',
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
};

// Get authorization headers with token
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fetch users from API
export const fetchUsers = async (): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const token = getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found. Please login again.'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    // Use the proxy API route instead of calling external API directly
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please login again.'
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.'
        };
      }
      
      return {
        success: false,
        message: `Failed to fetch users. Status: ${response.status}`
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.users || data.data || data
    };

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch users. Please try again.'
    };
  }
};

// Fetch magazines from API
export const fetchMagazines = async (): Promise<{ success: boolean; data?: any[]; message?: string }> => {
  try {
    const token = getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found. Please login again.'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.API_TIMEOUT);

    // Use the proxy API route instead of calling external API directly
    const response = await fetch('/api/magazines', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please login again.'
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.'
        };
      }
      
      return {
        success: false,
        message: `Failed to fetch magazines. Status: ${response.status}`
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.magazines || data.data || data
    };

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to fetch magazines. Please try again.'
    };
  }
};

// Create magazine API
export const createMagazine = async (magazineData: {
  name: string; image: string; file: string; type: 'free' | 'pro'; description: string; category?: string;
}): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    const response = await fetch('/api/magazines/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(magazineData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error || errorData.message || 'Failed to create magazine' };
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error: unknown) {
    console.error('Error creating magazine:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Delete functions removed - will be set up later

export const logoutUser = (): void => {
  clearAuthData();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return isUserAuthenticated();
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getUser();
}; 