import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options
  // Configure server options
  server: {
    port: 3000, // default: 5173
  },
})
