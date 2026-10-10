import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'
import { LOCALES, localizePath, type Locale } from './config/seoRoutes'

/**
 * Pathless route that registers a locale's strings with i18next. Wrapping each
 * locale's pages in it is what puts that locale in its own chunk: see
 * src/config/i18n.ts.
 */
const LOCALE_RESOURCES: Record<Locale, string> = {
    fr: './components/layouts/locales/FrenchResources.tsx',
    en: './components/layouts/locales/EnglishResources.tsx',
}

/**
 * Public pages are mounted once per locale from the very same modules: French
 * unprefixed (`/docs`), English under `/en` (`/en/docs`). Because a module is
 * reused across locales, every entry needs an explicit `id` -- React Router
 * derives ids from file paths and would otherwise collide.
 */
function publicRoutes(locale: Locale) {
    const id = (name: string) => `${locale}-${name}`
    // Paths here are absolute-from-root, so localizePath's leading slash goes.
    const path = (route: string) => localizePath(route, locale).replace(/^\//, '')

    const home = locale === LOCALES[0]
        ? index('./routes/HomePage.tsx', { id: id('home') })
        : route(path('/'), './routes/HomePage.tsx', { id: id('home') })

    return layout(LOCALE_RESOURCES[locale], { id: id('resources') }, [
        home,
        route(path('/about'), './routes/AboutPage.tsx', { id: id('about') }),
        route(path('/guidelines'), './routes/GuidelinesPage.tsx', { id: id('guidelines') }),
        route(path('/privacy-policy'), './routes/PrivacyPage.tsx', { id: id('privacy') }),
        route(path('/legal'), './routes/LegalPage.tsx', { id: id('legal') }),

        route(path('/demo'), './components/layouts/DemoLayout.tsx', { id: id('demo') }, [
            index('./routes/demo/DemoRecordingsPage.tsx', { id: id('demo-recordings') }),
        ]),

        route(path('/docs'), './components/layouts/DocsLayout.tsx', { id: id('docs') }, [
            index('./routes/docs/DocsGettingStartedPage.tsx', { id: id('docs-index') }),
            route('commands', './routes/docs/DocsCommandsPage.tsx', { id: id('docs-commands') }),
            route('recording', './routes/docs/DocsRecordingPage.tsx', { id: id('docs-recording') }),
            route('settings', './routes/docs/DocsSettingsPage.tsx', { id: id('docs-settings') }),
            route('moderation', './routes/docs/DocsModerationPage.tsx', { id: id('docs-moderation') }),
            route('faq', './routes/docs/DocsFAQPage.tsx', { id: id('docs-faq') }),
        ]),
    ])
}

export default [
    layout('./components/layouts/Layout.tsx', [
        ...LOCALES.map(publicRoutes),

        layout('./components/layouts/locales/EveryLocaleResources.tsx', [
            route('dashboard', './routes/dashboard/DashboardRoute.tsx', [
                index('./routes/dashboard/DashboardOverviewPage.tsx'),
                route('settings', './routes/dashboard/DashboardSettingsPage.tsx'),
                route('logs', './routes/dashboard/DashboardLogsViewerPage.tsx'),
                route('record-restrictions', './routes/dashboard/DashboardRecordRestrictionsPage.tsx'),
                route('recordings', './routes/dashboard/DashboardRecordingsPage.tsx'),
                route('recordings/detail', './routes/dashboard/DashboardRecordingDetailPage.tsx'),
            ]),

            route('*', './routes/NotFoundPage.tsx'),
        ]),
    ]),
] satisfies RouteConfig
