
import "@ionic/core/css/ionic.bundle.css";
export function PageHeader() {
  return {
    view: ({ attrs }) => {
      return (
        m("ion-header", [
          m("ion-toolbar", {color:"primary"}, [
            m("ion-title", 'Vitriol JS')
          ])
        ])
      )
    },
  };
}

