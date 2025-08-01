import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';
import MagazineTable from '../../components/magazines/MagazineTable';
import { fetchMagazines } from '../../lib/api';

const MagazinesList: React.FC = () => {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load magazines from API
  useEffect(() => {
    loadMagazines();
  }, []);

  const loadMagazines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchMagazines();
      
      if (result.success && result.data) {
        console.log('Magazines data received:', result.data);
        setMagazines(result.data);
      } else {
        setError(result.message || 'Failed to load magazines');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading magazines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter magazines based on search term
  const filteredMagazines = useMemo(() => {
    return magazines.filter((magazine: any) =>
      magazine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.magzineType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [magazines, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMagazines = filteredMagazines.slice(startIndex, endIndex);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = magazines.length;
    const magazineCount = magazines.filter((m: any) => m.magzineType === 'magzine').length;
    const articleCount = magazines.filter((m: any) => m.magzineType === 'article').length;
    const digestCount = magazines.filter((m: any) => m.magzineType === 'digest').length;
    const totalDownloads = magazines.reduce((sum: number, m: any) => sum + (m.downloads || 0), 0);
    
    return { total, magazineCount, articleCount, digestCount, totalDownloads };
  }, [magazines]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Enhanced Header Section */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Magazine Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and organize your digital magazine collection
              </p>
            </div>
            
            {/* Add New Magazine Button */}
            <div className="mt-4 lg:mt-0 lg:ml-4">
              <Link 
                href="/magazines/add"
                className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 border border-transparent text-sm lg:text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add New Magazine</span>
                <span className="sm:hidden">Add Magazine</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Magazines */}
            <div className="stats-card bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Magazines</p>
                  <p className="text-lg lg:text-2xl font-bold text-blue-600">{stats.magazineCount}</p>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="stats-card bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Articles</p>
                  <p className="text-lg lg:text-2xl font-bold text-green-600">{stats.articleCount}</p>
                </div>
              </div>
            </div>

            {/* Digests */}
            <div className="stats-card bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Digests</p>
                  <p className="text-lg lg:text-2xl font-bold text-purple-600">{stats.digestCount}</p>
                </div>
              </div>
            </div>

            {/* Total Downloads */}
            <div className="stats-card bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-lg lg:text-2xl font-bold text-orange-600">{stats.totalDownloads.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Magazines</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Magazine Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <MagazineTable 
              magazines={currentMagazines}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredMagazines.length}
              loading={loading}
              onRefresh={loadMagazines}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MagazinesList; 