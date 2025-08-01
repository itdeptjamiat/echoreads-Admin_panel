import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
    secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  try {
    console.log('Testing Cloudflare R2 connection...');
    
    // Test basic connection by listing buckets
    const command = new ListBucketsCommand({});
    const result = await s3Client.send(command);
    
    console.log('Cloudflare R2 connection successful');
    console.log('Buckets:', result.Buckets);
    
    // Also test specific bucket access
    try {
      const { HeadBucketCommand } = await import('@aws-sdk/client-s3');
      const bucketCheckCommand = new HeadBucketCommand({ Bucket: 'b8050509235e4bcca261901d10608e30' });
      await s3Client.send(bucketCheckCommand);
      console.log('Specific bucket access verified');
    } catch (bucketError) {
      console.error('Specific bucket access error:', bucketError);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Cloudflare R2 connection successful',
      buckets: result.Buckets 
    });
  } catch (err) {
    console.error('Cloudflare R2 connection failed:', err);
    res.status(500).json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err 
    });
  }
} 