import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getMagazineDetails } from '../../lib/api';

interface Magazine {
  _id?: string;
  mid?: number;
  name?: string;
  image?: string;
  file?: string;
  type?: 'free' | 'pro';
  magzineType?: 'magzine' | 'article' | 'digest';
  description?: string;
  category?: string;
  isActive?: boolean;
  downloads?: number;
  rating?: number;
  createdAt?: string;
  fileType?: string;
  reviews?: any[];
}

const MagazineDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMagazineDetails = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid magazine ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getMagazineDetails(id);
        
        if (result.success && result.data) {
          setMagazine(result.data);
        } else {
          setError(result.message || 'Failed to fetch magazine details');
        }
      } catch (error) {
        console.error('Error fetching magazine details:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMagazineDetails();
  }, [id]);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'magzine':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200';
      case 'article':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200';
      case 'digest':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200';
    }
  };

  const getImageUrl = (imageUrl: string, magazineName: string) => {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      return `https://placehold.co/300x400/2563eb/ffffff?text=${encodeURIComponent(magazineName)}`;
    }
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/covers${imageUrl}`;
    }
    
    if (imageUrl.includes('pub-b8050509235e4bcca261901d10608e30.r2.dev')) {
      return imageUrl;
    }
    
    if (!imageUrl.includes('://')) {
      return `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/covers/${imageUrl}`;
    }
    
    return imageUrl;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Magazine Details</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Magazine Details...</h2>
            <p className="text-gray-500">Please wait while we fetch the magazine information.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !magazine) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Magazine Details</h1>
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Magazine Not Found</h2>
            <p className="text-gray-500 mb-4">{error || 'The magazine you\'re looking for doesn\'t exist.'}</p>
            <Link
              href="/magazines"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Magazine List
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Magazine Details: {magazine.name}</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Magazine Cover */}
            <div className="md:w-1/3 p-6">
              <img
                src={getImageUrl(magazine.image || '', magazine.name || '')}
                alt={`${magazine.name} cover`}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/300x400/2563eb/ffffff?text=${encodeURIComponent(magazine.name || '')}`;
                }}
              />
            </div>
            
            {/* Magazine Details */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{magazine.name}</h2>
              
              {magazine.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">{magazine.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-sm text-gray-500">Content Type</span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold border ${getTypeBadgeColor(magazine.magzineType || '')}`}>
                    {magazine.magzineType?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Access Type</span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold border ${magazine.type === 'free' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
                    {magazine.type?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Category</span>
                  <span className="block mt-1 text-gray-900 font-medium">{magazine.category || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Downloads</span>
                  <span className="block mt-1 text-gray-900 font-medium">{magazine.downloads || 0}</span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Rating</span>
                  <span className="block mt-1 text-gray-900 font-medium">{magazine.rating || 0}/5</span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Status</span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${magazine.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {magazine.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">Created Date</span>
                  <span className="block mt-1 text-gray-900 font-medium">{formatDate(magazine.createdAt)}</span>
                </div>
                
                <div>
                  <span className="block text-sm text-gray-500">File Type</span>
                  <span className="block mt-1 text-gray-900 font-medium">{magazine.fileType || 'PDF'}</span>
                </div>
              </div>
              
              {magazine.file && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Document</h3>
                  <a
                    href={magazine.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MagazineDetail; 