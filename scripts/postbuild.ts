import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
    LOCALES,
    SEO_ROUTES,
    X_DEFAULT_LOCALE,
    canonicalUrl,
} from '../src/config/seoRoutes'

/**
 * The two files React Router does not produce itself.
 *
 * Called from `buildEnd` in react-router.config.ts, so `npm run build` stays a
 * single command.
 */

function buildSitemap(): string {
    const lastmod = new Date().toISOString().slice(0, 10)

    const entries = SEO_ROUTES.flatMap((route) =>
        LOCALES.map((locale) => {
            const alternates = [
                ...LOCALES.map((alternate) => ({
                    hreflang: alternate as string,
                    href: canonicalUrl(route.path, alternate),
                })),
                { hreflang: 'x-default', href: canonicalUrl(route.path, X_DEFAULT_LOCALE) },
            ]

            return [
                '  <url>',
                `    <loc>${canonicalUrl(route.path, locale)}</loc>`,
                ...alternates.map((alternate) =>
                    `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`),
                `    <lastmod>${lastmod}</lastmod>`,
                `    <priority>${route.priority.toFixed(1)}</priority>`,
                '  </url>',
            ].join('\n')
        }),
    )

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...entries,
        '</urlset>',
        '',
    ].join('\n')
}

export function writeStaticHostingFiles(clientDirectory: string) {
    writeFileSync(join(clientDirectory, 'sitemap.xml'), buildSitemap())

    // GitHub Pages serves 404.html for any path without a file. React Router's
    // SPA fallback boots the router from window.location, so an unprerendered
    // URL still resolves to the right route -- no redirect dance needed.
    const fallback = join(clientDirectory, '__spa-fallback.html')

    if (!existsSync(fallback)) {
        throw new Error('__spa-fallback.html is missing: cannot produce 404.html')
    }

    copyFileSync(fallback, join(clientDirectory, '404.html'))

    const urls = SEO_ROUTES.length * LOCALES.length
    console.log(`\nsitemap.xml: ${urls} URLs · 404.html: copied from the SPA fallback`)
}
