import style from '../css/vitriol.module.css'
import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'

export const attrs = ['id'] as const

type VitriolAttrs = {
  id?: string
}

export default function Vitriol() {
  return {
    view: ({ attrs }: m.Vnode<VitriolAttrs>) =>
      m('', [
        m('h1', 'Vitriol JS'),
        m('h2', 'Vite + Mithril'),
        m('div', [
          m('a', { href: 'https://vitejs.dev', target: '_blank' }, [
            m('img', { src: viteLogo, class: 'logo', alt: 'Vite logo' }),
          ]),
          m('a', { href: 'https://mithril.js.org', target: '_blank' }, [
            m('img', { src: mithrilLogo, class: 'logo mithril', alt: 'Mithril logo' }),
          ]),
        ]),
        m('div', { class: 'card' }, [
          m('p', `The page ID is ${attrs.id ?? ''}`),
        ]),
        m(
          'p',
          { onclick: () => m.route.set('/home'), class: `${style.footer} clickable` },
          'Home Page',
        ),
      ]),
  }
}