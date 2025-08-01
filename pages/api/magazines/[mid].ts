import { NextApiRequest, NextApiResponse } from 'next';

interface GetMagazineDetailsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetMagazineDetailsResponse>
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

    const { mid } = req.query;

    if (!mid || typeof mid !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Magazine MID is required'
      });
    }

    // Forward request to external API
    const externalResponse = await fetch(`https://api.echoreads.online/api/v1/user/magzines/${mid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const data = await externalResponse.json();

    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

  } catch (error) {
    console.error('Error fetching magazine details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 