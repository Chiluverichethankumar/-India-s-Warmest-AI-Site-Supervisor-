// frontend/project/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Detect environment and set backend URL
const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://riverwood-ai-backend.onrender.com'
    : 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/memory': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
})
