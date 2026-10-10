import type { ReactNode } from 'react'

type DocsCollapseProps = {
    /** Groups the panels: opening one closes its siblings, like a radio set. */
    name: string
    title: ReactNode
    defaultOpen?: boolean
    children: ReactNode
}

/**
 * A question that opens and closes.
 *
 * Built on `<details>` rather than the hidden radio input daisyUI also accepts,
 * for three reasons: a radio has no accessible name here, so a screen reader
 * announces the panel as an unlabelled radio button; a radio cannot be
 * unchecked, so an opened question could never be closed again; and the title
 * has to be a real heading, because these panels are the FAQ that the page's
 * FAQPage JSON-LD declares.
 */
export function DocsCollapse({
    name,
    title,
    defaultOpen = false,
    children,
}: DocsCollapseProps) {
    return (
        <details
            name={name}
            open={defaultOpen}
            className="collapse collapse-arrow border border-base-300 bg-base-200/50"
        >
            <summary className="collapse-title">
                <h3 className="font-semibold">{title}</h3>
            </summary>
            <div className="collapse-content text-sm">{children}</div>
        </details>
    )
}
