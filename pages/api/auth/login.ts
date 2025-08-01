import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Forward request to external API
    const apiUrl = process.env.AUTH_API_URL || 'http://srv931842.hstgr.cloud/api/v1/user/login';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const externalResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let externalData;
      try {
        externalData = await externalResponse.json();
      } catch (parseError) {
        return res.status(500).json({
          success: false,
          message: 'Invalid response from authentication service.'
        });
      }

      // Check if the external API response indicates success and userType is admin
      if (externalResponse.ok && (externalData.success || externalData.message === 'Login successful')) {
        // Extract userType from the response (handle nested user structure)
        const userInfo = externalData.user?.user || externalData.user || externalData;
        const userType = userInfo?.userType || externalData.userType || 'user';
        
        // Check if userType is admin
        if (userType !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.',
          });
        }
      }

      // Forward the response from external API
      return res.status(externalResponse.status).json(externalData);

    } catch (externalError) {
      if (externalError instanceof Error && externalError.name === 'AbortError') {
        return res.status(408).json({
          success: false,
          message: 'Request timeout. External service is taking too long to respond.'
        });
      }
      
      if (externalError instanceof Error && externalError.message.includes('fetch')) {
        return res.status(500).json({
          success: false,
          message: 'Network error. Unable to connect to authentication service.'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'External authentication service unavailable. Please try again later.'
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 