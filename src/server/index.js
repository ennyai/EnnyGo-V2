import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import stravaWebhookRouter from './routes/strava-webhook.js';

// Global error handlers for uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in production, just log it
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process in production, just log it
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const nodeEnv = process.env.NODE_ENV || 'development';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// Enhanced logging middleware
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev', {
  skip: (req) => req.path === '/health' // Skip logging health checks
}));

// CORS configuration with error handling
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [frontendUrl];
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({
  limit: '10mb', // Increase payload limit if needed
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Verify dist directory exists before serving static files
const distPath = path.join(__dirname, '../../dist');
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory not found. Please run build command first.');
  process.exit(1);
}

// Inject environment variables into config.js
const configPath = path.join(distPath, 'config.js');
if (fs.existsSync(configPath)) {
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = configContent
      .replace('%%VITE_SUPABASE_URL%%', process.env.VITE_SUPABASE_URL || '')
      .replace('%%VITE_SUPABASE_ANON_KEY%%', process.env.VITE_SUPABASE_ANON_KEY || '');
    fs.writeFileSync(configPath, configContent);
  } catch (error) {
    console.error('Error injecting environment variables:', error);
    // Don't exit in production, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}

// Serve static files with caching headers
app.use(express.static(distPath, {
  maxAge: nodeEnv === 'production' ? '1d' : 0, // Cache for 1 day in production
  etag: true,
  lastModified: true
}));

// API Routes with error boundary
app.use('/api/strava', (req, res, next) => {
  try {
    stravaWebhookRouter(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  
  res.json(health);
});

// Serve React app for all other routes with proper error handling
app.get('*', (req, res, next) => {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return next(new Error('index.html not found. Please run build command first.'));
  }
  res.sendFile(indexPath);
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Log error details but don't expose them in production
  const errorResponse = {
    error: 'Something went wrong!',
    message: nodeEnv === 'development' ? err.message : 'Internal server error',
    status: err.status || 500,
    ...(nodeEnv === 'development' && { stack: err.stack })
  };
  
  res.status(errorResponse.status).json(errorResponse);
});

// Start server with retry mechanism
const startServer = async (retries = 5) => {
  try {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port} in ${nodeEnv} mode`);
      console.log(`Frontend URL: ${frontendUrl}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, retrying...`);
        setTimeout(() => {
          server.close();
          if (retries > 0) startServer(retries - 1);
        }, 1000);
      }
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Received kill signal, shutting down gracefully');
      server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    if (retries > 0) {
      console.log(`Retrying in 1 second... (${retries} attempts left)`);
      setTimeout(() => startServer(retries - 1), 1000);
    } else {
      process.exit(1);
    }
  }
};

startServer();

export default app; 