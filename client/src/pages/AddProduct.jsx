import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

// Add image compression function
const compressImage = async (file, maxSizeMB = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 800;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Try multiple compression levels if needed
        const tryCompression = (quality) => {
          canvas.toBlob(
            (blob) => {
              if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
                // If still too large, try with lower quality
                tryCompression(quality - 0.1);
              } else {
                resolve(blob);
              }
            },
            'image/jpeg',
            quality
          );
        };

        // Start with 0.7 quality
        tryCompression(0.7);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrl: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'home', name: 'Home & Garden', icon: '🏡' },
    { id: 'music', name: 'Musical Instruments', icon: '🎸' },
    { id: 'others', name: 'Others', icon: '📦' }
  ];

  const conditions = [
    { id: 'new', name: 'New', description: 'Brand new, unused item' },
    { id: 'like-new', name: 'Like New', description: 'Used once or twice, as good as new' },
    { id: 'good', name: 'Good', description: 'Some signs of wear, but well maintained' },
    { id: 'fair', name: 'Fair', description: 'Visible wear and tear, but functional' },
    { id: 'poor', name: 'Poor', description: 'Heavy wear, may need repairs' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/add-product' } });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }

    if (!formData.category) {
      errors.category = 'Please select a category';
    }

    if (!formData.condition) {
      errors.condition = 'Please select a condition';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.imageUrl) {
      errors.image = 'Please upload a product image';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setImageProcessing(true);
        setUploadProgress(10);
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
          setError('Image is too large. Please select an image under 10MB.');
          setImageProcessing(false);
          return;
        }

        setUploadProgress(30);
        let processedFile = file;
        
        // Compress if larger than 1MB
        if (file.size > 1 * 1024 * 1024) {
          processedFile = await compressImage(file);
          setUploadProgress(60);
        }

        const reader = new FileReader();
        reader.onloadstart = () => setUploadProgress(70);
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 30) + 70;
            setUploadProgress(progress);
          }
        };
        
        reader.onloadend = () => {
          setPreview(reader.result);
          setFormData(prev => ({ ...prev, imageUrl: reader.result }));
          setValidationErrors(prev => ({ ...prev, image: undefined }));
          setUploadProgress(100);
          setImageProcessing(false);
        };

        reader.readAsDataURL(processedFile);
      } catch (err) {
        setError('Error processing image. Please try again.');
        setImageProcessing(false);
        setUploadProgress(0);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max
    multiple: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Create a copy of form data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        owner: {
          username: user.username,
          id: user.id
        }
      };

      // Compress image if it exists
      if (formData.imageUrl) {
        try {
          setUploadProgress(0);
          // Extract the base64 data
          const base64Data = formData.imageUrl.split(',')[1];
          // Convert to Blob
          const blob = await fetch(formData.imageUrl).then(r => r.blob());
          
          setUploadProgress(30);
          // Compress with very aggressive settings
          const compressedBlob = await compressImage(blob, 0.2);
          setUploadProgress(60);
          
          // Convert back to base64
          const reader = new FileReader();
          const compressedBase64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(compressedBlob);
          });
          
          setUploadProgress(90);
          // Update the imageUrl with compressed version
          productData.imageUrl = compressedBase64;
          
          // Check final size
          if (compressedBase64.length > 1000000) { // 1MB limit
            throw new Error('Image is still too large after compression');
          }
        } catch (error) {
          console.error('Error compressing image:', error);
          setError('Image is too large. Please use a smaller image or try a different format.');
          setLoading(false);
          return;
        }
      }

      setUploadProgress(100);
      const result = await addProduct(productData);
      if (result.success) {
        setSuccess('Product added successfully! Redirecting...');
        setTimeout(() => navigate('/browse'), 2000);
      } else {
        setError(result.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Error adding product. Please try again with a smaller image.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Preview' }
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            {renderImageUpload()}
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3
                  ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product title"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`block w-full pl-7 pr-3 py-3 rounded-md focus:ring-indigo-500 focus:border-indigo-500
                    ${validationErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
              </div>
              {validationErrors.price && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: category.name }));
                      setValidationErrors(prev => ({ ...prev, category: undefined }));
                    }}
                    className={`p-6 rounded-lg border-2 text-center hover:border-indigo-500 transition-all
                      ${formData.category === category.name 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200'}`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
                ))}
              </div>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
              )}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {conditions.map(condition => (
                  <button
                    key={condition.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, condition: condition.name }));
                      setValidationErrors(prev => ({ ...prev, condition: undefined }));
                    }}
                    className={`w-full p-6 rounded-lg border-2 text-left hover:border-indigo-500 transition-all
                      ${formData.condition === condition.name 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200'}`}
                  >
                    <div className="font-medium">{condition.name}</div>
                    <div className="text-sm text-gray-500">{condition.description}</div>
                  </button>
                ))}
              </div>
              {validationErrors.condition && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.condition}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3
                  ${validationErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Describe your product in detail..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Characters: {formData.description.length}/1000
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Preview</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {preview && (
                  <img
                    src={preview}
                    alt="Product preview"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-900">{formData.title || 'Product Title'}</h4>
                    <p className="text-lg font-bold text-indigo-600">
                      ${parseFloat(formData.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="px-2 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                      {formData.category || 'Category'}
                    </span>
                    <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      {formData.condition || 'Condition'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.description || 'Product description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderImageUpload = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image <span className="text-red-500">*</span>
      </label>
      
      {/* Image URL Input */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Enter image URL"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            onChange={async (e) => {
              const url = e.target.value;
              if (url) {
                try {
                  setImageProcessing(true);
                  setUploadProgress(10);
                  
                  // Fetch the image from URL
                  const response = await fetch(url);
                  const blob = await response.blob();
                  
                  setUploadProgress(40);
                  
                  // Process the image
                  const processedBlob = await compressImage(blob, 0.2);
                  setUploadProgress(70);
                  
                  // Convert to base64
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result);
                    setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                    setValidationErrors(prev => ({ ...prev, image: undefined }));
                    setUploadProgress(100);
                    setImageProcessing(false);
                  };
                  reader.readAsDataURL(processedBlob);
                } catch (error) {
                  console.error('Error processing image URL:', error);
                  setError('Invalid image URL or unable to load image');
                  setImageProcessing(false);
                  setUploadProgress(0);
                }
              }
            }}
          />
          <button
            type="button"
            className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setPreview(null);
              setFormData(prev => ({ ...prev, imageUrl: '' }));
              setValidationErrors(prev => ({ ...prev, image: undefined }));
            }}
          >
            Clear
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Enter a direct link to an image (JPG, PNG, or WEBP)</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <div className="mt-4">
        <div
          {...getRootProps()}
          className={`mt-1 border-2 border-dashed rounded-lg p-6 cursor-pointer relative
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
            ${validationErrors.image ? 'border-red-500' : ''}
            ${imageProcessing ? 'cursor-wait' : ''}
            transition-all duration-200`}
        >
          <input {...getInputProps()} disabled={imageProcessing} />
          {imageProcessing ? (
            <div className="text-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Processing image... {uploadProgress}%</p>
            </div>
          ) : preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-64 w-auto rounded-lg object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                }}
              >
                <button
                  type="button"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag & drop an image, or click to select"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP up to 10MB (will be compressed if needed)
              </p>
            </div>
          )}
        </div>
      </div>
      {validationErrors.image && (
        <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="mt-2 text-gray-600">Fill in the details of your product</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => setActiveStep(step.number)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${activeStep >= step.number 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-200 text-gray-600'}`}
                    >
                      {step.number}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 transition-colors
                        ${activeStep > step.number ? 'bg-indigo-600' : 'bg-gray-200'}`} 
                      />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/browse')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                {activeStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Adding Product...
                      </span>
                    ) : (
                      'Add Product'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;