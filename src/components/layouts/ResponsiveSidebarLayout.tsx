import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

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

const SIDEBAR_ID = 'responsive-sidebar'

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
    const { t } = useTranslation()

    // The overlay closes the sidebar on click; Escape is the same affordance for
    // a keyboard visitor, who cannot click through to it.
    useEffect(() => {
        if (!sidebarOpen) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCloseSidebar()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onCloseSidebar, sidebarOpen])

    return (
        <div className="flex min-h-full flex-1 bg-base-100">
            {/*
              * Closed, the drawer is only pushed off-screen, so `invisible`
              * carries it out of the tab order and out of the accessibility
              * tree too -- otherwise its links stay focusable behind the page.
              * Above `lg` the drawer is part of the layout and always shown.
              */}
            <aside
                id={SIDEBAR_ID}
                className={`${asideClassName} transition-transform lg:visible lg:translate-x-0 ${
                    sidebarOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
                }`}
            >
                {sidebar}
            </aside>

            <div className="w-full flex-1">
                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
                    <p className="font-semibold">{mobileTitle}</p>
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={t('nav.toggleSidebarAria')}
                        aria-expanded={sidebarOpen}
                        aria-controls={SIDEBAR_ID}
                    >
                        {sidebarOpen
                            ? <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            : <Bars3Icon className="h-5 w-5" aria-hidden="true" />}
                    </button>
                </div>

                <div className={contentWrapperClassName}>{children}</div>
            </div>

            {sidebarOpen ? (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onCloseSidebar}
                    aria-hidden="true"
                ></div>
            ) : null}
        </div>
    )
}
