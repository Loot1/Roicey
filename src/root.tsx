import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router'
import type { LinksFunction } from 'react-router'
import stylesheet from './assets/css/index.css?url'
import i18n, { initI18n } from './config/i18n'
import { THEME_COLOR } from './config/seoRoutes'
import { resolveLocaleForPath } from './hooks/useLocale'
import { ThemeProvider } from './contexts/ThemeContext'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet },
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
]

/**
 * Applies the stored theme before first paint, so the prerendered markup never
 * flashes the wrong palette. Mirrors src/contexts/ThemeContext.tsx.
 */
const THEME_BOOTSTRAP = `(function () {
  try {
    const stored = localStorage.getItem('voicey-theme')
    const theme = stored === 'voicey' || stored === 'voicey-dark'
      ? stored
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'voicey-dark' : 'voicey')

    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme === 'voicey-dark' ? 'dark' : 'light'
  } catch {}
})()`

export function Layout({ children }: { children: React.ReactNode }) {
    const { locale } = resolveLocaleForPath(useLocation().pathname)

    return (
        <html lang={locale}>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="Loot1" />
                <meta name="theme-color" content={THEME_COLOR} />
                <Meta />
                <Links />
                <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function Root() {
    const { locale } = resolveLocaleForPath(useLocation().pathname)

    // Translations are bundled, so switching resolves synchronously and the
    // children below render in the right language on the very first pass --
    // which is what the prerendered HTML and the hreflang tags both promise.
    initI18n(locale)
    if (i18n.language !== locale) {
        void i18n.changeLanguage(locale)
    }

    return (
        <ThemeProvider>
            <Outlet />
        </ThemeProvider>
    )
}
