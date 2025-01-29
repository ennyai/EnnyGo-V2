import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Log environment variables during build
  console.log('Build Environment:', mode);
  console.log('Environment Variables Status:', {
    SUPABASE_URL: env.VITE_SUPABASE_URL ? 'present' : 'missing',
    SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing',
    FRONTEND_URL: env.FRONTEND_URL ? 'present' : 'missing'
  });

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Pass environment variables to the client
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.FRONTEND_URL': JSON.stringify(env.FRONTEND_URL),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.js',
      css: true,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              'react',
              'react-dom',
              'react-router-dom',
              'react-redux',
              '@reduxjs/toolkit'
            ],
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true, // needed for docker/railway
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      historyApiFallback: true
    }
  };
});
