import { create } from 'smbls'

import app from './app.js'
import state from './state.js'
import pages from './pages/index.js'
import sharedLibraries from './sharedLibraries.js'
import config from './config.js'

create(app, {
  ...config,
  app,
  state,
  pages,
  sharedLibraries
})
