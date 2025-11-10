// // frontend/project/vite.config.ts
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // ✅ Detect environment and set backend URL
// const backendUrl =
//   process.env.NODE_ENV === 'production'
//     ? 'https://riverwood-ai-backend.onrender.com'
//     : 'http://localhost:8000'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: backendUrl,
//         changeOrigin: true,
//       },
//       '/memory': {
//         target: backendUrl,
//         changeOrigin: true,
//       },
//     },
//   },
// })

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'https://5b215cbc-1ad7-4c5e-98b6-f64c15b1b543-00-21fo8zr548pv6.janeway.replit.dev', changeOrigin: true },
      '/memory': { target: 'https://5b215cbc-1ad7-4c5e-98b6-f64c15b1b543-00-21fo8zr548pv6.janeway.replit.dev', changeOrigin: true },
    },
  },
});
