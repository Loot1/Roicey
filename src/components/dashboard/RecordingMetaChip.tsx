import type { ReactNode } from 'react'

type RecordingMetaChipProps = {
    label: string
    toneClassName: string
    children: ReactNode
    leading?: ReactNode
}

export function RecordingMetaChip({ label, toneClassName, children, leading }: RecordingMetaChipProps) {
    return (
        <div className={`inline-flex h-8 items-center gap-2 rounded-full border text-xs font-black uppercase leading-none tracking-[0.16em] ${leading ? 'pl-0 pr-3' : 'px-3'} ${toneClassName}`}>
            {leading ? <div className="inline-flex items-center">{leading}</div> : null}
            <span>{label}</span>
            <div className="inline-flex items-center gap-2 font-semibold normal-case tracking-normal text-base-content/85">
                {children}
            </div>
        </div>
    )
}
