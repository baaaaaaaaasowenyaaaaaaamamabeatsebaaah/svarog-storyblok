const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Railway provides PORT dynamically
const PORT = process.env.PORT || 3000;

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
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// IMPORTANT: Listen on 0.0.0.0 for Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
