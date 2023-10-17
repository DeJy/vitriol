import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import ionicLogo from '/ionic.svg'
import { CountButton } from '../components/countbutton';
import { PageHeader } from '../components/header';
import { makeid } from '../lib/utils';
import VitriolModal from '../modals/vitriolmodal';

export const route = "/home"

export default function Home() {

  function modalCallBack(data) {
    console.log(`Id returned by the modal is ${data}`);
  }

  return {


    view: () => {
      return (
        <>
          <PageHeader />
          <ion-content fullscreen class="ion-padding">
          <ion-fab edge="true" horizontal="end" vertical="top" slot="fixed">
						<ion-fab-button color="danger" id="open-modal">
            <ion-icon name="browsers-outline"></ion-icon>
						</ion-fab-button>
					</ion-fab>
            <VitriolModal trigger="open-modal" cb={modalCallBack}/>
            <ion-item class="ion-text-center">
              <ion-label class="clickable" onclick={() => m.route.set('/vitriol/' + makeid(10))}><h1>Vitriol JS</h1></ion-label>
            </ion-item>
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
              <p><CountButton label="First count" /></p>
              <p><CountButton label="Second count" /></p>
              <p>
                Edit <code>src/page/home.jsx</code> and save to test HMR
              </p>
            </div>
            <ion-note>
              <footer>Click on the Vite, Mithril and Ionic logos to learn more</footer>
            </ion-note>
          </ion-content>
        </>
      )
    },
  };
}
