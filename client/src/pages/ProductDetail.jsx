import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, buyProduct } = useProducts()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id)
        if (productData) {
          setProduct(productData)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Error loading product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, getProduct])

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/product/${id}` } })
      return
    }
    setShowBuyConfirmation(true)
  }

  const confirmPurchase = async () => {
    try {
      const result = await buyProduct(id)
      if (result.success) {
        navigate('/my-trades')
      } else {
        setError(result.message || 'Failed to purchase product')
      }
    } catch (err) {
      setError('Error processing purchase')
    } finally {
      setShowBuyConfirmation(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {error || 'Product Not Found'}
          </h2>
          <Link
            to="/browse"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative h-96 md:h-full min-h-[400px]">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image'
                }}
              />
            </div>

            {/* Product Details */}
            <div className="px-8 py-6 md:py-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${(product.price || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {product.category || 'Uncategorized'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {product.condition || 'Not specified'}
                  </span>
                </div>

                <div className="prose prose-sm text-gray-600 mb-6">
                  <p>{product.description || 'No description available'}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div>
                      <p className="font-medium">Owner</p>
                      <p>{product.owner?.username || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Listed on</p>
                      <p>{product.createdAt ? formatDate(product.createdAt) : 'Recently'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                  <p>{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleBuyClick}
                  disabled={!isAuthenticated}
                  className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white 
                    ${isAuthenticated 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-400 cursor-not-allowed'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200`}
                >
                  {isAuthenticated ? 'Buy Now' : 'Sign in to Buy'}
                </button>
                <Link
                  to="/browse"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Back to Browse
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* We'll implement this later */}
          </div>
        </div>
      </div>

      {/* Buy Confirmation Modal */}
      {showBuyConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Purchase
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to buy {product.title}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBuyConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail 