import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Caching strategies and other options can be configured here
      // For now, let's focus on the manifest
      manifest: {
        name: 'Amar Campus',
        short_name: 'AmarCampus',
        description: 'Your Campus, Connected.',
        theme_color: '#082F49', // our primary deep blue
        background_color: '#F0F9FF', // our surface/background color
        icons: [
          {
            src: 'pwa-192x192.png', // we need to create these icon files
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})