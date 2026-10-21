import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * Whether the page has finished hydrating.
 *
 * Pages are prerendered at build time, and React requires the first client
 * render to reproduce that HTML exactly. Anything that depends on the visitor
 * (stored preferences, timezone, the browser's Intl data, today's date) must
 * wait for this to turn true, or hydration fails with React error #418.
 *
 * `false` while prerendering and during hydration, `true` right after; a
 * component mounted later, on a client-side navigation, gets `true` straight
 * away and so never renders the placeholder.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(subscribe, () => true, () => false)
}
