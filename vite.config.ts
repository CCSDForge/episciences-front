import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html'
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/style/breakpoints.scss";
        `
      }
    }
  },
  preview: {
    port: 5173
  },
  server: {
    port: 5173
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'citation-vendor': ['@citation-js/core', '@citation-js/plugin-csl', '@citation-js/plugin-doi'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'remark-parse', 'unified'],
          'recharts-vendor': ['recharts'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'router-vendor': ['react-router-dom'],
        }
      }
    }
  }
});