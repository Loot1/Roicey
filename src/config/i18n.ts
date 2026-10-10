import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALES, type Locale } from './seoRoutes'

type LocaleBundle = Record<string, unknown>

const resources: Partial<Record<Locale, { translation: LocaleBundle }>> = {}

/**
 * Hands one locale's strings to i18next.
 *
 * This module deliberately imports no locale file itself. Each locale is
 * registered by the route that owns it (see src/routes.ts), which is what lets
 * the bundler give every locale its own chunk: a visitor on `/docs` downloads
 * French, a visitor on `/en/docs` downloads English, neither downloads both.
 *
 * Registration happens when that route module is loaded, and React Router loads
 * every matched route module before rendering any of them -- so the strings are
 * already in place when `initI18n` runs on the first pass, both in the browser
 * and while the pages are prerendered.
 */
export function registerLocaleResources(locale: Locale, bundle: LocaleBundle) {
    resources[locale] = { translation: bundle }

    if (i18n.isInitialized) {
        i18n.addResourceBundle(locale, 'translation', bundle, true, true)
    }
}

/**
 * The URL is the single source of truth for the language: `/docs` is French,
 * `/en/docs` is English. No browser detection, so a crawler always gets the
 * language the URL advertises, which is what the hreflang tags promise.
 */
export function initI18n(locale: Locale = DEFAULT_LOCALE) {
    if (!i18n.isInitialized) {
        void i18n.use(initReactI18next).init({
            resources,
            lng: locale,
            fallbackLng: DEFAULT_LOCALE,
            supportedLngs: [...LOCALES],
            interpolation: {
                escapeValue: false,
            },
        })
    } else if (i18n.language !== locale) {
        void i18n.changeLanguage(locale)
    }

    return i18n
}

export default i18n
