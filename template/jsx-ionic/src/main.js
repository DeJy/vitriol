// import mithril framework and set it as global
import m from "mithril";
globalThis.m = m;
// import all pages
const pages = import.meta.glob('./pages/*.jsx')
// import main css file
import "./css/main.css"
// import ionic
import "@ionic/core/css/ionic.bundle.css"
import { initialize } from "@ionic/core/components"
import { defineCustomElements } from "@ionic/core/loader"

(async () => {
  // init ionic components
  initialize()
  defineCustomElements();
  // build routes for each pages in ./pages folder
  let routes = {};
  for (const path in pages) {
    let page = await pages[path]();
    // build the route using the route constant exported from the module or the file name
    const route = page.route || "/" + path.split('\\').pop().split('/').pop().split('.').slice(0, -1).join('.');
    const attrs = page.attrs;
    routes[route + buildAttrsUrl(attrs)] = page.default;
  }
  //Load the routes and application and set /home as the default
  m.route(document.querySelector('#app'), "/home", routes);
})();

function buildAttrsUrl(attrs) {
  let attrsUrl = "";
  if (!attrs) return attrsUrl ;
  attrs.forEach(attr => {
    attrsUrl += "/:" + attr;  
  });
  return attrsUrl
}