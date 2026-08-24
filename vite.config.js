import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages 및 상대 경로 배포 호환
  server: {
    port: 3000,
    open: true
  }
})
