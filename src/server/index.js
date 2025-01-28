import dotenv from 'dotenv';
// Load environment variables silently (won't fail if .env is missing)
dotenv.config({ silent: true });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import stravaWebhookRouter from './routes/strava-webhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const nodeEnv = process.env.NODE_ENV || 'development';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// Middleware
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../dist')));

// API Routes
app.use('/api/strava', stravaWebhookRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    environment: nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
try {
  app.listen(port, () => {
    console.log(`Server running on port ${port} in ${nodeEnv} mode`);
    console.log(`Frontend URL: ${frontendUrl}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

export default app; 