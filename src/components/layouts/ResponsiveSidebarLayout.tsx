import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'

interface ResponsiveSidebarLayoutProps {
    mobileTitle: string
    sidebarOpen: boolean
    onToggleSidebar: () => void
    onCloseSidebar: () => void
    sidebar: ReactNode
    children: ReactNode
    asideClassName: string
    contentWrapperClassName?: string
}

export function ResponsiveSidebarLayout({
    mobileTitle,
    sidebarOpen,
    onToggleSidebar,
    onCloseSidebar,
    sidebar,
    children,
    asideClassName,
    contentWrapperClassName,
}: ResponsiveSidebarLayoutProps) {
    return (
        <div className="flex min-h-screen bg-base-100">
            <aside
                className={`${asideClassName} transition-transform lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebar}
            </aside>

            <div className="w-full flex-1">
                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
                    <h1 className="font-semibold">{mobileTitle}</h1>
                    <button
                        onClick={onToggleSidebar}
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                    </button>
                </div>

                <div className={contentWrapperClassName}>{children}</div>
            </div>

            {sidebarOpen ? (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onCloseSidebar}
                ></div>
            ) : null}
        </div>
    )
}