const AWS = require('aws-sdk');

// Test the configuration that matches your working setup
const s3 = new AWS.S3({
  endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
  accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
  secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
  region: 'auto',
  signatureVersion: 'v4',
});

async function testBucket(bucketName) {
  console.log(`\n🔍 Testing bucket: ${bucketName}`);
  
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log(`✅ Bucket "${bucketName}" access successful`);
    
    // Test signed URL generation
    const params = {
      Bucket: bucketName,
      Key: 'test-file.txt',
      ContentType: 'text/plain',
      Expires: 60,
    };
    
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    console.log(`✅ Signed URL generated for "${bucketName}"`);
    console.log('URL:', uploadURL.substring(0, 100) + '...');
    
    return { success: true, bucketName };
  } catch (error) {
    console.log(`❌ Error with "${bucketName}":`, error.message);
    return { success: false, bucketName, error: error.message };
  }
}

async function testUpload() {
  console.log('🧪 Testing Cloudflare R2 Upload Configuration');
  console.log('=============================================');
  
  try {
    // Test 1: List buckets
    console.log('📋 Testing bucket listing...');
    const buckets = await s3.listBuckets().promise();
    console.log('✅ Bucket listing successful');
    console.log('Available buckets:', buckets.Buckets?.map(b => b.Name) || 'None');
    
    // Test 2: Try different bucket names
    const bucketNames = [
      'b8050509235e4bcca261901d10608e30',
      'echoreads',
      'magazines',
      'images',
      'files'
    ];
    
    console.log('\n🔍 Testing different bucket names...');
    const results = [];
    
    for (const bucketName of bucketNames) {
      const result = await testBucket(bucketName);
      results.push(result);
    }
    
    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
      console.log(`✅ ${successful.length} bucket(s) working:`);
      successful.forEach(r => {
        console.log(`   - ${r.bucketName}`);
      });
    }
    
    if (failed.length > 0) {
      console.log(`❌ ${failed.length} bucket(s) failed:`);
      failed.forEach(r => {
        console.log(`   - ${r.bucketName}: ${r.error}`);
      });
    }
    
    if (successful.length === 0) {
      console.log('\n🚨 No working buckets found!');
      console.log('Please check your Cloudflare R2 configuration.');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testUpload(); 