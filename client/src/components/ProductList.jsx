import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'

const products = [
  {
    id: 1,
    name: 'Vintage Camera',
    category: 'Electronics',
    description: 'A well-maintained vintage camera in excellent condition',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    owner: 'John Doe',
    condition: 'Excellent'
  },
  {
    id: 2,
    name: 'Mountain Bike',
    category: 'Sports',
    description: 'Professional mountain bike, perfect for trails',
    image: 'https://images.unsplash.com/photo-1576435728142-68cad339764c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    owner: 'Sarah Smith',
    condition: 'Good'
  },
  {
    id: 3,
    name: 'Guitar',
    category: 'Musical Instruments',
    description: 'Acoustic guitar with great sound quality',
    image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    owner: 'Mike Johnson',
    condition: 'Like New'
  },
]

const TradeModal = ({ isOpen, closeModal, product }) => {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // TODO: Implement actual trade proposal submission
      console.log('Trade proposal:', {
        proposedProduct: selectedProduct,
        targetProduct: product,
        message,
      })
      closeModal()
    } catch (error) {
      console.error('Error submitting trade proposal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Propose Trade for {product?.name}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                Select Your Product to Trade
              </label>
              <select
                id="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a product</option>
                <option value="product1">My Product 1</option>
                <option value="product2">My Product 2</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message to Owner
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write a message to the owner..."
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Sending...' : 'Send Proposal'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

const ProductCard = ({ product, onTradeClick }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div 
        className="cursor-pointer" 
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img className="h-48 w-full object-cover" src={product.image} alt={product.name} />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {product.category}
            </span>
            <span className="text-sm text-gray-500">Condition: {product.condition}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Owner: {product.owner}</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onTradeClick(product)}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Propose Trade
        </button>
      </div>
    </div>
  )
}

const ProductList = () => {
  const { products, loading } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">No products available</h3>
      </div>
    )
  }

  const handleTradeClick = (product) => {
    setSelectedProduct(product)
    setIsTradeModalOpen(true)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x200/e2e8f0/1e293b?text=No+Image';
            }}
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                {product.category}
              </span>
              <span className="px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                {product.condition}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Posted by {product.owner?.username || 'Unknown'}
              </span>
              <Link
                to={`/product/${product._id}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList 