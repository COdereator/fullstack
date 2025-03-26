import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';

const MyTrades = () => {
  const { getTrades, sellProduct } = useProducts();
  const navigate = useNavigate();
  const trades = getTrades();
  const [showSellConfirmation, setShowSellConfirmation] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const handleSellClick = (trade) => {
    setSelectedTrade(trade);
    setShowSellConfirmation(true);
  };

  const confirmSell = () => {
    if (selectedTrade) {
      const result = sellProduct(selectedTrade.id);
      if (result) {
        navigate('/browse');
      }
    }
    setShowSellConfirmation(false);
  };

  if (trades.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Purchases Yet</h2>
          <p className="text-gray-600 mb-6">Start browsing products to make your first purchase!</p>
          <Link
            to="/browse"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Purchases</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="relative h-48">
                <img
                  src={trade.image}
                  alt={trade.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {trade.productName}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="text-gray-900">
                      {new Date(trade.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-indigo-600">
                      ${trade.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {trade.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Condition:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {trade.condition}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => handleSellClick(trade)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sell Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sell Confirmation Modal */}
      {showSellConfirmation && selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Sale
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sell {selectedTrade.productName} for ${selectedTrade.price.toFixed(2)}? 
              This will list the product back in the marketplace.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSellConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSell}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrades; 