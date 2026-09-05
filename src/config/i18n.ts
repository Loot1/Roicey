import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import frCommon from './locales/fr/common.json'
import frDocs from './locales/fr/docs.json'
import frDashboard from './locales/fr/dashboard.json'
import frSeo from './locales/fr/seo.json'
import enCommon from './locales/en/common.json'
import enDocs from './locales/en/docs.json'
import enDashboard from './locales/en/dashboard.json'
import enSeo from './locales/en/seo.json'
import { DEFAULT_LOCALE, LOCALES, type Locale } from './seoRoutes'

const resources = {
    fr: { translation: { ...frCommon, ...frDocs, ...frDashboard, ...frSeo } },
    en: { translation: { ...enCommon, ...enDocs, ...enDashboard, ...enSeo } },
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
