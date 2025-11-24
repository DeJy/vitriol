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

export default function VitriolModal() {
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
      m(
        'ion-modal',
        { trigger: attrs.trigger },
        m(PageHeader),
        m('ion-content', { fullscreen: true, class: 'ion-padding' }, [
          m('div', [
            m('a', { href: 'https://vitejs.dev', target: '_blank' }, [
              m('img', { src: viteLogo, class: 'logo', alt: 'Vite Logo' }),
            ]),
            m('a', { href: 'https://mithril.js.org', target: '_blank' }, [
              m('img', { src: mithrilLogo, class: 'logo mithril', alt: 'Mithril Logo' }),
            ]),
            m('a', { href: 'https://ionicframework.com/', target: '_blank' }, [
              m('img', { src: ionicLogo, class: 'logo', alt: 'Ionic Logo' }),
            ]),
          ]),
          m('h2', 'Vite + Mithril + Ionic'),
          m('ion-button', { color: 'success', onclick: submit }, 'OK'),
          m('br'),
          m(
            'ion-button',
            {
              color: 'danger',
              onclick: () => {
                modal?.dismiss(undefined, 'cancel')
              },
            },
            'Cancel',
          ),
        ]),
      ),
  }
}