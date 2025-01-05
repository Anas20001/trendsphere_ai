import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',  // Add this to expose to network
    port: 5173,
    watch: {
      usePolling: true  // Needed for some environments
    }
  },
  // Handle CORS and other preview settings
  preview: {
    port: 5173,
    host: '0.0.0.0'
  }
});