type CountButtonAttrs = {
  label?: string
}

export function CountButton() {
  let count = 0

  const addCount = () => {
    count += 1
  }

  return {
    oninit: () => {
      count = 100
      console.log('Init button')
    },
    oncreate: () => {
      console.log('Create button')
    },
    onbeforeupdate: () => {
      console.log('Before Update button')
    },
    onupdate: () => {
      console.log('Update button')
    },
    onbeforeremove: () => {
      console.log('Before Remove button')
    },
    onremove: () => {
      console.log('Remove button')
    },
    view: ({ attrs }: { attrs: CountButtonAttrs }) =>
      m('ion-button', { onclick: addCount }, `${attrs.label ?? 'Count'} is ${count}`),
  }
}
