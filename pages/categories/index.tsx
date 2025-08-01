import React, { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const initialCategories = [
  'Technology',
  'Fashion',
  'Sports',
  'Health',
  'Business',
  'Travel',
];

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (categories.includes(trimmed)) {
      setError('Category already exists.');
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory('');
    setError('');
  };

  const handleDeleteCategory = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((_, i) => i !== idx));
      // If editing this category, exit edit mode
      if (editingIndex === idx) {
        setEditingIndex(null);
        setEditValue('');
      }
    }
  };

  const handleEditCategory = (idx: number) => {
    setEditingIndex(idx);
    setEditValue(categories[idx]);
    setError('');
  };

  const handleSaveEdit = (idx: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError('Category name cannot be empty.');
      return;
    }
    if (categories.includes(trimmed) && categories[idx] !== trimmed) {
      setError('Category already exists.');
      return;
    }
    setCategories(categories.map((cat, i) => (i === idx ? trimmed : cat)));
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
    setError('');
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Category Management</h1>

        {/* Category List */}
        <ul className="mb-6 bg-white rounded-lg shadow divide-y divide-gray-200">
          {categories.map((cat, idx) => (
            <li key={cat} className="px-6 py-3 text-gray-800 text-lg flex items-center justify-between first:rounded-t-lg last:rounded-b-lg">
              {editingIndex === idx ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  />
                  <button
                    onClick={() => handleSaveEdit(idx)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-md mr-2 transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{idx + 1}. {cat}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(idx)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Add Category Form */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => { setNewCategory(e.target.value); setError(''); }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Category
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage; 