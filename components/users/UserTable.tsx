import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { deleteUser } from '../../lib/api';

interface User {
  _id: string;
  uid: number;
  username: string;
  name: string;
  email: string;
  role?: string;
  userType?: string;
  createdAt?: string;
  updatedAt?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
}

interface UserTableProps {
  users: User[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onRefresh?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  searchTerm, 
  onSearchChange, 
  currentPage, 
  onPageChange, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems,
  onRefresh
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleViewDetails = (uid: number) => {
    console.log('View details for user uid:', uid);
    router.push(`/users/${uid}`);
  };

  const handleDeleteClick = (uid: number, name: string) => {
    console.log('Delete clicked for user:', { uid, name });
    setShowDeleteConfirm(uid.toString());
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (uidString: string) => {
    try {
      console.log('Confirming delete for uid:', uidString);
      setDeletingId(uidString);
      setDeleteError(null);
      
      const result = await deleteUser(uidString);
      console.log('Delete result:', result);
      
      if (result.success) {
        // Close modal and refresh the list
        setShowDeleteConfirm(null);
        setDeletingId(null);
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setDeleteError(result.message || 'Failed to delete user');
        setDeletingId(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.uid.toString().includes(term)
    );
  }, [users, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} users
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white rounded-2xl shadow-soft border border-slate-200/50 overflow-hidden card-hover">
            <div className="p-6">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role || 'user')}`}>
                    {user.role || 'User'}
                  </span>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className="text-slate-600">{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-slate-600">ID: #{user.uid}</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-600">Joined {formatDate(user.createdAt || '')}</span>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.subscriptionStatus || 'active')}`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${
                    (user.subscriptionStatus || 'active').toLowerCase() === 'active' ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                  {user.subscriptionStatus || 'Active'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewDetails(user.uid)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => handleDeleteClick(user.uid, user.name)}
                  disabled={deletingId === user.uid.toString()}
                  className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === user.uid.toString() ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Delete User
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                {deleteError && (
                  <div className="mt-4 px-4 py-3 text-red-600 bg-red-100 border border-red-200 rounded-md">
                    <p className="text-sm">{deleteError}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200"
                >
                  {deletingId === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable; 