import type { ReactNode } from 'react'

type DocsCardProps = {
    title: ReactNode
    description?: ReactNode
    children?: ReactNode
}

export function DocsCard({ title, description, children }: DocsCardProps) {
    return (
        <div className="card border border-base-300 bg-base-200/50">
            <div className="card-body">
                <h3 className="card-title text-lg">{title}</h3>
                {description ? <p className="text-sm">{description}</p> : null}
                {children}
            </div>
        </div>
    )
}