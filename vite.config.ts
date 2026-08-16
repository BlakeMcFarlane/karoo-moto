import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
// `--mode artifact` produces a single self-contained index.html with all JS,
// CSS, fonts and images inlined (for the shareable Artifact / any static host).
export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact'
  return {
    plugins: [react(), ...(artifact ? [viteSingleFile()] : [])],
    build: artifact
      ? {
          assetsInlineLimit: 100_000_000, // inline every asset as a data URI
          cssCodeSplit: false,
          chunkSizeWarningLimit: 5000,
        }
      : {},
    server: {
      port: 5173,
    },
  }
})
