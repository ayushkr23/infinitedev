import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/execute': 'http://localhost:5000',
      '/ai-help': 'http://localhost:5000'
    }
  }
})
