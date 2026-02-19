import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Some synced/network drives block creating a folder named "dist".
    // Use "build" as output folder instead.
    outDir: 'build',
  },
  server: {
    // Avoid "UNKNOWN: unknown error, watch" on network/mapped drives (e.g. Z:)
    watch: { usePolling: true },
  },
})
