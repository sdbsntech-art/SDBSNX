import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('/node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          if (id.includes('/node_modules/pdfjs-dist/')) {
            return 'vendor-pdfjs';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true
  }
});
