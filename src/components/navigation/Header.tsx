import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Bars3Icon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../../assets/images/voicey-logo-96.webp'
import { getDiscordSession, logoutDiscord, onAuthChanged, startDiscordLogin } from '../../api/discordAuth'
import { HEADER_NAVIGATION } from '../../config'
import type { DiscordUser } from '../../types'
import { useTheme } from '../../hooks/useTheme'
import { useLocale, useLocalizedPath, storeLocale } from '../../hooks/useLocale'
import { localizePath, type Locale } from '../../config/seoRoutes'

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

    const langDropdownRef = useRef<HTMLDetailsElement | null>(null)

    const handleChangeLang = (code: Locale) => {
        storeLocale(code)

        if (isPublicRoute) {
            // Each language has its own URL, so switching is a navigation.
            navigate(`${localizePath(basePath, code)}${location.search}${location.hash}`)
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
        <div className="navbar bg-base-100 shadow-md border-base-200/50">
            <div className="navbar-start">
                <div className="dropdown">
                    <button tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200">
                        {HEADER_NAVIGATION.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={localizedPath(item.href)}
                                    className={isActive(item.href, item.exact) ? 'active font-semibold' : ''}
                                >
                                    {t(item.label)}
                                </Link>
                            </li>
                        ))}
                        {!user && !loadingUser ? (
                            <li className="sm:hidden">
                                <button onClick={handleLoginClick}>
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
                                <li className="sm:hidden"><button onClick={handleLogoutClick}>{t('nav.logout')}</button></li>
                            </>
                        ) : null}
                    </ul>
                </div>
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
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {HEADER_NAVIGATION.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={localizedPath(item.href)}
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
            </div>
            <div className="navbar-end gap-2">
                <details ref={langDropdownRef} className="dropdown dropdown-end">
                    <summary
                        className="btn btn-ghost btn-circle text-xs font-bold"
                        aria-label="Changer de langue"
                        title="Changer de langue"
                    >
                        {currentCode}
                    </summary>
                    <ul className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 mt-3 w-40 p-2 shadow-lg border border-base-200">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleChangeLang(lang.code)}
                                    className={currentLang === lang.code ? 'active font-semibold' : ''}
                                >
                                    <span>{lang.flag}</span>
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
                    <SunIcon className="theme-icon-sun h-5 w-5" />
                    <MoonIcon className="theme-icon-moon h-5 w-5" />
                </button>
                {!user && !loadingUser ? (
                    <button
                        className="btn btn-primary btn-sm hidden gap-2 sm:inline-flex"
                        onClick={handleLoginClick}
                    >
                        <UserCircleIcon className="h-5 w-5" />
                        {t('nav.login')}
                    </button>
                ) : null}
                {user ? (
                <div className="dropdown dropdown-end hidden sm:block">
                    <button
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost h-auto min-h-0 rounded-box px-2 py-1.5 md:px-3"
                        title="Menu utilisateur"
                    >
                        <span className="flex items-center gap-2">
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="h-8 w-8 rounded-full border border-base-300 object-cover"
                            />
                            <span className="max-w-32 truncate text-sm font-semibold">
                                {user.global_name ?? user.username}
                            </span>
                        </span>
                    </button>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
                    >
                        <li className="menu-title px-2 py-1">
                            <span>{user.global_name ?? user.username}</span>
                        </li>
                        <li><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
                        <li><button onClick={handleLogoutClick}>{t('nav.logout')}</button></li>
                    </ul>
                </div>
                ) : null}
            </div>
        </div>
    )
}