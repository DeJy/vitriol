import type Mithril from 'mithril'

declare global {
  var m: typeof Mithril
   namespace m {
    type Vnode<Attrs = {}, State = {}> = Mithril.Vnode<Attrs, State>
    type Component<Attrs = {}, State = {}> = Mithril.Component<Attrs, State>
  }
}

export {}
