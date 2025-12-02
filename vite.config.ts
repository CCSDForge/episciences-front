import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import fs from 'fs-extra';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
// Plugin d'analyse des bundles - décommenter pour analyser la taille des chunks
// import { visualizer } from 'rollup-plugin-visualizer';

// Load .env.common first (common variables across all journals)
const commonEnvPath = path.resolve(__dirname, '.env.common');
if (fs.existsSync(commonEnvPath)) {
    const commonEnv = config({ path: commonEnvPath });
    if (commonEnv.parsed) {
        expand(commonEnv);
        // Inject common env variables into process.env so they're available
        Object.assign(process.env, commonEnv.parsed);
    }
}

export default defineConfig(({ mode }) => {
    // Load journal-specific env (will override common variables if defined)
    const env = loadEnv(mode, process.cwd(), '');
    const journalCode = env.VITE_JOURNAL_RVCODE;

    //console.log('Environment Variables:', env); // Add this line to log environment variables

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

    function updateRobotsTxt() {
        const robotsSourcePath = path.resolve(__dirname, 'public/robots.txt');
        const robotsTargetPath = path.resolve(__dirname, `dist/${journalCode}/robots.txt`);

        console.log(`Updating robots.txt at: ${robotsTargetPath}`); // Log the target path

        if (fs.existsSync(robotsSourcePath)) {
            let robotsContent = fs.readFileSync(robotsSourcePath, 'utf-8');
            //console.log('Original robots.txt content:', robotsContent); // Log original content

            robotsContent += `\nSitemap: https://${journalCode}.episciences.org/sitemap.xml`;
            //console.log('Updated robots.txt content:', robotsContent); // Log updated content

            fs.writeFileSync(robotsTargetPath, robotsContent);
            console.log(`Updated robots.txt with sitemap.xml: ${robotsTargetPath}`);
        } else {
            console.warn(`robots.txt not found: ${robotsSourcePath}`);
        }
    }

    // Copy logos before starting the dev server
    copyLogos();

    return {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler'
                }
            }
        },
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
            {
                // Custom plugin to copy and update robots.txt during build
                name: 'copy-robots-txt',
                apply: 'build',
                writeBundle() {
                    updateRobotsTxt();
                },
            },
            // Plugin d'analyse des bundles - décommenter pour analyser la composition des chunks
            // Génère stats.html (visualisation interactive) et stats.json dans dist/
            // visualizer({
            //     filename: `dist/${journalCode}/stats.html`,
            //     open: false,
            //     gzipSize: true,
            //     template: 'treemap', // 'sunburst', 'treemap', 'network'
            // }) as any,
            // visualizer({
            //     filename: `dist/${journalCode}/stats.json`,
            //     open: false,
            //     gzipSize: true,
            //     json: true,
            // }) as any,
        ],
        build: {
            outDir: path.resolve(__dirname, `dist/${journalCode}`),
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            // PDF.js - très volumineux, isolé
                            if (id.includes('pdfjs-dist')) return 'pdfjs';
                            if (id.includes('react-pdf')) return 'react-pdf';

                            // React core - bibliothèques fondamentales (AVANT les autres react-*)
                            if (id.includes('react/') || id.includes('react-dom') || id.includes('scheduler')) {
                                return 'react-core';
                            }

                            // React Router
                            if (id.includes('react-router') || id.includes('@remix-run')) {
                                return 'react-router';
                            }

                            // Redux ecosystem
                            if (id.includes('redux') && !id.includes('redux-persist')) {
                                return 'redux';
                            }
                            if (id.includes('redux-persist')) return 'redux-persist';

                            // i18n - internationalisation
                            if (id.includes('i18next') || id.includes('react-i18next')) {
                                return 'i18n';
                            }

                            // Charts et D3
                            if (id.includes('recharts') || id.includes('/d3-') ||
                                id.includes('victory-vendor')) {
                                return 'charts';
                            }

                            // Citation - moteur CSL très volumineux
                            if (id.includes('citeproc')) return 'citeproc';
                            if (id.includes('@citation-js/plugin-csl')) return 'plugin-csl';
                            if (id.includes('citation-js')) return 'citation-js';

                            // Forms
                            if (id.includes('react-hook-form')) return 'react-forms';

                            // CSS-in-JS - peut être volumineux
                            if (id.includes('styled-components') || id.includes('@emotion')) {
                                return 'css-in-js';
                            }

                            // UI libraries diverses
                            if (id.includes('swiper') || id.includes('react-toastify') ||
                                id.includes('react-loader-spinner') || id.includes('react-paginate') ||
                                id.includes('react-share')) {
                                return 'ui-libs';
                            }

                            // SEO & Meta
                            if (id.includes('react-helmet')) return 'react-helmet';

                            // Device detection
                            if (id.includes('react-device-detect') || id.includes('ua-parser-js')) {
                                return 'device-detect';
                            }

                            // Markdown parsing - très volumineux avec tous les micromark modules
                            if (id.includes('react-markdown') || id.includes('remark') ||
                                id.includes('unified') || id.includes('mathjax') ||
                                id.includes('better-react-mathjax') || id.includes('micromark') ||
                                id.includes('mdast-util') || id.includes('hast-util')) {
                                return 'markdown-math';
                            }

                            // Utilities volumineuses
                            if (id.includes('lodash')) return 'lodash';

                            // XML parsers
                            if (id.includes('xml2js') || id.includes('xmlbuilder') || id.includes('sax')) {
                                return 'xml-utils';
                            }

                            // Reste des dépendances
                            return 'vendor';
                        }
                    },
                },
            },
            chunkSizeWarningLimit: 500,
        },
        resolve: {
            alias: {
                'src': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            watch: {
                ignored: ['!**/external-assets/logos/**'],
            },
        },
    };
});