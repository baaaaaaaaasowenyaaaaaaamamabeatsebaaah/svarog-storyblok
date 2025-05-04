const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
// Railway provides PORT dynamically
const PORT = process.env.PORT || 3000;

// Debug logging
console.log('Starting server...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);
console.log('Process directory:', process.cwd());

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist folder does not exist!');
  console.error('Please run "npm run build" first');
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.html does not exist!');
  console.error('Build may have failed');
  process.exit(1);
}

console.log('dist folder found:', distPath);
console.log('Files in dist:', fs.readdirSync(distPath));

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://app.storyblok.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'http:', '*.storyblok.com'],
        connectSrc: [
          "'self'",
          'https://api.storyblok.com',
          'https://app.storyblok.com',
          'wss://ws.storyblok.com',
        ],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ['https://app.storyblok.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Compression middleware
app.use(compression());

// Serve static files
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.match(/\.(js|css|jpg|jpeg|png|gif|svg|ico)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Handle client-side routing
app.get('*', (req, res) => {
  const indexFile = path.join(__dirname, 'dist', 'index.html');

  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke!');
});

// IMPORTANT: Listen on 0.0.0.0 for Railway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server URL: http://0.0.0.0:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
