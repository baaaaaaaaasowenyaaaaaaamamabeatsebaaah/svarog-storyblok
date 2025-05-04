import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Environment PORT:', process.env.PORT);
console.log('Using PORT:', PORT);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV,
  });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'production') {
    console.log(`Application is ready to accept requests on port ${PORT}`);
  } else {
    console.log(`Open http://localhost:${PORT} to view the application`);
  }
});
