import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import AWS from 'aws-sdk';

// Disable body parsing, we'll handle it with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
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
      error: 'Method not allowed'
    });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowEmptyFiles: false,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileName = Array.isArray(fields.fileName) ? fields.fileName[0] : fields.fileName;
    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'No file name provided'
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({
        success: false,
        error: `File type ${file.mimetype} is not allowed`
      });
    }

    // Get Cloudflare R2 configuration (hardcoded for now)
    const accountId = 'ef6de2d4389d2f6608f081f1c3405a28';
    const accessKeyId = 'e680e4254dfba4e0bf0d481cd0c7c0bf';
    const secretAccessKey = '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e';
    const bucketName = 'echoreads';
    const publicUrl = 'https://pub-b8050509235e4bcca261901d10608e30.r2.dev';

    // Initialize S3 client for Cloudflare R2
    const s3 = new AWS.S3({
      endpoint: 'https://ef6de2d4389d2f6608f081f1c3405a28.r2.cloudflarestorage.com',
      accessKeyId,
      secretAccessKey,
      region: 'auto',
      signatureVersion: 'v4',
    });

    // Read file buffer
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(file.filepath);

    // Upload to Cloudflare R2
    await s3.upload({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.mimetype || 'application/octet-stream',
      ACL: 'public-read',
    }).promise();

    // Generate public URL
    const publicFileUrl = `${publicUrl}/${fileName}`;

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      url: publicFileUrl,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    });
  }
} 