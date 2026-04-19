import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { PlayCircleIcon } from '@heroicons/react/24/outline'
import { ResponsiveSidebarLayout } from './ResponsiveSidebarLayout'
import { demoSidebarNavigation } from '../../constants'

export function DemoLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ResponsiveSidebarLayout
            mobileTitle="Démo"
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCloseSidebar={() => setSidebarOpen(false)}
            asideClassName="fixed inset-y-0 left-0 z-40 mt-16 w-72 overflow-y-auto border-r border-base-300 bg-base-200 lg:static lg:mt-0 lg:bg-base-200/50"
            contentWrapperClassName="py-0"
            sidebar={
                <nav className="space-y-4 p-4">
                    <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="inline-flex rounded-lg bg-primary/15 p-2 text-primary">
                                <PlayCircleIcon className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-semibold">Démo publique</h2>
                        </div>
                        <p className="mt-2 text-sm text-base-content/65">
                            Aperçu public du dashboard sans connexion Discord ou installation du bot.
                        </p>
                    </div>

                    <div>
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">Navigation</p>
                        {demoSidebarNavigation.map((item, index) => {
                            const IconComponent = item.icon

                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.href}
                                    end={item.end}
                                    className={({ isActive }) => `${index > 0 ? 'mt-1 ' : ''}flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                        isActive
                                            ? 'bg-primary/20 text-primary font-semibold'
                                            : 'text-base-content/75 hover:bg-base-300/50'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </NavLink>
                            )
                        })}
                    </div>
                </nav>
            }
        >
            <Outlet />
        </ResponsiveSidebarLayout>
    )
}