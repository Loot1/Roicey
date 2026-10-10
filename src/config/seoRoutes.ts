/**
 * The single source of truth for every public URL of the site.
 *
 * Four consumers read this table and must never disagree:
 *   - src/routes.ts mounts the routes it declares, once per locale
 *   - src/config/seoMeta.ts builds each page's head from it
 *   - react-router.config.ts derives the list of paths to prerender
 *   - scripts/postbuild.ts writes the sitemap from it
 *
 * It is deliberately dependency-free, so the build config can import it too.
 */
export const SITE_URL = 'https://voicey.fr'
export const SITE_NAME = 'Voicey'
export const THEME_COLOR = '#cf2d2d'

/** Public profiles used as `sameAs` in the JSON-LD. Env-free, so build scripts can read them. */
export const VOICEY_HELP_DISCORD_URL = 'https://discord.gg/QY37xT9cGW'
export const ROICEY_GITHUB_URL = 'https://github.com/Loot1/Roicey'

export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * French is served unprefixed (`/docs`), every other locale under its own
 * prefix (`/en/docs`). No existing URL changes, and each language gets its own
 * indexable address.
 */
export const DEFAULT_LOCALE: Locale = 'fr'

/** Locale advertised as `x-default` in the hreflang tags. */
export const X_DEFAULT_LOCALE: Locale = 'fr'

/** One share card per language, because the tagline it carries is translated. */
export const OG_IMAGE_PATHS: Record<Locale, string> = {
    fr: '/og-image-fr.jpg',
    en: '/og-image-en.jpg',
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

export type StructuredDataKind = 'softwareApplication' | 'website' | 'faq' | 'breadcrumb'

export type SeoRoute = {
    /** Prefix of the i18n keys: `seo.<id>.title` and `seo.<id>.description`. */
    id: string
    /** Canonical path, without a locale prefix. */
    path: string
    /** JSON-LD blocks injected into this page at build time. */
    structuredData?: readonly StructuredDataKind[]
}

export const SEO_ROUTES = [
    { id: 'home', path: '/', structuredData: ['softwareApplication', 'website', 'faq'] },
    { id: 'about', path: '/about', structuredData: ['breadcrumb'] },
    { id: 'docs', path: '/docs', structuredData: ['breadcrumb'] },
    { id: 'docsCommands', path: '/docs/commands', structuredData: ['breadcrumb'] },
    { id: 'docsRecording', path: '/docs/recording', structuredData: ['breadcrumb'] },
    { id: 'docsSettings', path: '/docs/settings', structuredData: ['breadcrumb'] },
    { id: 'docsModeration', path: '/docs/moderation', structuredData: ['breadcrumb'] },
    { id: 'docsFaq', path: '/docs/faq', structuredData: ['breadcrumb', 'faq'] },
    { id: 'demo', path: '/demo', structuredData: ['breadcrumb'] },
    { id: 'guidelines', path: '/guidelines', structuredData: ['breadcrumb'] },
    { id: 'legal', path: '/legal', structuredData: ['breadcrumb'] },
    { id: 'privacy', path: '/privacy-policy', structuredData: ['breadcrumb'] },
] as const satisfies readonly SeoRoute[]

/**
 * Private paths prerendered so they answer 200 instead of falling through to
 * the SPA fallback. They carry `noindex` and stay out of the sitemap.
 */
export const SHELL_ROUTES = [
    '/dashboard',
    '/dashboard/settings',
    '/dashboard/logs',
    '/dashboard/recordings',
    '/dashboard/recordings/detail',
    '/dashboard/record-restrictions',
] as const

export function isLocale(value: string | undefined): value is Locale {
    return value !== undefined && (LOCALES as readonly string[]).includes(value)
}

/** `/docs` + `en` -> `/en/docs`. French stays unprefixed. */
export function localizePath(path: string, locale: Locale): string {
    if (locale === DEFAULT_LOCALE) {
        return path
    }

    return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** `/en/docs` -> `{ locale: 'en', path: '/docs' }`. */
export function parseLocalizedPath(pathname: string): { locale: Locale; path: string } {
    const segments = pathname.split('/').filter(Boolean)
    const [first, ...rest] = segments

    if (isLocale(first) && first !== DEFAULT_LOCALE) {
        return { locale: first, path: `/${rest.join('/')}`.replace(/\/$/, '') || '/' }
    }

    return { locale: DEFAULT_LOCALE, path: `/${segments.join('/')}`.replace(/\/$/, '') || '/' }
}

export function canonicalUrl(path: string, locale: Locale): string {
    const localized = localizePath(path, locale)
    return localized === '/' ? `${SITE_URL}/` : `${SITE_URL}${localized}`
}

export type SeoRouteDefinition = (typeof SEO_ROUTES)[number]
export type SeoRouteId = SeoRouteDefinition['id']

export function findSeoRoute(path: string): SeoRouteDefinition | undefined {
    return SEO_ROUTES.find((route) => route.path === path)
}

