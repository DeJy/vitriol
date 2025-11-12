// Import mithril framework
import m from "mithril";
globalThis.m = m;

// Import all pages
const pages = import.meta.glob('./pages/*.jsx');

// Import ionic
import "@ionic/core/css/ionic.bundle.css";
import { initialize } from "@ionic/core/components";
import { defineCustomElements } from "@ionic/core/loader";

// Preload all Ionic components (this is what makes it work in production)
const ionicComponents = import.meta.glob('../node_modules/@ionic/core/dist/esm/*.entry.js');
for (const path in ionicComponents) {
  ionicComponents[path]().then(() => {
    // Component loaded
  }).catch(err => {
    console.warn(`Failed to load ${path}:`, err);
  });
}

// Import main css file
import "./css/main.css";

// Utility function to extract route from path
const extractRouteFromPath = (path) => 
  `/${path.split(/[\\/]/).pop().split('.').slice(0, -1).join('.')}`;

// Utility function to build attribute URL
const buildAttrsUrl = (attrs) => 
  Array.isArray(attrs) && attrs.length ? attrs.map(attr => `/:${encodeURIComponent(attr)}`).join('') : '';

// Initialize application and build routes
(async () => {
  try {
    // Initialize ionic components
    initialize();
    defineCustomElements();

    // Build routes for each page in ./pages folder
    const routes = {};
    for (const [path, loadPage] of Object.entries(pages)) {
      const pageModule = await loadPage();
      const route = pageModule.route || extractRouteFromPath(path);
      routes[route + buildAttrsUrl(pageModule.attrs)] = pageModule.default;
    }

    // Load the routes and application and set /home as the default
    m.route(document.querySelector('#app'), "/home", routes);
  } catch (error) {
    console.error("Error while loading the application:", error);
    // Display an error message to the user if needed
    document.querySelector('#app').innerText = "An error occurred while loading the application. Please try again later.";
  }
})();