import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

// Inject environment variables into config.js
const configPath = path.join(__dirname, '../../dist/config.js');
if (fs.existsSync(configPath)) {
  let configContent = fs.readFileSync(configPath, 'utf8');
  configContent = configContent
    .replace('%%VITE_SUPABASE_URL%%', process.env.VITE_SUPABASE_URL || '')
    .replace('%%VITE_SUPABASE_ANON_KEY%%', process.env.VITE_SUPABASE_ANON_KEY || '');
  fs.writeFileSync(configPath, configContent);
}

// Serve static files from the React app
if (nodeEnv === 'production') {
  // In production, serve from the dist directory
  const distPath = path.join(__dirname, '../../dist');
  const publicPath = path.join(__dirname, '../../public');
  
  // Check if dist directory exists
  if (fs.existsSync(distPath)) {
    console.log('Serving static files from:', distPath);
    app.use(express.static(distPath));
  } else {
    console.log('Warning: dist directory not found');
  }
  
  // Also serve from public directory if it exists
  if (fs.existsSync(publicPath)) {
    console.log('Serving static files from:', publicPath);
    app.use(express.static(publicPath));
  }
} else {
  // In development, serve from the public directory
  app.use(express.static(path.join(__dirname, '../../public')));
}

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
  const indexPath = path.join(__dirname, '../../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application files not found. Please ensure the application is built correctly.');
  }
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