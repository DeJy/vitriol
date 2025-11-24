import m from 'mithril'

globalThis.m = m

type RouteValue = any
type RouteModule = {
  default: RouteValue
  route?: string
  attrs?: string[]
}

const pages = import.meta.glob<RouteModule>('./pages/*.ts')

// Import ionic
import '@ionic/core/css/ionic.bundle.css'

// Import main css file
import './css/main.css'

// Utility function to extract route from path
const extractRouteFromPath = (filePath: string): string =>
  `/${filePath.split(/[\\/]/).pop()?.split('.').slice(0, -1).join('.') ?? ''}`

const buildAttrsUrl = (attrs?: string[]): string =>
  Array.isArray(attrs) && attrs.length
    ? attrs.map((attr) => `/:${encodeURIComponent(attr)}`).join('')
    : ''

  // Initialize application and build routes
  ; (async () => {
    try {
      // Load Ionic
      // Set the path to a variable to
      // prevent Vite from analyzing in dev
      const ionicPath = '/ionic.esm.js';
      await import(/* @vite-ignore */ ionicPath);

      // Build routes for each page in ./pages folder
      const routes: Record<string, RouteValue> = {}
      for (const [filePath, loadPage] of Object.entries(pages)) {
        const pageModule = await loadPage()
        const route = pageModule.route ?? extractRouteFromPath(filePath)
        routes[route + buildAttrsUrl(pageModule.attrs)] = pageModule.default
      }

      // Load the routes and application and set /home as the default
      const mountElement = document.querySelector('#app')
      if (!mountElement) {
        throw new Error('Unable to find #app mount element')
      }
      m.route(mountElement, '/home', routes)
    } catch (error) {
      console.error('Error while loading the application:', error)
      const mountElement = document.querySelector('#app')
      if (mountElement) {
        mountElement.innerHTML =
          'An error occurred while loading the application. Please try again later.'
      }
    }
  })()