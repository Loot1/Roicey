import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../../assets/images/voicey-logo.png'
import { getDiscordSession, logoutDiscord, onAuthChanged, startDiscordLogin } from '../../api/discordAuth'
import type { DiscordUser } from '../../types'

export function Header() {
    const location = useLocation()
    const [user, setUser] = useState<DiscordUser | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const currentPath = `${location.pathname}${location.search}`
    
    const isActive = (path: string) => location.pathname === path

    const navItems = [
        { label: 'Accueil', href: '/' },
        { label: 'À propos', href: '/about' },
        { label: 'Documentation', href: '/docs' },
    ]

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
    }, [location.pathname])

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

    return (
        <div className="navbar bg-base-100 shadow-md border-b border-base-200/50">
            <div className="navbar-start">
                <div className="dropdown">
                    <button tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className={isActive(item.href) ? 'active font-semibold' : ''}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-lg font-black">
                    <img
                        src={logoSansFond}
                        alt="Logo Voicey"
                        className="h-8 w-8 rounded-lg object-cover"
                    />
                    Voicey
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className={`rounded-lg transition-all ${
                                    isActive(item.href)
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'hover:bg-base-200'
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end gap-4">
                {user ? (
                    <Link
                        to="/dashboard"
                        className="hidden items-center gap-2 rounded-box border border-base-300 bg-base-200/40 px-3 py-1.5 transition hover:bg-base-300/40 md:flex"
                    >
                        <span className="text-sm font-semibold">{user.global_name ?? user.username}</span>
                    </Link>
                ) : null}

                {!user && !loadingUser ? (
                    <button className="btn btn-primary btn-sm" onClick={() => void startDiscordLogin(currentPath).catch(console.error)}>
                        Se connecter
                    </button>
                ) : null}
                <div className="dropdown dropdown-end">
                    <button
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle"
                        title="Menu utilisateur"
                    >
                        {user ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="h-8 w-8 rounded-full border border-base-300 object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="h-6 w-6" />
                        )}
                    </button>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
                    >
                        {user ? (
                            <li className="menu-title px-2 py-1">
                                <span>{user.global_name ?? user.username}</span>
                            </li>
                        ) : null}
                        {user ? (
                            <li><button onClick={() => void handleLogout().catch(console.error)}>Déconnexion</button></li>
                        ) : (
                            <li><button onClick={() => void startDiscordLogin(currentPath).catch(console.error)}>Connexion Discord</button></li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}