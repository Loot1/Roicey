import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type english from './locales/en'
import { DEFAULT_LOCALE, LOCALES, type Locale } from './seoRoutes'

type LocaleBundle = Record<string, unknown>

/** Shape of one locale's strings, English being the reference. */
export type LocaleStrings = typeof english

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
 * A locale's raw strings, for code that runs outside React (route `meta`, the
 * JSON-LD) and so cannot go through `t()`.
 *
 * Reading them from here rather than importing the JSON files is what keeps
 * those modules, which every page loads, from dragging both locales into the
 * client bundle. The matched route's locale is always registered by the time a
 * `meta` function runs, for the same reason as in `registerLocaleResources`.
 */
export function localeStrings(locale: Locale): LocaleStrings {
    const bundle = resources[locale]?.translation

    if (!bundle) {
        throw new Error(`Locale "${locale}" is not registered: is its route wrapped in a locale resources route?`)
    }

    return bundle as LocaleStrings
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
