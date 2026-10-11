/**
 * Google Analytics 4, loaded only once the visitor has consented.
 *
 * Nothing here runs on its own: src/contexts/ConsentContext.tsx calls
 * `enableAnalytics` / `disableAnalytics` as the stored choice changes, so before
 * consent no script is fetched and no `_ga` cookie is written (CNIL's
 * requirement for any audience measurement that is not exempt, which GA4 is not).
 *
 * Without `VITE_GA_MEASUREMENT_ID` the whole feature is off: no banner, no
 * footer link, no request. That is what keeps dev builds out of the reports.
 */

type Gtag = (...args: unknown[]) => void

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: Gtag
    }
}

export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ''
export const isAnalyticsConfigured = GA_MEASUREMENT_ID !== ''

/** GA defaults to two years; CNIL caps audience-measurement cookies at 13 months. */
const GA_COOKIE_MAX_AGE_S = 60 * 60 * 24 * 390

let scriptInjected = false

function ensureGtag(): Gtag {
    window.dataLayer ??= []
    window.gtag ??= function () {
        // gtag.js reads the `arguments` object itself: an array pushed here is ignored.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments)
    }

    return window.gtag
}

/** GA's own kill switch: while set, gtag.js sends nothing for that property. */
function setGaDisabled(disabled: boolean) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled
}

export function enableAnalytics() {
    if (!isAnalyticsConfigured) {
        return
    }

    const gtag = ensureGtag()
    setGaDisabled(false)

    if (scriptInjected) {
        gtag('consent', 'update', { analytics_storage: 'granted' })
        return
    }

    scriptInjected = true
    // Consent Mode v2 in its "basic" form: the script only exists once consent
    // is given, and the advertising signals stay denied regardless.
    gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
    })
    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID, {
        // Page views are sent by ConsentContext on each route change.
        send_page_view: false,
        cookie_expires: GA_COOKIE_MAX_AGE_S,
        // Otherwise every hit pushes the expiry back 13 months, and a regular
        // visitor's cookie never expires.
        cookie_update: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    document.head.appendChild(script)
}

/**
 * Stops collection and removes what GA left behind. Safe to call when GA never
 * loaded: it also sweeps cookies from an earlier, now expired or withdrawn, consent.
 */
export function disableAnalytics() {
    if (!isAnalyticsConfigured) {
        return
    }

    setGaDisabled(true)
    if (scriptInjected) {
        window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    }

    clearAnalyticsCookies()
}

export function trackPageView() {
    if (!scriptInjected) {
        return
    }

    window.gtag?.('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title,
    })
}

/**
 * GA writes `_ga` and `_ga_<id>` on the widest domain it can (`.voicey.fr`), and
 * a cookie only goes away when deleted with the domain it was set on -- hence
 * one attempt per parent domain of the current host.
 */
function clearAnalyticsCookies() {
    const names = document.cookie
        .split(';')
        .map((cookie) => cookie.split('=')[0].trim())
        .filter((name) => /^_ga(_|$)/.test(name))

    if (names.length === 0) {
        return
    }

    const labels = window.location.hostname.split('.')
    const domains = ['', ...labels.slice(0, -1).map((_, index) => `; domain=.${labels.slice(index).join('.')}`)]

    for (const name of names) {
        for (const domain of domains) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
        }
    }
}
