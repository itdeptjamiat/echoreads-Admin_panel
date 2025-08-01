import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getUserDetails } from '../../lib/api';

interface User {
  _id?: string;
  uid?: number;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  userType?: string;
  createdAt?: string;
  updatedAt?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  joinDate?: string;
  lastLogin?: string;
  magazinesRead?: number;
}

const UserDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid user ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getUserDetails(id);
        
        if (result.success && result.data) {
          setUser(result.data);
        } else {
          setError(result.message || 'Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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
            <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading User Details...</h2>
            <p className="text-gray-500">Please wait while we fetch the user information.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">User Not Found</h2>
            <p className="text-gray-500 mb-4">{error || 'The user you\'re looking for doesn\'t exist.'}</p>
            <Link
              href="/users"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Go to User List
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
          <h1 className="text-3xl font-bold text-gray-800">User Details: {user.name}</h1>
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
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="block text-sm text-gray-500">Subscription Status</span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(user.subscriptionStatus || 'unknown')}`}>{user.subscriptionStatus || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Subscription End Date</span>
              <span className="block mt-1 text-gray-800 font-medium">{formatDate(user.subscriptionEndDate)}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Join Date</span>
              <span className="block mt-1 text-gray-800 font-medium">{formatDate(user.joinDate)}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Last Login</span>
              <span className="block mt-1 text-gray-800 font-medium">{formatDate(user.lastLogin)}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Magazines Read</span>
              <span className="block mt-1 text-gray-800 font-medium">{user.magazinesRead ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail; 