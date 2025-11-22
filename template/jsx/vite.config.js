import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'm',
    jsxFragment: "'['"
  },
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