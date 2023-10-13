import style from "../css/vitriol.module.css";
import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'

export const attrs = ['id'];

export default function Vitriol() {
  return {
    view: ({ attrs }) => {
      return (
        <>
          <h1>Vitriol JS</h1>
          <h2>Vite + Mithril</h2>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} class="logo" alt="Vite logo" />
            </a>
            <a href="https://mithril.js.org" target="_blank">
              <img src={mithrilLogo} class="logo mithril" alt="Mithril logo" />
            </a>
          </div>
          <div class="card">
            <p>The page ID is {attrs.id}</p>
          </div>
          
            <p onclick={() => m.route.set('/home')} class={style.footer + " clickable"}>Home Page</p>
          
        </>
      )
    }
  }
}