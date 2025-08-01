import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Magazine } from '../../lib/mockData';
import { uploadToCloudflare, validateFile } from '../../lib/cloudflareStorage';
import { simpleUpload } from '../../lib/simpleUpload';

const categories = [
  'Technology', 'Fashion', 'Health', 'Business', 'Travel', 'Food', 'Sports', 'Science', 'Arts', 'Environment', 'Finance', 'Education', 'Lifestyle', 'Automotive', 'Home', 'other'
];

const magazineTypes = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' }
];

const magazineContentTypes = [
  { value: 'magzine', label: 'Magazine' },
  { value: 'article', label: 'Article' },
  { value: 'digest', label: 'Digest' }
];

interface MagazineFormProps {
  onSubmit?: (data: {
    name: string;
    description: string;
    category: string;
    type: 'free' | 'pro';
    magzineType: 'magzine' | 'article' | 'digest';
    image: string;
    file: string;
    coverImage: File | null;
    pdfFile: File | null;
  }) => void;
  onCancel?: () => void;
  initialData?: Magazine;
}

const MagazineForm: React.FC<MagazineFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [type, setType] = useState<'free' | 'pro'>('free');
  const [magzineType, setMagzineType] = useState<'magzine' | 'article' | 'digest'>('magzine');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ cover: 0, pdf: 0 });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFile(file, ['image/jpeg', 'image/png', 'image/webp'], 10 * 1024 * 1024); // 10MB for images
      if (!validation.valid) {
        setErrors({ ...errors, coverImage: validation.error || 'Invalid file' });
        return;
      }
      
      setErrors({ ...errors, coverImage: '' });
      setCoverImage(file);
    }
  };

  const handlePdfFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFile(file, ['application/pdf'], 50 * 1024 * 1024); // 50MB for PDFs
      if (!validation.valid) {
        setErrors({ ...errors, pdfFile: validation.error || 'Invalid file' });
        return;
      }
      
      setErrors({ ...errors, pdfFile: '' });
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setErrors({});

    try {
      let coverImageUrl = '';
      let pdfFileUrl = '';

      // Upload cover image if provided
      if (coverImage) {
        setUploadProgress(prev => ({ ...prev, cover: 25 }));
        try {
          const coverResult = await simpleUpload(coverImage, 'cover');
          if (!coverResult.success) {
            setErrors({ coverImage: coverResult.error || 'Failed to upload cover image' });
            setUploading(false);
            return;
          }
          coverImageUrl = coverResult.url || '';
          setUploadProgress(prev => ({ ...prev, cover: 100 }));
        } catch (error) {
          setErrors({ coverImage: 'Failed to upload cover image' });
          setUploading(false);
          return;
        }
      }

      // Upload PDF file if provided
      if (pdfFile) {
        setUploadProgress(prev => ({ ...prev, pdf: 50 }));
        try {
          const pdfResult = await simpleUpload(pdfFile, 'pdf');
          if (!pdfResult.success) {
            setErrors({ pdfFile: pdfResult.error || 'Failed to upload PDF file' });
            setUploading(false);
            return;
          }
          pdfFileUrl = pdfResult.url || '';
          setUploadProgress(prev => ({ ...prev, pdf: 100 }));
        } catch (error) {
          setErrors({ pdfFile: 'Failed to upload PDF file' });
          setUploading(false);
          return;
        }
      }

      const formData = {
        name,
        description,
        category,
        type,
        magzineType,
        image: coverImageUrl,
        file: pdfFileUrl,
        coverImage,
        pdfFile,
      };
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Default behavior: differentiate between add and update
        if (initialData) {
          // Update operation
          console.log('Updating magazine:', {
            id: initialData.id,
            originalTitle: initialData.title,
            updatedData: {
              name,
              description,
              category,
              type,
              image: coverImageUrl,
              file: pdfFileUrl,
            }
          });
        } else {
          // Add operation
          console.log('Adding new magazine:', {
            name,
            description,
            category,
            type,
            image: coverImageUrl,
            file: pdfFileUrl,
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: 'An unexpected error occurred during upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior: navigate back
      router.push('/magazines');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto grid grid-cols-1 gap-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Magazine Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Access Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'free' | 'pro')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {magazineTypes.map((magType) => (
            <option key={magType.value} value={magType.value}>
              {magType.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="magzineType" className="block text-sm font-medium text-gray-700 mb-1">
          Content Type
        </label>
        <select
          id="magzineType"
          value={magzineType}
                          onChange={(e) => setMagzineType(e.target.value as 'magzine' | 'article' | 'digest')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {magazineContentTypes.map((contentType) => (
            <option key={contentType.value} value={contentType.value}>
              {contentType.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
        <div className="flex items-center gap-4">
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {coverImage && (
            <span className="text-xs text-gray-500 truncate max-w-xs">{coverImage.name}</span>
          )}
        </div>
        {errors.coverImage && (
          <p className="text-red-600 text-sm mt-1">{errors.coverImage}</p>
        )}
        {uploadProgress.cover > 0 && uploadProgress.cover < 100 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress.cover}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading cover image... {uploadProgress.cover}%</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
        <div className="flex items-center gap-4">
          <input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={handlePdfFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {pdfFile && (
            <span className="text-xs text-gray-500 truncate max-w-xs">{pdfFile.name}</span>
          )}
        </div>
        {errors.pdfFile && (
          <p className="text-red-600 text-sm mt-1">{errors.pdfFile}</p>
        )}
        {uploadProgress.pdf > 0 && uploadProgress.pdf < 100 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress.pdf}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading document... {uploadProgress.pdf}%</p>
          </div>
        )}
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={uploading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MagazineForm; 