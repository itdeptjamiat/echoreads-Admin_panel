import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';
import MagazineForm from '../../components/magazines/MagazineForm';
import { magazines } from '../../lib/mockData';

const EditMagazine: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Find the magazine by ID
  const magazine = magazines.find(mag => mag.id === id);

  const handleSubmit = (formData: {
    title: string;
    description: string;
    publisher: string;
    category: string;
    coverImage: File | null;
    pdfFile: File | null;
  }) => {
    // Placeholder onSubmit function that logs the form data
    console.log('Magazine updated with data:', {
      id,
      title: formData.title,
      description: formData.description,
      publisher: formData.publisher,
      category: formData.category,
      coverImage: formData.coverImage ? formData.coverImage.name : null,
      pdfFile: formData.pdfFile ? formData.pdfFile.name : null,
    });
    
    // Here you would typically handle the actual form submission
    // For now, just log the data and show a success message
    alert('Magazine updated successfully! Check console for data.');
  };

  const handleCancel = () => {
    // Navigate back to magazine list
    router.push('/magazines');
  };

  if (!magazine) {
    return (
      <AdminLayout>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Magazine</h1>
            
            {/* Back to Magazine List Link */}
            <Link
              href="/magazines"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Magazine List</span>
            </Link>
          </div>

          {/* Magazine Not Found */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Magazine Not Found</h2>
              <p className="text-gray-500 mb-4">The magazine you're looking for doesn't exist.</p>
              <Link
                href="/magazines"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Return to Magazine List
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Magazine: {magazine.title}
          </h1>
          
          {/* Back to Magazine List Link */}
          <Link
            href="/magazines"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Magazine List</span>
          </Link>
        </div>

        {/* Magazine Form with Initial Values */}
        <MagazineForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          initialData={magazine}
        />
      </div>
    </AdminLayout>
  );
};

export default EditMagazine; 