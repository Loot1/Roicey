import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'

interface SelectOption {
    id: string
    name: string
}

interface DashboardSelectFieldProps<TFieldValues extends FieldValues> {
    label: string
    control: Control<TFieldValues>
    name: Path<TFieldValues>
    disabled?: boolean
    placeholder: string
    options: SelectOption[]
}

export function DashboardSelectField<TFieldValues extends FieldValues>({
    label,
    control,
    name,
    disabled = false,
    placeholder,
    options,
}: DashboardSelectFieldProps<TFieldValues>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <label className="form-control flex flex-col">
                    <span className="label-text mb-1">{label}</span>
                    <select
                        className="select select-bordered w-full"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                    >
                        <option value="">{placeholder}</option>
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </label>
            )}
        />
    )
}
