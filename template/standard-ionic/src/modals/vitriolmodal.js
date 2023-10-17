import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import ionicLogo from '/ionic.svg'
import { PageHeader } from "../components/header"
import { makeid } from '../lib/utils'



export default function VitriolModal() {

  let modal;

  function submit() {
    modal.dismiss(makeid(10), 'submit')
  }
  return {
    oncreate: vnode => {
      modal = vnode.dom;
      modal.backdropDismiss = false;

      modal.addEventListener('willDismiss', (ev) => {
        if (ev.detail.role == 'submit') {
          typeof vnode.attrs.cb == 'function' && vnode.attrs.cb(ev.detail.data);
        }
      });

    },
    view: ({ attrs }) => {
      return (
        m("ion-modal", { trigger: attrs.trigger }, [
          m(PageHeader),
          m("ion-content", { fullscreen: true, class: "ion-padding" }, [

            m("div", [
              m("a", { href: "https://vitejs.dev", target: "_blank" }, [
                m("img", { src: viteLogo, class: "logo", alt: "Vite Logo" })
              ]),
              m("a", { href: "https://mithril.js.org", target: "_blank" }, [
                m("img", { src: mithrilLogo, class: "logo mithril", alt: "Mithril Logo" })
              ]),
              m("a", { href: "https://ionicframework.com/", target: "_blank" }, [
                m("img", { src: ionicLogo, class: "logo", alt: "Ionic Logo" })
              ])
            ]),
            m("h2", "Vite + Mithril + Ionic"),
            m("ion-button", { color: "success", onclick: submit }, 'OK'),
            m("br"),
            m("ion-button", { color: "danger", onclick: () => { modal.dismiss(undefined, 'cancel') } }, 'Cancel')
          ])
        ])
      )
    }
  }
}