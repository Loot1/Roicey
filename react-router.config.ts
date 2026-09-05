import { join } from 'node:path'
import type { Config } from '@react-router/dev/config'
import { LOCALES, SEO_ROUTES, SHELL_ROUTES, localizePath } from './src/config/seoRoutes'
import { writeStaticHostingFiles } from './scripts/postbuild'

/**
 * Static generation, no runtime server.
 *
 * `ssr: false` plus a `prerender` list turns the app into plain HTML files that
 * GitHub Pages serves directly: every public URL answers 200 with its content,
 * head and JSON-LD already in the document.
 *
 * The list is derived from the route table in src/config/seoRoutes.ts, the same
 * one that drives routing (src/routes.ts) and the per-page metadata
 * (src/config/seoMeta.ts), so the three can never drift apart.
 */
export default {
    appDirectory: 'src',
    buildDirectory: 'dist',
    ssr: false,
    prerender: [
        ...SEO_ROUTES.flatMap((route) => LOCALES.map((locale) => localizePath(route.path, locale))),
        ...SHELL_ROUTES,
    ],
    buildEnd({ reactRouterConfig }) {
        writeStaticHostingFiles(join(reactRouterConfig.buildDirectory, 'client'))
    },
} satisfies Config
