# Cloudflare Storage Integration Setup

This guide explains how to set up Cloudflare R2 storage for the magazine management system using signed URLs for direct upload.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Authentication API
AUTH_API_URL=http://srv931842.hstgr.cloud/api/v1/user/login

# Cloudflare R2 Storage Configuration (for signed URLs)
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=ef6de2d4389d2f6608f081f1c3405a28
CLOUDFLARE_ACCESS_KEY_ID=e680e4254dfba4e0bf0d481cd0c7c0bf
CLOUDFLARE_SECRET_ACCESS_KEY=51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e
CLOUDFLARE_BUCKET_NAME=echoreads
```

## Cloudflare R2 Setup Steps

1. **Create Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)

2. **Enable R2 Storage**:
   - Go to Cloudflare Dashboard
   - Navigate to R2 Object Storage
   - Create a bucket named `echoreads`

3. **Create API Token**:
   - Go to My Profile > API Tokens
   - Create a custom token with R2 permissions
   - Note down the Account ID, Access Key ID, and Secret Access Key

4. **Configure Public Access**:
   - Enable public access for your R2 bucket
   - The public URL format will be: `https://pub-{account-id}.r2.dev/{bucket-name}/{file-path}`
   - For your setup: `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/images/{file-path}`

## API Integration

### Real API Endpoints Used

1. **Fetch Magazines**: `https://api.echoreads.online/api/v1/user/magzines`
2. **Create Magazine**: `https://api.echoreads.online/api/v1/admin/create-magzine`

### Database Schema

The system integrates with your MongoDB schema:

```javascript
const magzinesSchema = new Schema({
    mid: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    file: { type: String, required: true },
    type: { type: String, enum: ['free', 'pro'], default: 'free' },
    isActive: { type: Boolean, default: true },
    category: { type: String, default: 'other' },
    downloads: { type: Number, default: 0 },
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviews: [{ type: String, time: Date.now(), userId: Number }],
    createdAt: { type: Date }
});
```

## Features Implemented

### File Upload System
- **Cover Images**: Supports JPEG, PNG, WebP (max 10MB)
- **PDF Files**: Supports PDF format (max 50MB)
- **Progress Tracking**: Real-time upload progress indicators
- **Error Handling**: Comprehensive error messages and validation
- **Direct Upload**: Uses signed URLs for direct upload to Cloudflare R2 (more efficient)

### Storage Organization
- **Cover Images**: Stored in `magazines/covers/` folder
- **PDF Files**: Stored in `magazines/pdfs/` folder
- **Unique Naming**: Timestamp-based unique filenames to prevent conflicts
- **Public URLs**: Automatically generated public URLs for direct access

### API Integration
- **Real API**: Fetches magazines from `https://api.echoreads.online/api/v1/user/magzines`
- **Create Magazine**: Creates magazines via `https://api.echoreads.online/api/v1/admin/create-magzine`
- **Authentication**: Uses JWT tokens for API requests
- **Error Handling**: Graceful handling of API errors and timeouts

### Form Fields
- **Name**: Magazine name (required)
- **Description**: Magazine description
- **Category**: Magazine category (dropdown with predefined options)
- **Type**: Free or Pro (dropdown)
- **Cover Image**: Upload to Cloudflare R2
- **PDF File**: Upload to Cloudflare R2

## Usage

1. **Add New Magazine**:
   - Navigate to `/magazines/add`
   - Fill in magazine details (name, description, category, type)
   - Upload cover image and PDF file
   - Files are uploaded directly to Cloudflare R2 using signed URLs
   - Magazine data is sent to your API with Cloudflare URLs
   - Public URLs are generated and stored in form data

2. **View Magazines**:
   - Navigate to `/magazines`
   - Magazines are fetched from your real API
   - Search and filter functionality available
   - Responsive design for mobile and desktop

## Security Features

- **File Validation**: Type and size validation before upload
- **Secure Storage**: Files stored in Cloudflare R2 with public read access
- **Authentication**: All API calls require valid JWT tokens
- **Error Handling**: Comprehensive error handling and user feedback
- **Signed URLs**: 60-second expiration for security

## API Request Format

### Create Magazine Request
```json
{
  "name": "Magazine Name",
  "image": "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/images/1234567890-abc123.jpg",
  "file": "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/pdfs/1234567890-abc123.pdf",
  "type": "free",
  "description": "Magazine description",
  "category": "Technology"
}
```

## Troubleshooting

### Common Issues

1. **Upload Fails**:
   - Check Cloudflare credentials in environment variables
   - Verify bucket permissions and CORS settings
   - Check file size and type restrictions

2. **API Errors**:
   - Verify authentication token is valid
   - Check API endpoint availability
   - Review network connectivity

3. **Environment Variables**:
   - Ensure all required variables are set
   - Restart development server after changes
   - Check for typos in variable names

### Support

For issues with:
- **Cloudflare Setup**: Contact Cloudflare support
- **API Integration**: Check your API documentation
- **Application Issues**: Review browser console for errors 