import type { MetaDescriptor } from 'react-router'
import frSeo from './locales/fr/seo.json'
import enSeo from './locales/en/seo.json'
import {
    LOCALES,
    OG_IMAGE_PATHS,
    OG_IMAGE_SIZE,
    SEO_ROUTES,
    SITE_NAME,
    SITE_URL,
    X_DEFAULT_LOCALE,
    canonicalUrl,
    parseLocalizedPath,
    type Locale,
    type SeoRouteId,
} from './seoRoutes'
import { structuredDataFor } from './structuredData'

/**
 * Builds the document head of a page from the route table.
 *
 * Every public route module exports `meta = seoMeta('<routeId>')`. Since one
 * module serves both locales, the locale is read back from the URL -- the same
 * rule the canonical and hreflang tags advertise.
 */

const SEO_TEXT = { fr: frSeo.seo, en: enSeo.seo }

const OG_LOCALES: Record<Locale, string> = {
    fr: 'fr_FR',
    en: 'en_US',
}

type MetaArgs = { location: { pathname: string } }

/** Pages that exist outside the public route table and must not be indexed. */
type PrivateSeoId = 'notFound' | 'dashboard'

function shared(locale: Locale, title: string, description: string, url: string): MetaDescriptor[] {
    const image = `${SITE_URL}${OG_IMAGE_PATHS[locale]}`

    return [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: String(OG_IMAGE_SIZE.width) },
        { property: 'og:image:height', content: String(OG_IMAGE_SIZE.height) },
        { property: 'og:image:alt', content: SEO_TEXT[locale].ogImageAlt },
        { property: 'og:locale', content: OG_LOCALES[locale] },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
    ]
}

export function seoMeta(routeId: SeoRouteId) {
    const route = SEO_ROUTES.find((entry) => entry.id === routeId)

    if (!route) {
        throw new Error(`Unknown SEO route id: ${routeId}`)
    }

    return ({ location }: MetaArgs): MetaDescriptor[] => {
        const { locale } = parseLocalizedPath(location.pathname)
        const { title, description } = SEO_TEXT[locale][routeId]
        const url = canonicalUrl(route.path, locale)

        return [
            ...shared(locale, title, description, url),
            { name: 'robots', content: 'index, follow' },
            { tagName: 'link', rel: 'canonical', href: url },
            ...LOCALES.map((alternate) => ({
                tagName: 'link',
                rel: 'alternate',
                hrefLang: alternate,
                href: canonicalUrl(route.path, alternate),
            })),
            {
                tagName: 'link',
                rel: 'alternate',
                hrefLang: 'x-default',
                href: canonicalUrl(route.path, X_DEFAULT_LOCALE),
            },
            ...structuredDataFor(route, locale).map((data) => ({ 'script:ld+json': data })),
        ] as MetaDescriptor[]
    }
}

/** Head for a private or unknown page: enough to render, nothing to index. */
export function privateSeoMeta(seoId: PrivateSeoId) {
    return ({ location }: MetaArgs): MetaDescriptor[] => {
        const { locale } = parseLocalizedPath(location.pathname)
        const { title, description } = SEO_TEXT[locale][seoId]

        return [
            { title },
            { name: 'description', content: description },
            { name: 'robots', content: 'noindex, follow' },
        ]
    }
}
