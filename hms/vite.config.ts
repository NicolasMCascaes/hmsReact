import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    host: true,
    allowedHosts: [
      'huggable-undignifiedly-diedre.ngrok-free.dev' 
    ],
    port: 5173,
  },
})
