const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

console.log('Starting server...');

// Initialize Firebase
try {
  console.log('Initializing Firebase...');
  require('./config/firebase');
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Route files
console.log('Loading routes...');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const streakRoutes = require('./routes/streakRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/flashcards', flashcardRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
const MAX_PORT_ATTEMPTS = 10;

// Try to start the server with port fallback
const startServer = (port, attempt = 1) => {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`Server running on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`);
        server.close();
        startServer(port + 1, attempt + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
};

// Start the server
startServer(PORT); 