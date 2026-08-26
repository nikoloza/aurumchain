import app from './app.js'
import state from './state.js'
import config from './config.js'
import * as components from './components/index.js'
import * as functions from './functions/index.js'
import designSystem from './designSystem/index.js'
import pages from './pages/index.js'

export default {
  ...config,
  app,
  state,
  components,
  functions,
  designSystem,
  pages
}
