import app from './app.js'
import state from './state.js'
import config from './config.js'
import sharedLibraries from './sharedLibraries.js'
import * as components from './components/index.js'
import pages from './pages/index.js'

export default {
  ...config,
  app,
  state,
  sharedLibraries,
  components,
  pages
}
