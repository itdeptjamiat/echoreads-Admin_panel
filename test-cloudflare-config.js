const { S3Client, ListBucketsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');

// Test different configurations
const configs = [
  {
    name: 'Current Config',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    bucket: 'b8050509235e4bcca261901d10608e30',
    credentials: {
      accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
      secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
    }
  },
  {
    name: 'Alternative Config 1',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    bucket: 'echoreads',
    credentials: {
      accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
      secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
    }
  },
  {
    name: 'Alternative Config 2',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    bucket: 'magazines',
    credentials: {
      accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
      secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
    }
  }
];

async function testConfig(config) {
  console.log(`\n🧪 Testing: ${config.name}`);
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Bucket: ${config.bucket}`);
  
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    credentials: config.credentials,
  });

  try {
    // Test 1: List buckets
    console.log('📋 Testing bucket listing...');
    const listCommand = new ListBucketsCommand({});
    const listResult = await s3Client.send(listCommand);
    console.log('✅ Bucket listing successful');
    console.log('Available buckets:', listResult.Buckets?.map(b => b.Name) || 'None');
    
    // Test 2: Check specific bucket
    console.log(`🔍 Testing access to bucket: ${config.bucket}`);
    const headCommand = new HeadBucketCommand({ Bucket: config.bucket });
    await s3Client.send(headCommand);
    console.log('✅ Bucket access successful');
    
    return { success: true, config };
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.name === 'NoSuchBucket') {
      console.log('   → Bucket does not exist');
    } else if (error.name === 'AccessDenied') {
      console.log('   → Access denied to bucket');
    } else if (error.message.includes('SSL') || error.message.includes('EPROTO')) {
      console.log('   → SSL/TLS connection issue');
    }
    return { success: false, config, error: error.message };
  }
}

async function main() {
  console.log('🔧 Cloudflare R2 Configuration Test');
  console.log('=====================================');
  
  const results = [];
  
  for (const config of configs) {
    const result = await testConfig(config);
    results.push(result);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log(`✅ ${successful.length} configuration(s) working:`);
    successful.forEach(r => {
      console.log(`   - ${r.config.name} (Bucket: ${r.config.bucket})`);
    });
  }
  
  if (failed.length > 0) {
    console.log(`❌ ${failed.length} configuration(s) failed:`);
    failed.forEach(r => {
      console.log(`   - ${r.config.name}: ${r.error}`);
    });
  }
  
  if (successful.length === 0) {
    console.log('\n🚨 No working configurations found!');
    console.log('Please check:');
    console.log('1. Account ID is correct');
    console.log('2. Access Key ID is correct');
    console.log('3. Secret Access Key is correct');
    console.log('4. Bucket name is correct');
    console.log('5. Network connectivity to Cloudflare');
  }
}

main().catch(console.error); 