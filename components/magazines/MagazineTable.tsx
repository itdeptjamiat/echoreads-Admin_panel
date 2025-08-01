import React, { useState, useMemo } from 'react';
import { deleteMagazine } from '../../lib/api';

interface Magazine {
  id?: string;
  mid?: number;
  name: string;
  image: string;
  file: string;
  type: 'free' | 'pro';
  description?: string;
  category?: string;
  isActive?: boolean;
  downloads?: number;
  rating?: number;
  createdAt?: string;
}

interface MagazineTableProps {
  magazines: Magazine[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  loading?: boolean;
  onRefresh?: () => void;
}

const MagazineTable: React.FC<MagazineTableProps> = ({ 
  magazines, 
  searchTerm, 
  onSearchChange, 
  currentPage, 
  onPageChange, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems,
  loading = false,
  onRefresh
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    console.log('Edit magazine:', id);
    // Navigate to edit page or open edit modal
  };

  const handleDeleteClick = (id: string, name: string) => {
    setShowDeleteConfirm(id);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeletingId(id);
      setDeleteError(null);
      
      // Convert id to number (mid)
      const mid = parseInt(id);
      if (isNaN(mid)) {
        throw new Error('Invalid magazine ID');
      }
      
      const result = await deleteMagazine(mid);
      
      if (result.success) {
        // Close modal and refresh the list
        setShowDeleteConfirm(null);
        setDeletingId(null);
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setDeleteError(result.message || 'Failed to delete magazine');
        setDeletingId(null);
      }
    } catch (error) {
      console.error('Error deleting magazine:', error);
      setDeleteError('An unexpected error occurred');
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
    setDeleteError(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'pro' 
      ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200' 
      : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200';
  };

  const getImageUrl = (imageUrl: string, magazineName: string) => {
    // If image URL is empty, null, or undefined, return placeholder
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      return `https://placehold.co/300x400/2563eb/ffffff?text=${encodeURIComponent(magazineName)}`;
    }
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, construct the full URL
    if (imageUrl.startsWith('/')) {
      return `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/covers${imageUrl}`;
    }
    
    // For Cloudflare R2 URLs, ensure they use the correct format
    if (imageUrl.includes('pub-b8050509235e4bcca261901d10608e30.r2.dev')) {
      return imageUrl;
    }
    
    // If it's a filename only, construct the full R2 URL
    if (!imageUrl.includes('://')) {
      return `https://pub-b8050509235e4bcca261901d10608e30.r2.dev/covers/${imageUrl}`;
    }
    
    // Default to the image URL as provided
    return imageUrl;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, magazineName: string) => {
    const target = e.target as HTMLImageElement;
    console.log(`Image failed to load for "${magazineName}":`, target.src);
    target.src = `https://placehold.co/300x400/2563eb/ffffff?text=${encodeURIComponent(magazineName)}`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Controls */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search magazines by name, category, or type..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            )}
            
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <span className="font-medium">{totalItems}</span> magazines
              {searchTerm && (
                <span className="text-gray-500"> matching "{searchTerm}"</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading magazines...
          </div>
        </div>
      )}

      {/* Mobile Card List */}
      {!loading && (
        <div className="block lg:hidden px-6">
          <div className="space-y-4">
            {magazines.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No magazines found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new magazine'}
                </p>
              </div>
            )}
            
            {magazines.map((magazine, index) => (
              <div
                key={magazine.id || magazine.mid}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(magazine.image, magazine.name)}
                      alt={`${magazine.name} cover`}
                      className="w-20 h-28 object-cover rounded-lg shadow-sm border border-gray-200 magazine-cover"
                      onError={(e) => handleImageError(e, magazine.name)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{magazine.name}</h3>
                        {magazine.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{magazine.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(magazine.type)}`}>
                          {magazine.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      {magazine.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {magazine.category}
                        </span>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {magazine.downloads || 0} downloads
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(magazine.createdAt || '')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(magazine.id || magazine.mid?.toString() || '')}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteClick(magazine.id || magazine.mid?.toString() || '', magazine.name)}
                    disabled={deletingId === (magazine.id || magazine.mid?.toString())}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === (magazine.id || magazine.mid?.toString()) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cover</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name & Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {magazines.map((magazine: Magazine, index) => (
                  <tr 
                    key={magazine.id || magazine.mid} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(magazine.image, magazine.name)}
                        alt={`${magazine.name} cover`}
                        className="w-16 h-20 object-cover rounded-lg shadow-sm border border-gray-200 magazine-cover"
                        onError={(e) => handleImageError(e, magazine.name)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{magazine.name}</div>
                      {magazine.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-xs">{magazine.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(magazine.type)}`}>
                        {magazine.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {magazine.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {magazine.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {magazine.downloads || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(magazine.createdAt || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(magazine.id || magazine.mid?.toString() || '')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(magazine.id || magazine.mid?.toString() || '', magazine.name)}
                          disabled={deletingId === (magazine.id || magazine.mid?.toString())}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === (magazine.id || magazine.mid?.toString()) ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-700" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State for desktop */}
          {magazines.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No magazines found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new magazine'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white">
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Magazine
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{magazines.find(m => (m.id || m.mid?.toString()) === showDeleteConfirm)?.name}"?
                  This action cannot be undone.
                </p>
              </div>
              {deleteError && (
                <div className="mt-4 px-4 py-3 text-red-600 bg-red-100 border border-red-200 rounded-md">
                  <p>{deleteError}</p>
                </div>
              )}
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={deletingId === showDeleteConfirm}
                >
                  {deletingId === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-200 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineTable; 