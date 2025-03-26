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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Serve static files from the React app build directory
// Check for both possible locations of the client build
const clientBuildPath = path.join(__dirname, '../client/dist');
const serverPublicPath = path.join(__dirname, 'public');

// First try the client/dist directory
if (require('fs').existsSync(clientBuildPath)) {
  console.log(`Serving static files from ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));
} 
// Then try the server/public directory
else if (require('fs').existsSync(serverPublicPath)) {
  console.log(`Serving static files from ${serverPublicPath}`);
  app.use(express.static(serverPublicPath));
} else {
  console.log('No static files directory found');
}

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
  // Try to find index.html in both possible locations
  const clientIndexPath = path.join(__dirname, '../client/dist/index.html');
  const serverIndexPath = path.join(__dirname, 'public/index.html');
  
  if (require('fs').existsSync(clientIndexPath)) {
    res.sendFile(clientIndexPath);
  } else if (require('fs').existsSync(serverIndexPath)) {
    res.sendFile(serverIndexPath);
  } else {
    res.status(404).send('Application not properly deployed. Build files not found.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 