const AWS = require('aws-sdk');

// Test different endpoint formats
const configs = [
  {
    name: 'Format 1 - Direct Account ID',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    region: 'auto'
  },
  {
    name: 'Format 2 - With Account ID',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    region: 'us-east-1'
  },
  {
    name: 'Format 3 - Standard R2',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    region: 'us-west-2'
  },
  {
    name: 'Format 4 - Alternative',
    endpoint: 'https://b8050509235e4bcca261901d10608e30.r2.cloudflarestorage.com',
    region: 'eu-west-1'
  }
];

async function testEndpoint(config) {
  console.log(`\n🧪 Testing: ${config.name}`);
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Region: ${config.region}`);
  
  const s3 = new AWS.S3({
    endpoint: config.endpoint,
    accessKeyId: 'e680e4254dfba4e0bf0d481cd0c7c0bf',
    secretAccessKey: '51d24d04769e166ac11db7f81e56ba62207cf31b4b6634cce08027f22dc7d37e',
    region: config.region,
    signatureVersion: 'v4',
  });

  try {
    // Test bucket listing
    console.log('📋 Testing bucket listing...');
    const buckets = await s3.listBuckets().promise();
    console.log('✅ Bucket listing successful');
    console.log('Available buckets:', buckets.Buckets?.map(b => b.Name) || 'None');
    
    return { success: true, config };
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, config, error: error.message };
  }
}

async function main() {
  console.log('🔧 Cloudflare R2 Endpoint Test');
  console.log('==============================');
  
  const results = [];
  
  for (const config of configs) {
    const result = await testEndpoint(config);
    results.push(result);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log(`✅ ${successful.length} configuration(s) working:`);
    successful.forEach(r => {
      console.log(`   - ${r.config.name} (Region: ${r.config.region})`);
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
    console.log('The credentials might be incorrect or the account ID is wrong.');
  }
}

main().catch(console.error); 