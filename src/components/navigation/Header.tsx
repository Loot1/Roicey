import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Bars3Icon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../../assets/images/voicey-logo-96.webp'
import { getDiscordSession, logoutDiscord, onAuthChanged, startDiscordLogin } from '../../api/discordAuth'
import { HEADER_NAVIGATION } from '../../config'
import type { DiscordUser } from '../../types'
import { useTheme } from '../../hooks/useTheme'
import { useLocale, useLocalizedPath, storeLocale } from '../../hooks/useLocale'
import { publicPath, type Locale } from '../../config/seoRoutes'

export function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const { toggleTheme } = useTheme()
    const { i18n, t } = useTranslation()
    const { locale: currentLang, basePath, isPublicRoute } = useLocale()
    const localizedPath = useLocalizedPath()

    const languages = [
        { code: 'fr', label: 'Français', flag: '🇫🇷', display: 'FR' },
        { code: 'en', label: 'English', flag: '🇺🇸', display: 'EN' },
    ] as const

    const headerRef = useRef<HTMLElement | null>(null)
    const langDropdownRef = useRef<HTMLDetailsElement | null>(null)

    const closeMenus = useCallback((except?: Node) => {
        headerRef.current?.querySelectorAll('details[open]').forEach((menu) => {
            if (!except || !menu.contains(except)) {
                menu.removeAttribute('open')
            }
        })
    }, [])

    /**
     * Every menu here is a `<details>`, which browsers expose to assistive tech
     * with a real expanded state and operate with the keyboard for free. What
     * `<details>` does not do on its own is close, and Escape plus a click
     * outside are what a menu is expected to answer to.
     */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenus()
            }
        }

        const handlePointerDown = (event: PointerEvent) => closeMenus(event.target as Node)

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [closeMenus])

    // A menu left open across a navigation hides the page the visitor just asked for.
    useEffect(() => closeMenus(), [closeMenus, location.key])

    const handleChangeLang = (code: Locale) => {
        storeLocale(code)

        if (isPublicRoute) {
            // Each language has its own URL, so switching is a navigation.
            navigate(`${publicPath(basePath, code)}${location.search}${location.hash}`)
        } else {
            void i18n.changeLanguage(code)
        }

        if (langDropdownRef.current) {
            langDropdownRef.current.removeAttribute('open')
        }
    }

    const currentCode = languages.find((l) => l.code === currentLang)?.display ?? 'EN'
    const [user, setUser] = useState<DiscordUser | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const currentPath = `${location.pathname}${location.search}`

    const isActive = (path: string, exact = false) => {
        if (exact) {
            return basePath === path
        }

        return basePath === path || basePath.startsWith(`${path}/`)
    }

    useEffect(() => {
        let ignore = false

        const loadSession = async () => {
            try {
                const sessionUser = await getDiscordSession()
                if (!ignore) {
                    setUser(sessionUser)
                }
            } catch {
                if (!ignore) {
                    setUser(null)
                }
            } finally {
                if (!ignore) {
                    setLoadingUser(false)
                }
            }
        }

        void loadSession()

        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        return onAuthChanged(() => {
            void (async () => {
                const sessionUser = await getDiscordSession()
                setUser(sessionUser)
            })()
        })
    }, [])

    const handleLogout = async () => {
        await logoutDiscord()
        setUser(null)
    }

    const handleLoginClick = () => void startDiscordLogin(currentPath).catch(console.error)
    const handleLogoutClick = () => void handleLogout().catch(console.error)

    return (
        <header ref={headerRef} className="navbar bg-base-100 shadow-md border-base-200/50">
            <div className="navbar-start">
                <details className="dropdown lg:hidden">
                    <summary className="btn btn-ghost" aria-label={t('nav.openMenuAria')}>
                        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                    </summary>
                    <nav
                        aria-label={t('nav.mainMenuAria')}
                        className="dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200"
                    >
                        <ul className="menu menu-sm w-full p-0">
                            {HEADER_NAVIGATION.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={localizedPath(item.href)}
                                        aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
                                        className={isActive(item.href, item.exact) ? 'active font-semibold' : ''}
                                    >
                                        {t(item.label)}
                                    </Link>
                                </li>
                            ))}
                            {!user && !loadingUser ? (
                                <li className="sm:hidden">
                                    <button type="button" onClick={handleLoginClick}>
                                        {t('nav.login')}
                                    </button>
                                </li>
                            ) : null}
                            {user ? (
                                <>
                                    <li className="menu-title px-2 py-1 sm:hidden">
                                        <span>{user.global_name ?? user.username}</span>
                                    </li>
                                    <li className="sm:hidden"><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
                                    <li className="sm:hidden">
                                        <button type="button" onClick={handleLogoutClick}>{t('nav.logout')}</button>
                                    </li>
                                </>
                            ) : null}
                        </ul>
                    </nav>
                </details>
                <Link to={localizedPath('/')} className="btn btn-ghost text-lg font-black">
                    <img
                        src={logoSansFond}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-lg object-cover"
                    />
                    Voicey
                </Link>
            </div>
            <nav aria-label={t('nav.mainMenuAria')} className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {HEADER_NAVIGATION.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={localizedPath(item.href)}
                                aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
                                className={`rounded-lg transition-all ${
                                    isActive(item.href, item.exact)
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'hover:bg-base-200'
                                }`}
                            >
                                {t(item.label)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="navbar-end gap-2">
                <details ref={langDropdownRef} className="dropdown dropdown-end">
                    <summary
                        className="btn btn-ghost btn-circle text-xs font-bold"
                        aria-label={t('nav.changeLanguageAria')}
                        title={t('nav.changeLanguageAria')}
                    >
                        {currentCode}
                    </summary>
                    <ul className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 mt-3 w-40 p-2 shadow-lg border border-base-200">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    type="button"
                                    lang={lang.code}
                                    onClick={() => handleChangeLang(lang.code)}
                                    aria-current={currentLang === lang.code ? true : undefined}
                                    className={currentLang === lang.code ? 'active font-semibold' : ''}
                                >
                                    <span aria-hidden="true">{lang.flag}</span>
                                    {lang.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </details>
                <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    onClick={toggleTheme}
                    aria-label={t('nav.toggleTheme')}
                    title={t('nav.toggleTheme')}
                >
                    <SunIcon className="theme-icon-sun h-5 w-5" aria-hidden="true" />
                    <MoonIcon className="theme-icon-moon h-5 w-5" aria-hidden="true" />
                </button>
                {/*
                  * The session answer lands after first paint, so the slot it
                  * will fill is reserved from the start: without it the whole
                  * navbar reflows on every single page load.
                  */}
                {loadingUser ? (
                    <div className="skeleton hidden h-8 w-28 sm:block" aria-hidden="true"></div>
                ) : null}
                {!user && !loadingUser ? (
                    <button
                        type="button"
                        className="btn btn-primary btn-sm hidden gap-2 sm:inline-flex"
                        onClick={handleLoginClick}
                    >
                        <UserCircleIcon className="h-5 w-5" aria-hidden="true" />
                        {t('nav.login')}
                    </button>
                ) : null}
                {user ? (
                    <details className="dropdown dropdown-end hidden sm:block">
                        <summary
                            className="btn btn-ghost h-auto min-h-0 rounded-box px-2 py-1.5 md:px-3"
                            aria-label={t('nav.userMenuAria')}
                        >
                            <span className="flex items-center gap-2">
                                <img
                                    src={user.avatarUrl}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full border border-base-300 object-cover"
                                />
                                <span className="max-w-32 truncate text-sm font-semibold">
                                    {user.global_name ?? user.username}
                                </span>
                            </span>
                        </summary>
                        <ul className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200">
                            <li className="menu-title px-2 py-1">
                                <span>{user.global_name ?? user.username}</span>
                            </li>
                            <li><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
                            <li><button type="button" onClick={handleLogoutClick}>{t('nav.logout')}</button></li>
                        </ul>
                    </details>
                ) : null}
            </div>
        </header>
    )
}
