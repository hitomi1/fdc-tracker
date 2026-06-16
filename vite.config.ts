import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/fdc-tracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logofdc.png'],
      manifest: {
        name: 'Fora da Caixa — Event Tracker',
        short_name: 'FDC',
        description: 'Offline MTG draft event tracker da comunidade Fora da Caixa',
        start_url: '.',
        display: 'standalone',
        background_color: '#0f0f1a',
        theme_color: '#1a1a2e',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'logofdc.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
