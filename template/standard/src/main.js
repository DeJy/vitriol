// Import mithril framework
import m from "mithril";
globalThis.m = m;

// Import all pages
const pages = import.meta.glob('./pages/*.js');

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