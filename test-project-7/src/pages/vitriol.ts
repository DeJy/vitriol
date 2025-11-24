import style from '../css/vitriol.module.css'
import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import ionicLogo from '/ionic.svg'
import { PageHeader } from '../components/header'

export const attrs = ['id'] as const

type VitriolAttrs = {
  id: string
}

export default function Vitriol() {
  return {
    view: ({ attrs }: m.Vnode<VitriolAttrs>) =>
      m('', [
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
          m('div', { class: 'card' }, [m('p', `The page ID is ${attrs.id}`)]),
          m(
            'ion-button',
            {
              fill: 'outline',
              onclick: () => m.route.set('/home'),
              class: `${style.footer} clickable`,
            },
            'Home Page',
          ),
        ]),
      ]),
  }
}

