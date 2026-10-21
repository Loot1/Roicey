import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'
import { useHydrated } from './useHydrated'
import {
    DEFAULT_LOCALE,
    findSeoRoute,
    isLocale,
    parseLocalizedPath,
    publicPath,
    type Locale,
} from '../config/seoRoutes'

const STORAGE_KEY = 'voicey-lang'

function readStoredLocale(): Locale {
    if (typeof window === 'undefined') {
        return DEFAULT_LOCALE
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) ?? undefined
    return isLocale(stored) ? stored : DEFAULT_LOCALE
}

export function storeLocale(locale: Locale) {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, locale)
    }
}

export type ResolvedLocale = {
    locale: Locale
    /** Current path with the locale prefix stripped, e.g. `/docs/faq`. */
    basePath: string
    /** Whether this path is a public, indexable page. */
    isPublicRoute: boolean
}

/**
 * Resolves the active locale for a path.
 *
 * Public pages take it from the URL, which is what the canonical and hreflang
 * tags advertise. Private pages (`/dashboard`) and unknown paths exist in a
 * single locale, so they keep the visitor's stored preference instead of
 * snapping back to French.
 *
 * That preference only exists in the browser, so it is not read before
 * hydration is over (`canReadStorage`, see `useHydrated`): those pages are
 * prerendered in French, and rendering them in English on the first client
 * pass would fail hydration.
 */
export function resolveLocaleForPath(pathname: string, canReadStorage: boolean): ResolvedLocale {
    const { locale: urlLocale, path } = parseLocalizedPath(pathname)
    const hasLocalePrefix = urlLocale !== DEFAULT_LOCALE
    const isPublicRoute = findSeoRoute(path) !== undefined

    return {
        locale: hasLocalePrefix || isPublicRoute || !canReadStorage ? urlLocale : readStoredLocale(),
        basePath: path,
        isPublicRoute,
    }
}

export function useLocale(): ResolvedLocale {
    const { pathname } = useLocation()
    const hydrated = useHydrated()

    return useMemo(() => resolveLocaleForPath(pathname, hydrated), [pathname, hydrated])
}

/** Turns an app path into its published URL in the active locale: `/docs` -> `/en/docs/`. */
export function useLocalizedPath() {
    const { locale } = useLocale()

    return useCallback((path: string) => publicPath(path, locale), [locale])
}
