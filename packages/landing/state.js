// The landing surface holds no cross-section state — FAQ rows carry their own
// local `open` flag and every other section is static.
export default {
  // '' = follow the document default; the ThemeToggle writes 'light'/'dark'.
  themeMode: '',
  // Page-switch curtain stage: '' | 'cover' | 'reveal' — see RouteVeil.
  veilStage: '',
  // The hero's world — root state so the navbar's WorldSwitch drives it.
  heroWorld: 'above'
}
