import type { ReactNode } from 'react'

type DashboardStatCardProps = {
    icon?: ReactNode
    label: ReactNode
    value: ReactNode
    description?: ReactNode
}

export function DashboardStatCard({ icon, label, value, description }: DashboardStatCardProps) {
    return (
        <div className="rounded-[1.4rem] border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3 text-primary">
                {icon}
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/50">{label}</p>
            </div>
            <p className="text-2xl font-black">{value}</p>
            {description ? <div className="mt-1 text-sm text-base-content/70">{description}</div> : null}
        </div>
    )
}