import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'm',
    jsxFragment: "'['"
  },
  server: {
    host: true
  },
  build: {
    emptyOutDir: true,
  }
})