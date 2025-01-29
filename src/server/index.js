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

// Log environment variables on startup
console.log('\nEnvironment Status:', {
  NODE_ENV: nodeEnv,
  FRONTEND_URL: frontendUrl,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'
});

const app = express();

// Middleware
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());

// Function to check and log directory contents
const logDirectoryContents = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`Contents of ${dirPath}:`);
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          console.log(` - [DIR] ${file}`);
          const subFiles = fs.readdirSync(fullPath);
          subFiles.forEach(subFile => {
            console.log(`   - ${subFile}`);
          });
        } else {
          console.log(` - ${file}`);
        }
      });
    } else {
      console.log(`Directory not found: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
};

// API Routes first
app.use('/api/strava', stravaWebhookRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  const distPath = path.join(__dirname, '../../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  res.json({ 
    status: 'healthy',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    build: {
      distExists: fs.existsSync(distPath),
      indexExists: fs.existsSync(indexPath),
      directory: __dirname,
      cwd: process.cwd()
    },
    env: {
      NODE_ENV: nodeEnv,
      FRONTEND_URL: frontendUrl,
      SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
      SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'
    }
  });
});

// Static file serving
if (nodeEnv === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  
  // Log directory contents for debugging
  console.log('\nChecking build directories...');
  logDirectoryContents(distPath);

  if (fs.existsSync(distPath)) {
    console.log('\nServing static files from:', distPath);
    app.use(express.static(distPath));
  } else {
    console.error('\nError: Build directory not found!');
    console.log('Current directory structure:');
    logDirectoryContents(path.join(__dirname, '../..'));
  }
} else {
  // In development, serve from public directory
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));
}

// SPA fallback - must be after static files
app.get('/*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const indexPath = path.join(__dirname, '../../dist/index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found. Please ensure the application is built correctly.');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: nodeEnv === 'development' ? err.message : 'Internal server error',
    path: req.path
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`\nServer running on port ${port} in ${nodeEnv} mode`);
  console.log(`Frontend URL: ${frontendUrl}`);
  console.log('Current directory:', __dirname);
  console.log('Process directory:', process.cwd());
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app; 