import type { ReactNode } from 'react'

type DashboardPageHeaderProps = {
    backButton?: ReactNode
    title: ReactNode
    description?: ReactNode
    actions?: ReactNode
    bottom?: ReactNode
}

export function DashboardPageHeader({
    backButton,
    title,
    description,
    actions,
    bottom,
}: DashboardPageHeaderProps) {
    return (
        <div className="border-b border-base-300/60 px-6 py-6 lg:px-8">
            {backButton ? <div className="flex flex-wrap items-center gap-3">{backButton}</div> : null}

            <div className={`mt-2 space-y-5`}>
                <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-baseline xl:justify-between xl:gap-6">
                            <h1 className="text-4xl font-black tracking-tight">{title}</h1>
                            {actions ? <div className="flex w-full flex-wrap gap-3 xl:w-auto xl:flex-none xl:justify-end">{actions}</div> : null}
                        </div>
                        {description ? <div className="max-w-4xl text-sm text-base-content/66">{description}</div> : null}
                    </div>
                </div>
            </div>

            {bottom ? <div className="mt-5">{bottom}</div> : null}
        </div>
    )
}