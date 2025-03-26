const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Add default products if none exist
const Product = require('./models/Product');
const User = require('./models/User');

const addDefaultProducts = async () => {
  try {
    const productsCount = await Product.countDocuments();
    
    if (productsCount === 0) {
      // Create a default user if none exists
      let defaultUser = await User.findOne({ email: 'admin@example.com' });
      
      if (!defaultUser) {
        defaultUser = await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123'
        });
      }

      // Add default products
      const defaultProducts = [
        {
          title: 'iPhone 13',
          description: 'Like new iPhone 13 128GB in midnight black',
          category: 'Electronics',
          condition: 'Like New',
          imageUrl: 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=800&q=80',
          owner: defaultUser._id
        },
        {
          title: 'Nike Air Max',
          description: 'Size 10 Nike Air Max, worn only a few times',
          category: 'Fashion',
          condition: 'Good',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          owner: defaultUser._id
        },
        {
          title: 'PlayStation 5',
          description: 'PS5 with two controllers and 3 games',
          category: 'Gaming',
          condition: 'New',
          imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
          owner: defaultUser._id
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log('Default products added successfully');
    }
  } catch (error) {
    console.error('Error adding default products:', error);
  }
};

// Call the function to add default products
addDefaultProducts();

// The "catch-all" handler: for any request that doesn't match the ones above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 