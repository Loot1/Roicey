import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import frCommon from './locales/fr/common.json'
import frDocs from './locales/fr/docs.json'
import frDashboard from './locales/fr/dashboard.json'
import enCommon from './locales/en/common.json'
import enDocs from './locales/en/docs.json'
import enDashboard from './locales/en/dashboard.json'

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: { ...frCommon, ...frDocs, ...frDashboard } },
            en: { translation: { ...enCommon, ...enDocs, ...enDashboard } },
        },
        fallbackLng: 'en',
        supportedLngs: ['fr', 'en'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'voicey-lang',
        },
    })

export default i18n
