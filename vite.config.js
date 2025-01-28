import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Ensure environment variables are properly stringified
      __VITE_SUPABASE_URL__: `"${process.env.VITE_SUPABASE_URL}"`,
      __VITE_SUPABASE_ANON_KEY__: `"${process.env.VITE_SUPABASE_ANON_KEY}"`,
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
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      historyApiFallback: true
    }
  };
});
