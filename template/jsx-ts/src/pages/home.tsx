import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import { CountButton } from '../components/countbutton';
import { makeid } from '../lib/utils';

export const route = "/home"

export default function Home() {
  
  return {
    view: () => {
      return (
        <>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} class="logo" alt="Vite logo" />
            </a>
            <a href="https://mithril.js.org" target="_blank">
              <img src={mithrilLogo} class="logo mithril" alt="Mithril logo" />
            </a>
          </div>
          <h1 class="clickable" onclick={()=> m.route.set('/vitriol/' + makeid(10))}>Vitriol JS</h1>
          <h2>Vite + Mithril</h2>
          
          <div class="card">
          <p><CountButton label="First count"/></p>
          <p><CountButton label="Second count"/></p>
            <p>
              Edit <code>src/page/home.tsx</code> and save to test HMR
            </p>
          </div>
          <p class="read-the-docs">
            <footer>Click on the Vite and Mithril logos to learn more</footer>
          </p>
        </>
      )
    },
  };
}
