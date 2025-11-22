import mithrilLogo from '../assets/mithril.svg'
import viteLogo from '/vite.svg'
import { makeid } from '../lib/utils';
import { CountButton } from '../components/countbutton';

export const route = "/home"

export default function Home() {

  return {
    view: () => {
      return (
        m("", [
          m("div", [
            m("a", { href: "https://vitejs.dev", target: "_blank" }, [
              m("img", { src: viteLogo, class: "logo", alt: "Vite logo" })
            ]),
            m("a", { href: "https://mithril.js.org", target: "_blank" }, [
              m("img", { src: mithrilLogo, class: "logo mithril", alt: "Mithril logo" })
            ]),
          ]),
          m("h1", { class: 'clickable', onclick: () => m.route.set('/vitriol/' + makeid(10)) }, "Vitriol JS"),
          m("h2", "Vite + Mithril"),

          m("div", {class: "card"}, [
            m("p", [
              m(CountButton, {label:"First count"})
            ]),
            m("p", [
              m(CountButton, {label:"Second count"})
            ]),
            m("p", [
              "Edit ",
              m("code", "src/page/home.ts"),
              " and save to test HMR"
            ])
          ]),
          m("p", {class:"read-the-docs"}, [
            m("footer", "Click on the Vite and Mithril logos to learn more")
          ])
        ])
      )
    },
  };
}
