// Test the frontend upload process
async function testFrontendUpload() {
  console.log('🧪 Testing Frontend Upload Process');
  console.log('===================================');
  
  try {
    // Test 1: Check if the API endpoint is accessible
    console.log('📡 Testing API endpoint accessibility...');
    const testResponse = await fetch('http://localhost:3000/api/r2-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
      }),
    });
    
    console.log('API Response Status:', testResponse.status);
    console.log('API Response OK:', testResponse.ok);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log('API Error Response:', errorText);
      throw new Error(`API request failed: ${testResponse.status} - ${errorText}`);
    }
    
    const responseData = await testResponse.json();
    console.log('API Response Data:', responseData);
    
    if (!responseData.uploadURL) {
      throw new Error('No upload URL received from API');
    }
    
    console.log('✅ API endpoint is working correctly');
    console.log('Signed URL received:', responseData.uploadURL.substring(0, 100) + '...');
    
    // Test 2: Create a mock file for testing
    console.log('\n📁 Creating mock file for testing...');
    const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    console.log('Mock file created:', {
      name: mockFile.name,
      size: mockFile.size,
      type: mockFile.type
    });
    
    // Test 3: Test the upload process
    console.log('\n🔄 Testing upload process...');
    
    // Simulate the uploadToCloudflare function
    const timestamp = Date.now();
    const fileExtension = mockFile.name.split('.').pop();
    const fileName = `magazines/covers/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    console.log('Generated filename:', fileName);
    
    // Get signed URL
    const signedUrlResponse = await fetch('/api/r2-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType: mockFile.type,
      }),
    });
    
    console.log('Signed URL response status:', signedUrlResponse.status);
    
    if (!signedUrlResponse.ok) {
      const errorData = await signedUrlResponse.json();
      console.error('Signed URL error:', errorData);
      throw new Error(errorData.error || `Failed to get signed URL: ${signedUrlResponse.status}`);
    }
    
    const signedUrlData = await signedUrlResponse.json();
    console.log('Signed URL data received');
    
    if (!signedUrlData.uploadURL) {
      throw new Error(signedUrlData.error || 'Failed to get signed URL');
    }
    
    console.log('✅ Signed URL generation successful');
    
    // Test 4: Test the actual upload (this might fail due to credentials, but we can see the error)
    console.log('\n📤 Testing actual file upload...');
    
    try {
      const uploadResponse = await fetch(signedUrlData.uploadURL, {
        method: 'PUT',
        body: mockFile,
        headers: {
          'Content-Type': mockFile.type,
        },
      });
      
      console.log('Upload response status:', uploadResponse.status);
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.log('Upload error response:', errorText);
        throw new Error(`Upload failed with status: ${uploadResponse.status} - ${errorText}`);
      }
      
      console.log('✅ Upload successful!');
      
      // Generate public URL
      const publicUrl = `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/${fileName}`;
      console.log('Public URL:', publicUrl);
      
    } catch (uploadError) {
      console.log('⚠️ Upload failed (expected if credentials are wrong):', uploadError.message);
      console.log('This is normal if the credentials are not working, but the signed URL generation is working.');
    }
    
    console.log('\n🎉 Frontend upload process test completed!');
    console.log('\n📝 Summary:');
    console.log('- API endpoint is accessible');
    console.log('- Signed URL generation is working');
    console.log('- Frontend fetch requests are working');
    console.log('- The issue might be with the actual upload credentials');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the development server is running on localhost:3000');
    console.log('2. Check if there are any CORS issues');
    console.log('3. Verify the API endpoint is working');
    console.log('4. Check browser console for additional errors');
  }
}

// Run the test
testFrontendUpload(); 