import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        ws: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      },
      '/upload-avatar': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      },
      '/upload-contract': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three';
          }
          if (id.includes('node_modules/@apollo') || id.includes('node_modules/graphql')) {
            return 'graphql';
          }
        }
      }
    }
  }
})
