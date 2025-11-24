export function PageHeader() {
  return {
    view: () =>
      m('ion-header', [
        m('ion-toolbar', { color: 'primary' }, [
          m('ion-title', 'Vitriol JS'),
        ]),
      ]),
  }
}

