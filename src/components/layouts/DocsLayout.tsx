import { NavLink, Outlet } from 'react-router'
import { useState } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { ResponsiveSidebarLayout } from './ResponsiveSidebarLayout'
import { docsSidebarNavigation } from '../../constants'
import { VOICEY_HELP_DISCORD_URL } from '../../constants/externalLinks'

export function DocsLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ResponsiveSidebarLayout
            mobileTitle="Documentation"
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCloseSidebar={() => setSidebarOpen(false)}
            asideClassName="fixed inset-0 z-40 w-64 overflow-y-auto border-r border-base-300 bg-base-200 lg:static lg:z-auto lg:bg-base-200/50"
            contentWrapperClassName="mx-auto max-w-4xl px-6 py-12 lg:px-10"
            sidebar={
                <nav className="space-y-4 p-4">
                    <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm transition hover:border-primary/30 hover:bg-base-100/90">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="inline-flex rounded-lg bg-primary/15 p-2 text-primary">
                                <QuestionMarkCircleIcon className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-semibold">Discord d'aide</h2>
                        </div>
                        <p className="mt-2 text-sm text-base-content/65">
                            Envie d'en savoir plus sur Voicey ou simplement besoin d'aide ?
                        </p>
                        <div className="mt-4">
                            <a href={VOICEY_HELP_DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                                Rejoindre le Discord
                            </a>
                        </div>
                    </div>

                    <div>
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">
                            Documentation
                        </p>
                        {docsSidebarNavigation.map((item, index) => {
                            const IconComponent = item.icon

                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.href}
                                    end={item.href === '/docs'}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => `${index > 0 ? 'mt-1 ' : ''}flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                                        isActive
                                            ? 'bg-primary/20 text-primary font-semibold'
                                            : 'text-base-content/70 hover:bg-base-300/50'
                                    }`}
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
