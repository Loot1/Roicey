import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'
import {
    DEFAULT_LOCALE,
    findSeoRoute,
    isLocale,
    localizePath,
    parseLocalizedPath,
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
 */
export function resolveLocaleForPath(pathname: string): ResolvedLocale {
    const { locale: urlLocale, path } = parseLocalizedPath(pathname)
    const hasLocalePrefix = urlLocale !== DEFAULT_LOCALE
    const isPublicRoute = findSeoRoute(path) !== undefined

    return {
        locale: hasLocalePrefix || isPublicRoute ? urlLocale : readStoredLocale(),
        basePath: path,
        isPublicRoute,
    }
}

export function useLocale(): ResolvedLocale {
    const { pathname } = useLocation()

    return useMemo(() => resolveLocaleForPath(pathname), [pathname])
}

/** Prefixes an app path with the active locale: `/docs` -> `/en/docs`. */
export function useLocalizedPath() {
    const { locale } = useLocale()

    return useCallback((path: string) => localizePath(path, locale), [locale])
}
