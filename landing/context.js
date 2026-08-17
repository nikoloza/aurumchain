import app from './app.js'
import state from './state.js'
import config from './config.js'
import dependencies from './dependencies.js'
import sharedLibraries from './sharedLibraries.js'
import * as components from './components/index.js'
import * as snippets from './snippets/index.js'
import pages from './pages/index.js'
import * as functions from './functions/index.js'
import * as methods from './methods/index.js'
import * as globalScope from './globalScope.js'
import files from './files/index.js'

export default {
  ...config,
  app,
  state,
  dependencies,
  sharedLibraries,
  components,
  snippets,
  pages,
  functions,
  methods,
  globalScope,
  files
}
