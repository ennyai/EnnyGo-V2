const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route - keep it simple
app.get('/health', (req, res) => {
  console.log(`[health-check] ${new Date().toISOString()}`);
  res.sendStatus(200);
});

// Serve the built Vite files
app.use(express.static(path.join(__dirname, 'dist')));

// For react-router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[startup] Server listening on port ${PORT}`);
}); 