import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-icons': ['react-icons'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-icons'],
  },
})