import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            {
                name: 'html-transform',
                transformIndexHtml(html) {
                    return html
                        .replace(
                            /<!-- ApiDomainPlaceholder -->/g,
                            `${env.VITE_API_DOMAIN}`
                        )
                        .replace(
                            '<!-- CoarInboxUrlPlaceholder -->',
                            `${env.VITE_COAR_NOTIFY_INBOX_URL}`
                        );
                },
            },
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @import "src/style/breakpoints.scss";
          `,
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('recharts')) return 'recharts';
                            if (id.includes('@citation-js/plugin-csl')) return 'plugin-csl';
                            if (id.includes('citation-js')) return 'citation-js';
                            return 'vendor';
                        }
                    },
                },
            },
            chunkSizeWarningLimit: 500,
        },
    };
});
