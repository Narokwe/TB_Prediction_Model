import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // Absolute path
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') // For easier imports
    }
  }
})