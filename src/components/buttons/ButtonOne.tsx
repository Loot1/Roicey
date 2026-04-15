import { ArrowPathIcon } from '@heroicons/react/24/outline'
import type { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react'

type ButtonOneVariant = 'primary' | 'outline' | 'danger'
type ButtonOneSize = 'md' | 'sm'

type ButtonOneProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    label: ReactNode
    loadingLabel?: ReactNode
    loading?: boolean
    variant?: ButtonOneVariant
    size?: ButtonOneSize
    Icon?: ComponentType<{ className?: string }>
}

export function ButtonOne({
    type = 'button',
    label,
    loadingLabel,
    loading = false,
    variant = 'primary',
    size = 'md',
    Icon,
    disabled,
    className,
    ...props
}: ButtonOneProps) {
    const variantClassName = variant === 'primary'
        ? 'btn-primary'
        : variant === 'danger'
            ? 'border-0 bg-error text-error-content hover:bg-error/90 disabled:bg-error/70'
            : 'btn-outline'
    const sizeClassName = size === 'sm' ? 'btn-sm' : ''

    return (
        <button
            type={type}
            className={['btn', variantClassName, sizeClassName, className].filter(Boolean).join(' ')}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
            {loading ? (loadingLabel ?? label) : label}
        </button>
    )
}