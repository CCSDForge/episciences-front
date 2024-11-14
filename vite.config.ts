import {defineConfig} from 'vite'
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
                    if (id.includes('node_modules')) {
                        // Group larger dependencies by category
                        // See https://bundlephobia.com/
                        if (id.includes('recharts')) {
                            return 'recharts';
                        } else if (id.includes('@citation-js/plugin-csl')) {
                            return 'plugin-csl';
                        } else if (id.includes('citation-js')) {
                            return 'citation-js';
                        } else {
                            return 'vendor'; // General vendor chunk
                        }
                    }
                }
            }
        },
        chunkSizeWarningLimit: 500 // Lowered limit for testing smaller chunks
    }
})
