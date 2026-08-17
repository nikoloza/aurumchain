// Sets the topbar copy and the active rail entry for the page that calls it.
// Every page runs this from onCreate, so the chrome always matches the route
// without a second source of truth.
export const openPage = function openPage (route, title, lead) {
  this.state.root.update({ route, pageTitle: title, pageLead: lead })
}
