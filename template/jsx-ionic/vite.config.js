import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import'
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
  plugins: [
    dynamicImport({
      filter(id) {
        if (id.includes('node_modules/@ionic/core/')) {
          return true
        }
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ionic/core/dist/ionic/svg',
          dest: './'
        }
      ]
    })
  ]
})