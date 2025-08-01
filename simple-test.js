const https = require('https');
const http = require('http');

// Simple test to check if the API is working
async function simpleTest() {
  console.log('🧪 Simple API Test');
  console.log('==================');
  
  try {
    // Test the API endpoint
    const data = JSON.stringify({
      fileName: 'test.jpg',
      fileType: 'image/jpeg'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/r2-url',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('Response:', responseData);
        
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.uploadURL) {
            console.log('✅ API is working!');
            console.log('Upload URL received');
          } else {
            console.log('❌ No upload URL in response');
          }
        } catch (e) {
          console.log('❌ Failed to parse response:', e.message);
        }
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ Request error:', e.message);
    });
    
    req.write(data);
    req.end();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

simpleTest(); 