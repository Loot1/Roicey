import { Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Header } from '../navigation/Header'
import { Footer } from '../navigation/Footer'
import { CookieBanner } from '../CookieBanner'

/** Site chrome shared by every page. Mounted as a `layout()` route. */
export default function Layout() {
    const { t } = useTranslation()

    return (
        <div className="flex min-h-screen flex-col bg-base-100">
            {/*
              * First focusable element of every page: a keyboard visitor lands
              * on it and can jump past the header nav, which is otherwise ~10
              * links to tab through on each navigation.
              */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:btn focus:btn-primary focus:btn-sm"
            >
                {t('nav.skipToContent')}
            </a>
            <Header />
            <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
                <Outlet />
            </main>
            <Footer />
            <CookieBanner />
        </div>
    )
}
