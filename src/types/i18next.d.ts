import type enCommon from '../config/locales/en/common.json'
import type enDocs from '../config/locales/en/docs.json'
import type enDashboard from '../config/locales/en/dashboard.json'

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation'
        resources: {
            translation: typeof enCommon & typeof enDocs & typeof enDashboard
        }
    }
}
