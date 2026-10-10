import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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

/**
 * Date of the last commit that touched the site itself.
 *
 * A `lastmod` recomputed at every build tells search engines that all 24 URLs
 * changed whenever anything is rebuilt, which is exactly the signal Google
 * learns to ignore. Pinning it to the last content commit means a rebuild with
 * no source change re-publishes the same date.
 *
 * Requires full history: the deploy workflow checks out with `fetch-depth: 0`.
 * Falls back to today when git is unavailable (tarball, shallow clone).
 */
function lastContentChange(): string {
    try {
        const stdout = execFileSync(
            'git',
            ['log', '-1', '--format=%cI', '--', 'src', 'public'],
            { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        ).trim()

        if (stdout) {
            return stdout.slice(0, 10)
        }
    } catch {
        // Not a git checkout, or git is missing: fall through.
    }

    return new Date().toISOString().slice(0, 10)
}

function buildSitemap(): string {
    const lastmod = lastContentChange()

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

/**
 * The SPA fallback is rendered without a matched route, so React Router emits
 * it with an empty `<head>` and an empty `<body>`. Served as 404.html it is
 * still the page a visitor and a crawler land on for any unknown URL, so it
 * gets the one thing it cannot render client-side in time: a title, and an
 * explicit `noindex` in case the host ever answers 200 for it.
 */
function buildNotFoundPage(fallbackHtml: string): string {
    const head = '<title>Page introuvable - Voicey</title>'
        + '<meta name="robots" content="noindex, follow"/>'

    if (!fallbackHtml.includes('</head>')) {
        throw new Error('__spa-fallback.html has no </head>: cannot build 404.html')
    }

    return fallbackHtml.replace('</head>', `${head}</head>`)
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

    writeFileSync(
        join(clientDirectory, '404.html'),
        buildNotFoundPage(readFileSync(fallback, 'utf8')),
    )

    const urls = SEO_ROUTES.length * LOCALES.length
    console.log(`\nsitemap.xml: ${urls} URLs · 404.html: SPA fallback + title and noindex`)
}
