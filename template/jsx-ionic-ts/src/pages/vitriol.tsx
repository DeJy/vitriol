import style from "../css/vitriol.module.css";
import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import ionicLogo from '/ionic.svg'
import { PageHeader } from "../components/header"
export const attrs = ['id']

export default function Vitriol() {
  return {
    view: ({ attrs }: m.Vnode<{ id: string }>) => {
      return (
        <>
          <PageHeader />
          <ion-content fullscreen="true" class="ion-padding">


            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} class="logo" alt="Vite logo" />
              </a>
              <a href="https://mithril.js.org" target="_blank">
                <img src={mithrilLogo} class="logo mithril" alt="Mithril logo" />
              </a>
              <a href="https://ionicframework.com/" target="_blank">
                <img src={ionicLogo} class="logo" alt="Ionic logo" />
              </a>
            </div>

            <h2>Vite + Mithril + Ionic</h2>
            <div class="card">
              <p>The page ID is {attrs.id}</p>
            </div>

            <ion-button fill="outline" onclick={() => m.route.set('/home')} class={style.footer + " clickable"}>Home Page</ion-button>
          </ion-content>
        </>
      )
    }
  }
}