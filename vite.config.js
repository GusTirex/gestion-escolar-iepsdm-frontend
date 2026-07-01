import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Permite servir a traves de tuneles (trycloudflare, ngrok, etc.)
    allowedHosts: true,
    // Enruta /api al backend Spring Boot => mismo origen, sin CORS
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
