import { createContext, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { disableAnalytics, enableAnalytics, isAnalyticsConfigured, trackPageView } from '../utils/analytics'

/**
 * - `pending`: prerender and hydration, before localStorage can be read.
 * - `unset`: no choice yet, or the previous one expired: the banner shows.
 */
export type ConsentStatus = 'pending' | 'unset' | 'granted' | 'denied'

type ConsentContextValue = {
    analytics: ConsentStatus
    /** Whether a GA property is configured at all; without one there is nothing to consent to. */
    isConfigured: boolean
    isBannerOpen: boolean
    grant: () => void
    deny: () => void
    /** Reopens the banner so the visitor can change their mind (footer link). */
    openPreferences: () => void
}

const STORAGE_KEY = 'voicey-consent'
/** Bump when what is collected changes: every stored choice is then asked again. */
const CONSENT_VERSION = 1
/** CNIL recommends asking again after six months, whatever the answer was. */
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182

type StoredConsent = {
    version: number
    analytics: boolean
    date: number
}

// eslint-disable-next-line react-refresh/only-export-components
export const ConsentContext = createContext<ConsentContextValue | null>(null)

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
    listeners.add(listener)
    // Another tab accepting or withdrawing applies here too.
    window.addEventListener('storage', listener)

    return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', listener)
    }
}

function readConsent(): ConsentStatus {
    try {
        const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as StoredConsent | null
        if (
            !stored
            || stored.version !== CONSENT_VERSION
            || typeof stored.analytics !== 'boolean'
            || Date.now() - stored.date > CONSENT_MAX_AGE_MS
        ) {
            return 'unset'
        }

        return stored.analytics ? 'granted' : 'denied'
    } catch {
        return 'unset'
    }
}

function writeConsent(analytics: boolean) {
    try {
        const stored: StoredConsent = { version: CONSENT_VERSION, analytics, date: Date.now() }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
        // Storage blocked: the choice still holds for this page, it just won't be remembered.
    }

    for (const listener of listeners) {
        listener()
    }
}

/**
 * Owns the analytics consent and everything that depends on it: loading or
 * stopping GA, and sending a page view on each navigation.
 *
 * Both effects live here, in this order, because a child's effects run before
 * its parent's: tracking from a route component would fire before GA is set up.
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
    const stored = useSyncExternalStore(subscribe, readConsent, () => 'pending' as const)
    const analytics: ConsentStatus = isAnalyticsConfigured ? stored : 'denied'
    const [preferencesOpen, setPreferencesOpen] = useState(false)
    const { pathname, search } = useLocation()
    const lastTrackedUrl = useRef<string | null>(null)

    useEffect(() => {
        if (analytics === 'granted') {
            enableAnalytics()
        } else if (analytics !== 'pending') {
            disableAnalytics()
        }
    }, [analytics])

    useEffect(() => {
        if (analytics !== 'granted') {
            lastTrackedUrl.current = null
            return
        }

        // Guards against the double effect of StrictMode and against re-renders
        // that do not change the page.
        const url = `${pathname}${search}`
        if (lastTrackedUrl.current === url) {
            return
        }

        lastTrackedUrl.current = url
        trackPageView()
    }, [analytics, pathname, search])

    const choose = useCallback((granted: boolean) => {
        writeConsent(granted)
        setPreferencesOpen(false)
    }, [])

    const value = useMemo<ConsentContextValue>(() => ({
        analytics,
        isConfigured: isAnalyticsConfigured,
        isBannerOpen: isAnalyticsConfigured && (analytics === 'unset' || preferencesOpen),
        grant: () => choose(true),
        deny: () => choose(false),
        openPreferences: () => setPreferencesOpen(true),
    }), [analytics, choose, preferencesOpen])

    return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}
