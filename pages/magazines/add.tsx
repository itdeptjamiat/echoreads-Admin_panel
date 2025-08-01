import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import MagazineForm from '../../components/magazines/MagazineForm';
import { createMagazine } from '../../lib/api';

const AddMagazine: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    category: string;
    type: 'free' | 'pro';
    magzineType: 'magzine' | 'article' | 'digest ';
    image: string;
    file: string;
    coverImage: File | null;
    pdfFile: File | null;
  }) => {
    try {
      console.log('Form submitted with data:', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        magzineType: formData.magzineType,
        image: formData.image,
        file: formData.file,
      });
      
      // Send the data to your API
      const result = await createMagazine({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        magzineType: formData.magzineType,
        image: formData.image,
        file: formData.file,
      });

      if (result.success) {
        alert('Magazine created successfully!');
        router.push('/magazines');
      } else {
        alert(`Error creating magazine: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting magazine:', error);
      alert('Error submitting magazine. Please try again.');
    }
  };

  const handleCancel = () => {
    // Placeholder onCancel function that navigates back to /magazines
    router.push('/magazines');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Magazine</h1>
          
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

        {/* Magazine Form */}
        <MagazineForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </AdminLayout>
  );
};

export default AddMagazine; 