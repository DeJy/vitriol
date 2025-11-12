import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import ioniconList from './extractionicons.js';

export default defineConfig({

  test: {
    setupFiles: ['/test/setup.js']
  },
  server: {
    host: true
  },
  optimizeDeps: {
    exclude: [
      '@ionic/core'
    ]
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