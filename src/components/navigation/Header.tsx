import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../../assets/images/voicey-logo.png'
import { getDiscordSession, logoutDiscord, onAuthChanged, startDiscordLogin } from '../../api/discordAuth'
import { headerNavigation } from '../../constants'
import type { DiscordUser } from '../../types'

export function Header() {
    const location = useLocation()
    const [user, setUser] = useState<DiscordUser | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const currentPath = `${location.pathname}${location.search}`

    const isActive = (path: string, exact = false) => {
        if (exact) {
            return location.pathname === path
        }

        return location.pathname === path || location.pathname.startsWith(`${path}/`)
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
        <div className="navbar bg-base-100 shadow-md border-base-200/50">
            <div className="navbar-start">
                <div className="dropdown">
                    <button tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <Bars3Icon className="h-5 w-5" />
                    </button>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200">
                        {headerNavigation.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className={isActive(item.href, item.exact) ? 'active font-semibold' : ''}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        {!user && !loadingUser ? (
                            <li className="sm:hidden">
                                <button onClick={() => void startDiscordLogin(currentPath).catch(console.error)}>
                                    Se connecter
                                </button>
                            </li>
                        ) : null}
                        {user ? (
                            <>
                                <li className="menu-title px-2 py-1 sm:hidden">
                                    <span>{user.global_name ?? user.username}</span>
                                </li>
                                <li className="sm:hidden"><Link to="/dashboard">Dashboard</Link></li>
                                <li className="sm:hidden"><button onClick={() => void handleLogout().catch(console.error)}>Déconnexion</button></li>
                            </>
                        ) : null}
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
                    {headerNavigation.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className={`rounded-lg transition-all ${
                                    isActive(item.href, item.exact)
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
                {!user && !loadingUser ? (
                    <button
                        className="btn btn-primary btn-sm hidden gap-2 sm:inline-flex"
                        onClick={() => void startDiscordLogin(currentPath).catch(console.error)}
                    >
                        <UserCircleIcon className="h-5 w-5" />
                        Se connecter
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
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button onClick={() => void handleLogout().catch(console.error)}>Déconnexion</button></li>
                    </ul>
                </div>
                ) : null}
            </div>
        </div>
    )
}