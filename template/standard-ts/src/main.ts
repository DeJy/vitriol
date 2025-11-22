import m from 'mithril'

globalThis.m = m

type RouteValue = any
type RouteModule = {
  default: RouteValue
  route?: string
  attrs?: string[]
}

const pages = import.meta.glob<RouteModule>('./pages/*.ts')

import './css/main.css'

const extractRouteFromPath = (filePath: string): string =>
  `/${filePath.split(/[\\/]/).pop()?.split('.').slice(0, -1).join('.') ?? ''}`

const buildAttrsUrl = (attrs?: string[]): string =>
  Array.isArray(attrs) && attrs.length
    ? attrs.map((attr) => `/:${encodeURIComponent(attr)}`).join('')
    : ''

;(async () => {
  try {
    const routes: Record<string, RouteValue> = {}
    for (const [filePath, loadPage] of Object.entries(pages)) {
      const pageModule = await loadPage()
      const route = pageModule.route ?? extractRouteFromPath(filePath)
      routes[route + buildAttrsUrl(pageModule.attrs)] = pageModule.default
    }

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