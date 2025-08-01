const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
  accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
  secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
  region: 'auto',
  signatureVersion: 'v4',
});

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { fileName, fileType } = req.body;

    console.log('Generating signed URL for:', { fileName, fileType });

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    const params = {
      Bucket: 'b8050509235e4bcca261901d10608e30',
      Key: fileName,
      ContentType: fileType,
      Expires: 60,
    };

    console.log('Creating signed URL with params:', params);

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    
    console.log('Signed URL generated successfully');
    
    res.status(200).json({ uploadURL });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate signed URL';
    
    if (err instanceof Error) {
      if (err.message.includes('credentials')) {
        errorMessage = 'Invalid Cloudflare credentials';
      } else if (err.message.includes('bucket')) {
        errorMessage = 'Bucket not found or access denied';
      } else if (err.message.includes('network')) {
        errorMessage = 'Network error connecting to Cloudflare';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied. Check bucket permissions.';
      } else if (err.message.includes('404')) {
        errorMessage = 'Bucket not found. Check bucket name.';
      } else {
        errorMessage = err.message;
      }
    }
    
    res.status(500).json({ error: errorMessage });
  }
} 