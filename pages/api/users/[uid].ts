import { NextApiRequest, NextApiResponse } from 'next';

interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserDetailsResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get authorization header from the request
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    const { uid } = req.query;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User UID is required'
      });
    }

    console.log('Fetching user details for UID:', uid);

    // Use the correct endpoint that works with the data structure
    const endpoint = `https://api.echoreads.online/api/v1/user/profile/${uid}`;
    
    console.log('Using endpoint:', endpoint);
    
    const externalResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    console.log('Response status:', externalResponse.status);

    if (externalResponse.ok) {
      const data = await externalResponse.json();
      console.log('Success response data:', data);
      
      // Forward the response from external API
      return res.status(externalResponse.status).json(data);
    } else {
      const errorData = await externalResponse.json();
      console.log('Error response:', errorData);
      return res.status(externalResponse.status).json({
        success: false,
        message: errorData.message || errorData.error || 'Failed to fetch user details',
        error: errorData
      });
    }

  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 