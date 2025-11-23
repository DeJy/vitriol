import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import ioniconList from './extractionicons'

export default defineConfig({
  server: {
    host: true
  },
  optimizeDeps: {
    exclude: ['@ionic/core'],
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      external: ['/ionic.esm.js'],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: ioniconList('node_modules/@ionic/core/dist/ionic/svg', './svg')
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ionic/core/dist/ionic/*',
          dest: '',
        },
      ],
    }),
  ],
})