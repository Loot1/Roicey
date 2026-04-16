import type { ReactNode } from 'react'

type DocsStepProps = {
    step?: number
    title: ReactNode
    description?: ReactNode
    action?: ReactNode
    children?: ReactNode
}

export function DocsStep({
    step,
    title,
    description,
    action,
    children,
}: DocsStepProps) {
    return (
        <div className="card border border-base-300 bg-base-200/50">
            <div className="card-body">
                <h3 className="card-title text-lg">
                    {typeof step === 'number' ? <>Étape {step} : {title}</> : title}
                </h3>
                {description ? <p className={`text-sm text-base-content/70 ${action ? 'mb-3' : ''}`}>{description}</p> : null}
                {action}
                {children}
            </div>
        </div>
    )
}