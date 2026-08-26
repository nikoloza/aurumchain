import shared from '@fractyco/brand/translations.js'
import local from './translations.js'

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
  // literals resolve against `translations[lang]`. The shared library's copy
  // merges under this surface's own, which wins on a key collision.
  polyglot: {
    languages: ['en', 'ka'],
    defaultLang: 'en',
    storageLangKey: 'fractyco_lang',
    translations: {
      en: { ...shared.en, ...local.en },
      ka: { ...shared.ka, ...local.ka }
    }
  }
}
