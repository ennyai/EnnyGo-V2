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
  origin: [frontendUrl, 'http://localhost:3000', 'http://localhost:3001'],
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

// Function to check and log directory contents
const logDirectoryContents = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`Contents of ${dirPath}:`);
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        console.log(` - ${file}`);
      });
    } else {
      console.log(`Directory not found: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
};

// In production, serve static files and log directory contents
if (nodeEnv === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  const publicPath = path.join(__dirname, '../../public');

  // Log directory contents for debugging
  logDirectoryContents(distPath);
  logDirectoryContents(publicPath);

  // Serve static files from dist directory
  if (fs.existsSync(distPath)) {
    console.log('Serving static files from:', distPath);
    app.use(express.static(distPath, { maxAge: '1h' }));
  }

  // Fallback to public directory
  if (fs.existsSync(publicPath)) {
    console.log('Serving static files from:', publicPath);
    app.use(express.static(publicPath, { maxAge: '1h' }));
  }
} else {
  // In development, serve from public directory
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));
}

// API Routes
app.use('/api/strava', stravaWebhookRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    directories: {
      dist: fs.existsSync(path.join(__dirname, '../../dist')),
      public: fs.existsSync(path.join(__dirname, '../../public'))
    }
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../dist/index.html');
  console.log('Attempting to serve:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    const publicIndexPath = path.join(__dirname, '../../public/index.html');
    
    if (fs.existsSync(publicIndexPath)) {
      console.log('Serving from public directory instead');
      res.sendFile(publicIndexPath);
    } else {
      res.status(404).send(`
        Application files not found. Build status:
        - Dist index.html: ${fs.existsSync(indexPath)}
        - Public index.html: ${fs.existsSync(publicIndexPath)}
        Please ensure the application is built correctly.
      `);
    }
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
    console.log('Current directory:', __dirname);
    console.log('Process directory:', process.cwd());
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

export default app; 