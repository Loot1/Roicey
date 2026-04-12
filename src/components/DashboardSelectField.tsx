interface SelectOption {
    id: string
    name: string
}

interface DashboardSelectFieldProps {
    label: string
    value: string
    disabled?: boolean
    placeholder: string
    options: SelectOption[]
    onChange: (value: string) => void
}

export function DashboardSelectField({
    label,
    value,
    disabled = false,
    placeholder,
    options,
    onChange,
}: DashboardSelectFieldProps) {
    return (
        <label className="form-control flex flex-col">
            <span className="label-text mb-1">{label}</span>
            <select
                className="select select-bordered w-full"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
        </label>
    )
}
