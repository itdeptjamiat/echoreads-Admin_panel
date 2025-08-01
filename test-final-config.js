const AWS = require('aws-sdk');

// Use the exact configuration you provided
const s3 = new AWS.S3({
  endpoint: 'https://ef6de2d4389d2f6608f081f1c3405a28.r2.cloudflarestorage.com',
  accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
  secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
  region: 'auto',
  signatureVersion: 'v4',
});

async function testUpload() {
  console.log('🧪 Testing Final Cloudflare R2 Configuration');
  console.log('============================================');
  
  try {
    // Test 1: List buckets
    console.log('📋 Testing bucket listing...');
    const buckets = await s3.listBuckets().promise();
    console.log('✅ Bucket listing successful');
    console.log('Available buckets:', buckets.Buckets?.map(b => b.Name) || 'None');
    
    // Test 2: Check specific bucket access
    console.log('🔍 Testing access to bucket: echoreads');
    await s3.headBucket({ Bucket: 'echoreads' }).promise();
    console.log('✅ Bucket access successful');
    
    // Test 3: Generate signed URL
    console.log('🔗 Testing signed URL generation...');
    const params = {
      Bucket: 'echoreads',
      Key: 'test-file.txt',
      ContentType: 'text/plain',
      Expires: 60,
    };
    
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    console.log('✅ Signed URL generated successfully');
    console.log('URL:', uploadURL.substring(0, 100) + '...');
    
    console.log('\n🎉 All tests passed! Upload should work now.');
    console.log('\n📝 Next Steps:');
    console.log('1. Try uploading a magazine from the admin panel');
    console.log('2. Check if the upload completes successfully');
    console.log('3. Verify the image displays correctly');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the credentials are still valid');
    console.log('2. Verify the bucket name is correct');
    console.log('3. Ensure the account ID is correct');
    console.log('4. Check Cloudflare R2 dashboard for any issues');
  }
}

testUpload(); 