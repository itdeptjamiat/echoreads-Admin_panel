import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { fetchCategories, addCategory, deleteCategory, updateCategory } from '../../lib/api';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await fetchCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError(result.message || 'Failed to load categories');
      }
    } catch (error) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (categories.includes(trimmed)) {
      setError('Category already exists.');
      return;
    }

    try {
      setAddingCategory(true);
      const result = await addCategory(trimmed);
      if (result.success && result.data) {
        setCategories(result.data);
        setNewCategory('');
        setError('');
      } else {
        setError(result.message || 'Failed to add category');
      }
    } catch (error) {
      setError('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (idx: number) => {
    const categoryToDelete = categories[idx];
    if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
      try {
        const result = await deleteCategory(categoryToDelete);
        if (result.success && result.data) {
          setCategories(result.data);
          // If editing this category, exit edit mode
          if (editingIndex === idx) {
            setEditingIndex(null);
            setEditValue('');
          }
        } else {
          setError(result.message || 'Failed to delete category');
        }
      } catch (error) {
        setError('Failed to delete category');
      }
    }
  };

  const handleEditCategory = (idx: number) => {
    setEditingIndex(idx);
    setEditValue(categories[idx]);
    setError('');
  };

  const handleSaveEdit = async (idx: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (categories.includes(trimmed) && categories[idx] !== trimmed) {
      setError('Category already exists.');
      return;
    }

    try {
      const oldName = categories[idx];
      const result = await updateCategory(oldName, trimmed);
      if (result.success && result.data) {
        setCategories(result.data);
        setEditingIndex(null);
        setEditValue('');
        setError('');
      } else {
        setError(result.message || 'Failed to update category');
      }
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Enhanced Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Category Management</h1>
              <p className="text-sm text-gray-600">Manage and organize content categories</p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadCategories}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Category List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-lg font-medium text-gray-500 mb-2">No categories found</p>
              <p className="text-sm text-gray-400">Add your first category to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((cat, idx) => (
                <div key={cat} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                  {editingIndex === idx ? (
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                          {idx + 1}
                        </span>
                        <span className="text-gray-900">{cat}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(idx)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(idx)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Category Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => { setNewCategory(e.target.value); setError(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <button
              onClick={handleAddCategory}
              disabled={addingCategory || !newCategory.trim()}
              className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {addingCategory ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage; 