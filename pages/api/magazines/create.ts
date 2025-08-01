import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthHeaders } from '../../../lib/api';

interface CreateMagazineRequest {
  name: string;
  image: string;
  file: string;
  type?: 'free' | 'pro';
  magzineType?: 'magzine' | 'article' | 'digest';
  description?: string;
  category?: string;
}

interface CreateMagazineResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateMagazineResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    // Get authorization header from the request
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    const { name, image, file, type, magzineType, description, category }: CreateMagazineRequest = req.body;

    // Validate required fields
    if (!name || !image || !file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, image, and file are required'
      });
    }

    // Validate type enum if provided
    if (type && !['free', 'pro'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "free" or "pro"'
      });
    }

    // Validate magzineType enum if provided
    if (magzineType && !['magzine', 'article', 'digest'].includes(magzineType)) {
      return res.status(400).json({
        success: false,
        message: 'MagzineType must be either "magzine", "article", or "digest"'
      });
    }

    // Prepare request body
    const requestBody = {
      name,
      image,
      file,
      type: type || 'free',
      fileType: 'pdf',
      magzineType: magzineType || 'magzine',
      isActive: true,
      category: category || 'other',
      downloads: 0,
      description: description || '',
      rating: 0,
      reviews: [],
      createdAt: new Date()
    };

    // Forward request to external API
    const externalResponse = await fetch('https://api.echoreads.online/api/v1/admin/create-magzine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(requestBody)
    });

    const data = await externalResponse.json();

    // Forward the response from external API
    return res.status(externalResponse.status).json(data);

  } catch (error) {
    console.error('Error creating magazine:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 