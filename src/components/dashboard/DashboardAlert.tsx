import type { ReactNode } from 'react'

type DashboardAlertTone = 'info' | 'warning' | 'success' | 'error'

type DashboardAlertProps = {
    tone?: DashboardAlertTone
    icon?: ReactNode
    children: ReactNode
    className?: string
}

export function DashboardAlert({
    tone = 'info',
    icon,
    children,
    className,
}: DashboardAlertProps) {
    return (
        <div className={['alert', `alert-${tone}`, className].filter(Boolean).join(' ')}>
            {icon}
            <span className="w-full">{children}</span>
        </div>
    )
}