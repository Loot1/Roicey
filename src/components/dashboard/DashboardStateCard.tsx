import type { ReactNode } from 'react'

type DashboardStateCardProps = {
    children: ReactNode
    tone?: 'default' | 'muted' | 'dashed'
    className?: string
}

export function DashboardStateCard({
    children,
    tone = 'default',
    className,
}: DashboardStateCardProps) {
    const toneClassName = tone === 'muted'
        ? 'border border-base-300 bg-base-200/40'
        : tone === 'dashed'
            ? 'border border-dashed border-base-300 bg-base-100'
            : 'border border-base-300 bg-base-100'

    return (
        <div className={['rounded-[1.5rem] p-8 shadow-sm', toneClassName, className].filter(Boolean).join(' ')}>
            {children}
        </div>
    )
}