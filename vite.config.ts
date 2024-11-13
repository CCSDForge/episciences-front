import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/style/breakpoints.scss";
        `
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor dependencies (node_modules) into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor'; // All node_modules go into the "vendor" chunk
          }

          // Optionally, customize this further to separate other large modules
          // Example: Split a specific module into its own chunk
          //if (id.includes('src/components')) {
          //  return 'components';
          //}
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Optional: increase the chunk size limit if needed
  }
})
