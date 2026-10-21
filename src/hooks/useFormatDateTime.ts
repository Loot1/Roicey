import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '../utils'
import { useHydrated } from './useHydrated'

/**
 * `formatDateTime` in the active language, safe to call on prerendered pages.
 *
 * Until hydration is over it returns the bare ISO date (`2026-04-12`), which
 * reads the same on the build machine and in every browser; the localized,
 * timezone-aware text replaces it right after.
 */
export function useFormatDateTime() {
    const hydrated = useHydrated()
    const { i18n } = useTranslation()
    const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'

    return useCallback((value: string | null) => (
        hydrated || !value ? formatDateTime(value, locale) : value.slice(0, 10)
    ), [hydrated, locale])
}
