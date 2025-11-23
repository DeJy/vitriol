#!/usr/bin/env node

import { init } from './dist/index.mjs'

init().catch((e) => {
  console.error(e)
})

