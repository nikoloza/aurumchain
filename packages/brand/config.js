import translations from './translations.js'

export default {
  useReset: true,
  useVariable: true,
  useFontImport: true,
  useIconSprite: true,
  useSvgSprite: true,
  useDefaultConfig: true,
  useDocumentTheme: false,
  verbose: false,
  globalTheme: 'light',

  // Registering `polyglot` on the context is what installs the plugin and the
  // `polyglot` / `setLang` / `getActiveLang` functions — `{{ key | polyglot }}`
  // literals resolve against `translations[lang]`. The brand surface documents
  // the library, so it reads the same shared dictionary the surfaces merge.
  polyglot: {
    languages: ['en', 'ka'],
    defaultLang: 'en',
    storageLangKey: 'fractyco_lang',
    translations: {
      en: { ...translations.en },
      ka: { ...translations.ka }
    }
  }
}
