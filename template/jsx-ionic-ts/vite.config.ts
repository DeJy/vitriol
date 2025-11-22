import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import ioniconList from './extractionicons';

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
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name].js',
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: ioniconList('node_modules/@ionic/core/dist/ionic/svg', './svg')
    })
  ]
})