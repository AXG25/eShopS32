import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/s3/', // Base URL para el proyecto en /s3
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-icons': ['react-icons'],
        },
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})