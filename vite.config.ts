import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import fs from 'fs-extra';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const journalCode = env.VITE_JOURNAL_RVCODE;

    // Paths for logo sources and target
    const logoSourceDir = path.resolve(__dirname, 'external-assets/logos');
    const logoTargetDir = path.resolve(__dirname, `public/logos`);

    function copyLogos() {
        if (journalCode) {
            const bigLogo = `logo-${journalCode}-big.svg`;
            const smallLogo = `logo-${journalCode}-small.svg`;

            // Ensure the target logos directory exists
            fs.ensureDirSync(logoTargetDir);

            // Copy big logo
            if (fs.existsSync(path.join(logoSourceDir, bigLogo))) {
                fs.copyFileSync(
                    path.join(logoSourceDir, bigLogo),
                    path.join(logoTargetDir, bigLogo)
                );
                //console.log(`Copied ${bigLogo} to ${logoTargetDir}`);
            } else {
                console.warn(`Big logo not found: ${bigLogo}`);
            }

            // Copy small logo
            if (fs.existsSync(path.join(logoSourceDir, smallLogo))) {
                fs.copyFileSync(
                    path.join(logoSourceDir, smallLogo),
                    path.join(logoTargetDir, smallLogo)
                );
                //console.log(`Copied ${smallLogo} to ${logoTargetDir}`);
            } else {
                console.warn(`Small logo not found: ${smallLogo}`);
            }
        }
    }

    // Copy logos before starting the dev server
    copyLogos();

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
                        )
                        .replace(
                            /<!-- MatomoDomainPlaceholder -->/g,
                            `${env.VITE_MATOMO_DOMAIN}`
                        )
                        .replace(
                            /<!-- MatomoSiteIdPlaceholder -->/g,
                            `${env.VITE_MATOMO_SITEID}`
                        );
                },
            },
            {
                // Custom plugin to copy logos during server start
                name: 'copy-logos-on-dev',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        copyLogos(); // Ensure logos are copied whenever the server is initialized
                        next();
                    });
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
            outDir: path.resolve(__dirname, `dist/${journalCode}`),
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
        server: {
            watch: {
                ignored: ['!**/external-assets/logos/**'],
            },
        },
    };
});
