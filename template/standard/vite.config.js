import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    setupFiles: ['/test/setup.js']
  },
  server: {
    host: true
  },
  build: {
    emptyOutDir: true,
  } 
})