import { Link, useLocation } from 'react-router'
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import logoSansFond from '../assets/images/sansfond.png'

export function Header() {
    const location = useLocation()
    
    const isActive = (path: string) => location.pathname === path

    const navItems = [
        { label: 'Accueil', href: '/' },
        { label: 'À propos', href: '/about' },
        { label: 'Documentation', href: '/docs' },
    ]

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
                <button className="btn btn-primary btn-sm">Ajouter au serveur</button>
                <div className="dropdown dropdown-end">
                    <button
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle"
                        title="Menu utilisateur"
                    >
                        <UserCircleIcon className="h-6 w-6" />
                    </button>
                    <ul
                        tabIndex={0}
                        className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
                    >
                        <li><a href="#dashboard">Dashboard</a></li>
                        <li><a href="#settings">Paramètres</a></li>
                        <li><div className="divider my-0"></div></li>
                        <li><a href="#logout">Déconnexion</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}