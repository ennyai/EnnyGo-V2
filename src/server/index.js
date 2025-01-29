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

// Use Railway's PORT in production, fallback to 3000 in development
const port = process.env.PORT || 3000;
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
    
    const allowedOrigins = [
      frontendUrl,
      'https://ennygo-v2-production.up.railway.app',
      'https://ennygo-v2-production.railway.app',
      'https://ennygo-v2.railway.internal',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.warn(`Rejected CORS request from origin: ${origin}`);
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
      .replace('%%VITE_SUPABASE_URL%%', process.env.SUPABASE_URL || '')
      .replace('%%VITE_SUPABASE_ANON_KEY%%', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
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
    cpuUsage: process.cpuUsage(),
    port: port
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
    // Log environment information
    console.log('Starting server with configuration:');
    console.log('- PORT:', port);
    console.log('- NODE_ENV:', nodeEnv);
    console.log('- FRONTEND_URL:', frontendUrl);
    console.log('- Process ID:', process.pid);
    console.log('- Platform:', process.platform);
    console.log('- Node Version:', process.version);
    console.log('- Memory Usage:', process.memoryUsage());
    console.log('- Current Directory:', process.cwd());
    console.log('- Dist Path:', distPath);
    console.log('- Dist exists:', fs.existsSync(distPath));

    // Try to list dist directory contents
    try {
      const distContents = fs.readdirSync(distPath);
      console.log('- Dist contents:', distContents);
    } catch (err) {
      console.error('Error reading dist directory:', err);
    }

    const server = app.listen(port, '::', () => {
      console.log(`\nServer successfully started:`);
      console.log(`- Port: ${port}`);
      console.log(`- Environment: ${nodeEnv}`);
      console.log(`- Frontend URL: ${frontendUrl}`);
      console.log('- Server is ready to handle requests\n');

      // Test if we can make a request to our own health endpoint using fetch
      fetch(`http://localhost:${port}/health`)
        .then(response => response.json())
        .then(data => {
          console.log('Health check response:', data);
        })
        .catch(error => {
          console.error('Health check failed:', error);
        });
    });

    server.on('error', (error) => {
      console.error('Detailed server error:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      });

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
    console.error('Detailed startup error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno
    });
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
