import type { HTMLIonModalElement } from '@ionic/core/components'
import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import ionicLogo from '/ionic.svg'
import { PageHeader } from '../components/header'
import { makeid } from '../lib/utils'

type VitriolModalAttrs = {
  trigger: string
  cb?: (data?: string) => void
}

export const VitriolModal: m.Component<VitriolModalAttrs> = () => {
  let modal: HTMLIonModalElement | null = null

  const submit = () => {
    modal?.dismiss(makeid(10), 'submit')
  }

  return {
    oncreate: (vnode: m.Vnode<VitriolModalAttrs>) => {
      modal = vnode.dom as HTMLIonModalElement
      modal.backdropDismiss = false

      modal.addEventListener('willDismiss', (ev: any) => {
        if (ev.detail.role === 'submit' && typeof vnode.attrs.cb === 'function') {
          vnode.attrs.cb(ev.detail.data as string | undefined)
        }
      })
    },
    view: ({ attrs }: m.Vnode<VitriolModalAttrs>) =>
      <ion-modal trigger={attrs.trigger}>
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

          <ion-button color="success" onclick={submit} >OK</ion-button>
          <br />
          <ion-button color="danger" onclick={() => { modal.dismiss(undefined, 'cancel') }} >Cancel</ion-button>
        </ion-content>
      </ion-modal>
  }
}
