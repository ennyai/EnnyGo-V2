import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Get Supabase variables from either format and clean any trailing semicolons
  const supabaseUrl = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').replace(/;$/, '');
  const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '').replace(/;$/, '');
  const frontendUrl = (env.FRONTEND_URL || '').replace(/;$/, '');

  // Log environment variables during build
  console.log('\nBuild Environment:', mode);
  console.log('Environment Variables Status:', {
    SUPABASE_URL: supabaseUrl ? 'present' : 'missing',
    SUPABASE_ANON_KEY: supabaseAnonKey ? 'present' : 'missing',
    FRONTEND_URL: frontendUrl ? 'present' : 'missing'
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('\nWARNING: Missing Supabase configuration!');
    console.log('Available environment variables:', Object.keys(env));
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Pass environment variables to the client
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'process.env.FRONTEND_URL': JSON.stringify(frontendUrl),
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
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        },
      },
      historyApiFallback: true
    }
  };
});
