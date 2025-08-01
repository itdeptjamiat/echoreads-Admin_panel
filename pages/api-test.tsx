import React, { useState } from 'react';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('Testing API endpoint...');
      
      const response = await fetch('/api/r2-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'test.jpg',
          fileType: 'image/jpeg',
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setResult(`Error: ${response.status} - ${errorText}`);
        return;
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.uploadURL) {
        setResult(`
          ✅ API Test Successful!
          
          Upload URL received: ${data.uploadURL.substring(0, 100)}...
          
          The API is working correctly.
        `);
      } else {
        setResult(`
          ❌ API Test Failed
          
          No upload URL in response
          
          Response: ${JSON.stringify(data)}
        `);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      setResult(`
        ❌ Fetch Error
        
        Error: ${error instanceof Error ? error.message : 'Unknown error'}
        
        This might be a CORS issue or the API is not accessible.
      `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Test Page</h1>
      <p>This page tests if the frontend can access the API endpoint.</p>
      
      <button 
        onClick={testAPI} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        whiteSpace: 'pre-line'
      }}>
        {result}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click the "Test API" button above</li>
          <li>Check the result below</li>
          <li>If successful, the upload should work</li>
          <li>If failed, check the browser console for more details</li>
        </ol>
      </div>
    </div>
  );
} 