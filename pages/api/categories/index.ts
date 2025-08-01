import { NextApiRequest, NextApiResponse } from 'next';

// In a real application, this would be stored in a database
// For now, we'll use a simple in-memory storage with some persistence
let categories = [
  'Technology',
  'Fashion',
  'Sports',
  'Health',
  'Business',
  'Travel',
  'Food',
  'Science',
  'Arts',
  'Environment',
  'Finance',
  'Education',
  'Lifestyle',
  'Automotive',
  'Home',
  'other'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all categories
        res.status(200).json({
          success: true,
          data: categories
        });
        break;

      case 'POST':
        // Add a new category
        const { name } = req.body;
        
        if (!name || typeof name !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required'
          });
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
          return res.status(400).json({
            success: false,
            message: 'Category name cannot be empty'
          });
        }

        if (categories.includes(trimmedName)) {
          return res.status(400).json({
            success: false,
            message: 'Category already exists'
          });
        }

        categories.push(trimmedName);
        
        res.status(201).json({
          success: true,
          message: 'Category added successfully',
          data: categories
        });
        break;

      case 'DELETE':
        // Delete a category
        const { categoryName } = req.body;
        
        if (!categoryName || typeof categoryName !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required for deletion'
          });
        }

        const trimmedCategoryName = categoryName.trim();
        const categoryIndex = categories.findIndex(cat => cat === trimmedCategoryName);
        
        if (categoryIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        // Remove the category
        categories.splice(categoryIndex, 1);
        
        res.status(200).json({
          success: true,
          message: 'Category deleted successfully',
          data: categories
        });
        break;

      case 'PUT':
        // Update a category
        const { oldName, newName } = req.body;
        
        if (!oldName || !newName || typeof oldName !== 'string' || typeof newName !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Both old and new category names are required'
          });
        }

        const trimmedOldName = oldName.trim();
        const trimmedNewName = newName.trim();
        
        if (!trimmedNewName) {
          return res.status(400).json({
            success: false,
            message: 'New category name cannot be empty'
          });
        }

        const updateIndex = categories.findIndex(cat => cat === trimmedOldName);
        if (updateIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        if (categories.includes(trimmedNewName) && trimmedOldName !== trimmedNewName) {
          return res.status(400).json({
            success: false,
            message: 'Category name already exists'
          });
        }

        // Update the category
        categories[updateIndex] = trimmedNewName;
        
        res.status(200).json({
          success: true,
          message: 'Category updated successfully',
          data: categories
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 