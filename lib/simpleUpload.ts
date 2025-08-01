// Simple upload method that doesn't rely on signed URLs
export const simpleUpload = async (file: File, folder: string = 'cover'): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    console.log('Starting simple upload for:', file.name);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}s/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    formData.append('fileName', fileName);
    formData.append('folder', folder);
    
    // Upload directly to the upload API
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error:', errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Upload result:', result);
    
    if (result.success && result.url) {
      return {
        success: true,
        url: result.url,
      };
    } else {
      throw new Error(result.error || 'Upload failed');
    }
    
  } catch (error) {
    console.error('Simple upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}; 