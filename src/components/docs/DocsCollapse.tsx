import type { ReactNode } from 'react'

type DocsCollapseProps = {
    name: string
    title: ReactNode
    defaultChecked?: boolean
    children: ReactNode
}

export function DocsCollapse({
    name,
    title,
    defaultChecked = false,
    children,
}: DocsCollapseProps) {
    return (
        <div className="collapse collapse-arrow border border-base-300 bg-base-200/50">
            <input type="radio" name={name} defaultChecked={defaultChecked} />
            <div className="collapse-title font-semibold">{title}</div>
            <div className="collapse-content text-sm">{children}</div>
        </div>
    )
}