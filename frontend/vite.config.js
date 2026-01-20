// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.png'], // Inclui o logo nos assets cacheados
            manifest: {
                name: 'RPA ROI Navigator',
                short_name: 'ROI Navigator',
                description: 'Calculadora de ROI para Automações RPA',
                theme_color: '#1a237e',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'logo.png', // Aponta para o arquivo na pasta public
                        sizes: '192x192', // O navegador tentará redimensionar
                        type: 'image/png',
                    },
                    {
                        src: 'logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    }
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
            },
        }),
    ],
    server: {
        port: 5173,
        open: true,
    },
});