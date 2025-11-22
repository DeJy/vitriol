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
        m("", [
          m(PageHeader),
          m("ion-content", { fullscreen: true, class: "ion-padding" }, [
            m("ion-fab", { edge: true, horizontal: "end", vertical: "top", slot: "fixed" }, [
              m("ion-fab-button", { color: "danger", id: "open-modal" }, [
                m("ion-icon", { name: "browsers-outline" })
              ]),
            ]),
            m(VitriolModal, { trigger: "open-modal", cb: modalCallBack }),
            m("ion-item", { class: "ion-text-center" }, [
              m("ion-label", { class: "clickable", onclick: () => m.route.set('/vitriol/' + makeid(10)) }, [
                m("h1", 'Vitriol JS')
              ])
            ]),
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
            m("div", {class: "card"}, [
              m("p", [
                m(CountButton, {label:"First count"})
              ]),
              m("p", [
                m(CountButton, {label:"Second count"})
              ]),
              m("p", [
                "Edit ",
                m("code", "src/page/home.js"),
                " and save to test HMR"
              ])
            ]),
            m("ion-note", [
              m("footer", "Click on the Vite, Mithril and Ionic logos to learn more")
            ])
          ])
        ])
      )
    },
  };
}