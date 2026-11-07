import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base './' keeps asset paths relative, so the build works at a domain root
// or under a GitHub Pages sub-path without changes.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
