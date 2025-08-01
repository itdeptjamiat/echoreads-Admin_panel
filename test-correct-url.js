const AWS = require('aws-sdk');

// Use the correct configuration that matches your working URL
const s3 = new AWS.S3({
  endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
  accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
  secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
  region: 'auto',
  signatureVersion: 'v4',
});

async function testCorrectURL() {
  console.log('🧪 Testing Correct URL Generation');
  console.log('==================================');
  
  try {
    // Test 1: Generate signed URL
    console.log('🔗 Testing signed URL generation...');
    const params = {
      Bucket: 'b8050509235e4bcca261901d10608e30',
      Key: 'magazines/covers/test-file.jpg',
      ContentType: 'image/jpeg',
      Expires: 60,
    };
    
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    console.log('✅ Signed URL generated successfully');
    console.log('Upload URL:', uploadURL.substring(0, 100) + '...');
    
    // Test 2: Generate public URL (what gets stored in database)
    const fileName = '1754025629062-tfilxpnkuma.jpg';
    const publicUrl = `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/covers/${fileName}`;
    
    console.log('\n📝 Public URL that will be stored in database:');
    console.log(publicUrl);
    
    // Test 3: Compare with your working URL
    const workingUrl = 'https://pub-b8050509235e4bcca261901d10608e30.r2.dev/magazines/covers/1754025629062-tfilxpnkuma.jpg';
    
    console.log('\n🔍 URL Comparison:');
    console.log('Working URL:', workingUrl);
    console.log('Generated URL:', publicUrl);
    console.log('URLs match:', publicUrl === workingUrl);
    
    console.log('\n🎉 URL generation is now correct!');
    console.log('\n📝 Next Steps:');
    console.log('1. Try uploading a magazine from the admin panel');
    console.log('2. The database should now store the correct URL format');
    console.log('3. Images should display correctly');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the credentials are still valid');
    console.log('2. Verify the bucket name is correct');
    console.log('3. Ensure the account ID is correct');
  }
}

testCorrectURL(); 