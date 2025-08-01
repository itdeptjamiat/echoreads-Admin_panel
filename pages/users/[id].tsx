import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getUserDetails } from '../../lib/api';

interface User {
  _id?: string;
  id?: string;
  uid?: number;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  userType?: string;
  profilePic?: string;
  plan?: string;
  isVerified?: boolean;
  resetPasswordOtpVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  joinDate?: string;
  lastLogin?: string;
  magazinesRead?: number;
  // API response wrapper
  user?: {
    _id?: string;
    uid?: number;
    username?: string;
    name?: string;
    email?: string;
    profilePic?: string;
    userType?: string;
    plan?: string;
    isVerified?: boolean;
    resetPasswordOtpVerified?: boolean;
    createdAt?: string;
  };
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
        console.log('Fetching user details for ID:', id);
        const result = await getUserDetails(id);
        console.log('User details result:', result);
        
        if (result.success && result.data) {
          console.log('User data received:', result.data);
          setUser(result.data);
        } else {
          console.log('Failed to fetch user details:', result.message);
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
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            User Details
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <img 
                    src={user.user?.profilePic || user.profilePic || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {user.user?.name || user.name || 'Unknown User'}
                  </h2>
                  <p className="text-blue-100 text-lg mb-1">
                    @{user.user?.username || user.username || 'unknown'}
                  </p>
                  <p className="text-blue-100">
                    {user.user?.email || user.email || 'No email available'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {user.user?.uid || user.uid || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">User ID</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {user.user?.userType || user.userType || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">User Type</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {user.user?.plan || user.plan || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Plan</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {user.user?.isVerified ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium text-gray-800">
                        {user.user?._id || user._id || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium text-gray-800">
                        {user.user?.username || user.username || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-800">
                        {user.user?.email || user.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium text-gray-800">
                        {user.user?.name || user.name || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Account Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">User Type:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (user.user?.userType || user.userType) === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.user?.userType || user.userType || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Plan:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (user.user?.plan || user.plan) === 'pro' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.user?.plan || user.plan || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Verified:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.user?.isVerified || user.isVerified
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.user?.isVerified || user.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Password Reset Verified:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.user?.resetPasswordOtpVerified || user.resetPasswordOtpVerified
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.user?.resetPasswordOtpVerified || user.resetPasswordOtpVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                  Account Timeline
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-800">Account Created</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(user.user?.createdAt || user.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail; 