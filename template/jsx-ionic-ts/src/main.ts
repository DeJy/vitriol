import m from 'mithril'

globalThis.m = m

type RouteValue = any
type RouteModule = {
  default: RouteValue
  route?: string
  attrs?: string[]
}

const pages = import.meta.glob<RouteModule>('./pages/*.tsx')

// Import ionic
import '@ionic/core/css/ionic.bundle.css'
import { initialize } from '@ionic/core/components'
import { defineCustomElements } from '@ionic/core/loader'

// Preload all Ionic components (this is what makes it work in production)
const ionicComponents = import.meta.glob('../node_modules/@ionic/core/dist/esm/*.entry.js')
for (const path in ionicComponents) {
  ionicComponents[path]()
    .then(() => {
      return undefined
    })
    .catch((err) => {
      console.warn(`Failed to load ${path}:`, err)
    })
}

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
;(async () => {
  try {
    // Initialize ionic components
    initialize()
    defineCustomElements()

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