import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config/api';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if image size is too large (greater than 1MB after compression)
      const base64Length = productData.imageUrl?.length || 0;
      if (base64Length > 1000000) { // 1MB in base64
        return { 
          success: false, 
          message: 'Image size is too large. Please use a smaller image or lower quality.' 
        };
      }

      // Split request into smaller chunks if needed
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productData,
          // Ensure price is a number
          price: parseFloat(productData.price) || 0
        }),
      });

      if (response.status === 413) {
        return { 
          success: false, 
          message: 'Image size is too large. Please use a smaller image or lower quality.' 
        };
      }

      const data = await response.json();
      if (data.success) {
        setProducts([data.product, ...products]);
        return { success: true, product: data.product };
      } else {
        return { success: false, message: data.message || 'Failed to add product' };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return { 
        success: false, 
        message: 'Error adding product. Please try again with a smaller image.' 
      };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      if (data.success) {
        // Ensure price exists and is a number
        const product = {
          ...data.product,
          price: data.product.price || 0 // Default to 0 if price is not set
        };
        return product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const buyProduct = async (productId) => {
    try {
      const product = await getProduct(productId);
      
      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      // Create a new trade without making an API call
      const trade = {
        id: Date.now(),
        productId,
        productName: product.title,
        price: product.price,
        purchaseDate: new Date().toISOString(),
        status: 'purchased',
        image: product.imageUrl,
        description: product.description,
        category: product.category,
        condition: product.condition,
        owner: product.owner
      };
      
      // Remove from products and add to trades
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      setTrades(prevTrades => [trade, ...prevTrades]);
      
      return { success: true, trade };
    } catch (error) {
      console.error('Error buying product:', error);
      return { success: false, message: 'Error processing purchase' };
    }
  };

  const sellProduct = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      // Add the product back to available products
      const product = {
        _id: Date.now().toString(),
        title: trade.productName,
        description: trade.description,
        category: trade.category,
        condition: trade.condition,
        price: trade.price,
        imageUrl: trade.image,
        createdAt: new Date().toISOString(),
        owner: { username: user?.username || 'Unknown User' }
      };
      
      setProducts(prevProducts => [product, ...prevProducts]);
      setTrades(prevTrades => prevTrades.filter(t => t.id !== tradeId));
      return { success: true, product };
    }
    return { success: false, message: 'Trade not found' };
  };

  const getTrades = () => {
    return trades;
  };

  const value = {
    products,
    trades,
    loading,
    addProduct,
    getProduct,
    fetchProducts,
    buyProduct,
    sellProduct,
    getTrades,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 