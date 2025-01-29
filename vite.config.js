import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Log environment variables during build
  console.log('Environment Variables Status:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'present' : 'missing',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing',
    MODE: mode
  });

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Pass environment variables to the client using the loaded env object
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.MODE': JSON.stringify(mode)
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
      sourcemap: true,
      // Ensure environment variables are replaced during build
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
      host: true, // needed for docker/railway
      proxy: {
        '/api': {
          target: process.env.NODE_ENV === 'production' 
            ? 'https://ennygo-v2-production.up.railway.app'
            : 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      historyApiFallback: true
    }
  };
});
