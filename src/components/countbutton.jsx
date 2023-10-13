export function CountButton() {

  let count = 0;

  const addCount = () => {
    count++;
  }

  return {
    oninit: (vnode) => {
      count = 100;
      console.log('Init button');
    },
    oncreate: (vnode) => {
      console.log('Create button');
    },
    onbeforeupdate: (vnode, old) => {
      console.log('Before Update button');
    },
    onupdate: (vnode) => {
      console.log('Update button');
    },
    onbeforeremove: (vnode) => {
      console.log('Before Remove button');
    },
    onremove: (vnode) => {
      console.log('Remove button');
    },
    view: ({ attrs }) => {
      return (
        <button onclick={addCount}>
          {(attrs.label || 'Count') + ' is ' + count}
        </button>
      )
    },
  };
}
