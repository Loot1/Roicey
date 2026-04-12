import { Outlet, useLocation } from 'react-router'
import { useState } from 'react'
import {
    CommandLineIcon,
    Cog6ToothIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { ResponsiveSidebarLayout } from './ResponsiveSidebarLayout'

interface DocNavItem {
    id: string
    title: string
    href: string
    icon: typeof CommandLineIcon
}

export function DocsLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const docItems: DocNavItem[] = [
        {
            id: 'getting-started',
            title: 'Démarrage rapide',
            href: '/docs',
            icon: CommandLineIcon,
        },
        {
            id: 'commands',
            title: 'Commandes',
            href: '/docs/commands',
            icon: CommandLineIcon,
        },
        {
            id: 'configuration',
            title: 'Configuration',
            href: '/docs/configuration',
            icon: Cog6ToothIcon,
        },
        {
            id: 'moderation',
            title: 'Modération',
            href: '/docs/moderation',
            icon: ShieldCheckIcon,
        },
        {
            id: 'faq',
            title: 'FAQ',
            href: '/docs/faq',
            icon: QuestionMarkCircleIcon,
        },
    ]

    const isActive = (href: string) => location.pathname === href

    return (
        <ResponsiveSidebarLayout
            mobileTitle="Documentation"
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCloseSidebar={() => setSidebarOpen(false)}
            asideClassName="fixed inset-0 z-40 w-64 overflow-y-auto border-r border-base-300 bg-base-200/50 lg:static lg:z-auto"
            contentWrapperClassName="mx-auto max-w-4xl px-6 py-12 lg:px-10"
            sidebar={
                <nav className="space-y-1 p-4">
                    <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">
                        Documentation
                    </p>
                    {docItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                                    isActive(item.href)
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'text-base-content/70 hover:bg-base-300/50'
                                }`}
                            >
                                <IconComponent className="h-5 w-5" />
                                <span>{item.title}</span>
                            </a>
                        )
                    })}
                </nav>
            }
        >
            <Outlet />
        </ResponsiveSidebarLayout>
    )
}
