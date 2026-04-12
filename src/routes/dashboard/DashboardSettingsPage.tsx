import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router'
import { DashboardSelectField } from '../../components/DashboardSelectField'
import { getGuildDashboardConfig, getGuildDashboardOptions, saveGuildDashboardConfig } from '../../api/discordAuth'
import type { DashboardLayoutContextValue, GuildDashboardConfigInput, GuildDashboardOptions } from '../../types'

interface ConfigFormState {
    categoryId: string
    createChannelId: string
    logChannelId: string
    defaultMaxMembers: string
    adminRolesIds: string[]
}

const defaultFormValues: ConfigFormState = {
    categoryId: '',
    createChannelId: '',
    logChannelId: '',
    defaultMaxMembers: '7',
    adminRolesIds: [],
}

const emptyOptions: GuildDashboardOptions = {
    categories: [],
    voiceChannels: [],
    logChannels: [],
    roles: [],
}

export function DashboardSettingsPage() {
    const { selectedGuild, selectedGuildId } = useOutletContext<DashboardLayoutContextValue>()
    const form = useForm<ConfigFormState>({
        defaultValues: defaultFormValues,
        mode: 'onChange',
    })
    const [options, setOptions] = useState<GuildDashboardOptions>(emptyOptions)
    const [configLoading, setConfigLoading] = useState(false)
    const [configSaving, setConfigSaving] = useState(false)
    const [configMessage, setConfigMessage] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false

        const loadGuildData = async () => {
            if (!selectedGuildId) {
                form.reset(defaultFormValues)
                setOptions(emptyOptions)
                return
            }

            try {
                setConfigLoading(true)
                setConfigMessage(null)
                const [config, guildOptions] = await Promise.all([
                    getGuildDashboardConfig(selectedGuildId),
                    getGuildDashboardOptions(selectedGuildId),
                ])

                if (!ignore) {
                    form.reset({
                        categoryId: config.categoryId ?? '',
                        createChannelId: config.createChannelId ?? '',
                        logChannelId: config.logChannelId ?? '',
                        defaultMaxMembers: String(config.defaultMaxMembers),
                        adminRolesIds: config.adminRolesIds,
                    })
                    setOptions(guildOptions)
                }
            } catch {
                if (!ignore) {
                    setConfigMessage('Impossible de charger la configuration de ce serveur.')
                }
            } finally {
                if (!ignore) {
                    setConfigLoading(false)
                }
            }
        }

        void loadGuildData()

        return () => {
            ignore = true
        }
    }, [selectedGuildId, form])

    const toggleRole = (roleId: string) => {
        const currentRoles = form.getValues('adminRolesIds')
        const hasRole = currentRoles.includes(roleId)
        const updatedRoles = hasRole
            ? currentRoles.filter((id) => id !== roleId)
            : [...currentRoles, roleId]

        form.setValue('adminRolesIds', updatedRoles, { shouldValidate: true, shouldDirty: true })
    }

    const handleSaveConfig = async (data: ConfigFormState) => {
        if (!selectedGuildId) {
            return
        }

        const maxMembers = Number(data.defaultMaxMembers)
        if (!Number.isInteger(maxMembers) || maxMembers < 1 || maxMembers > 99) {
            setConfigMessage('Le nombre de places par défaut doit être compris entre 1 et 99.')
            return
        }

        const payload: GuildDashboardConfigInput = {
            categoryId: data.categoryId,
            createChannelId: data.createChannelId,
            logChannelId: data.logChannelId,
            defaultMaxMembers: maxMembers,
            adminRolesIds: data.adminRolesIds,
        }

        try {
            setConfigSaving(true)
            setConfigMessage(null)
            const savedConfig = await saveGuildDashboardConfig(selectedGuildId, payload)
            form.reset({
                categoryId: savedConfig.categoryId ?? '',
                createChannelId: savedConfig.createChannelId ?? '',
                logChannelId: savedConfig.logChannelId ?? '',
                defaultMaxMembers: String(savedConfig.defaultMaxMembers),
                adminRolesIds: savedConfig.adminRolesIds,
            })
            setConfigMessage('Configuration sauvegardée avec succès.')
        } catch {
            setConfigMessage('La sauvegarde a échoué. Vérifie les valeurs puis réessaie.')
        } finally {
            setConfigSaving(false)
        }
    }

    if (!selectedGuild) {
        return (
            <div className="rounded-box border border-base-300 bg-base-200/40 p-8 text-base-content/70">
                Sélectionne un serveur dans la sidebar pour afficher sa configuration.
            </div>
        )
    }

    const adminRolesIds = form.watch('adminRolesIds')
    const isDisabled = configLoading || configSaving

    return (
        <section className="space-y-6">
            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
                {configMessage ? (
                    <div className="alert alert-info mb-4 py-2">
                        <span className="text-sm">{configMessage}</span>
                    </div>
                ) : null}

                <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <DashboardSelectField
                            control={form.control}
                            name="categoryId"
                            label="Catégorie vocale"
                            placeholder="Aucune catégorie"
                            options={options.categories}
                            disabled={isDisabled}
                        />

                        <DashboardSelectField
                            control={form.control}
                            name="createChannelId"
                            label="Salon créateur"
                            placeholder="Aucun salon"
                            options={options.voiceChannels}
                            disabled={isDisabled}
                        />

                        <DashboardSelectField
                            control={form.control}
                            name="logChannelId"
                            label="Salon de logs"
                            placeholder="Aucun salon"
                            options={options.logChannels}
                            disabled={isDisabled}
                        />

                        <label className="form-control flex flex-col">
                            <span className="label-text mb-1">Limite par défaut (1-99)</span>
                            <input
                                type="number"
                                min={1}
                                max={99}
                                className="input input-bordered w-full"
                                {...form.register('defaultMaxMembers')}
                                disabled={isDisabled}
                            />
                        </label>
                    </div>

                    <div className="form-control mt-5">
                        <span className="label-text mb-1">Rôles administrateurs</span>
                        {options.roles.length === 0 ? (
                            <div className="rounded-box border border-dashed border-base-300 p-3 text-sm text-base-content/65">
                                Aucun rôle disponible pour ce serveur.
                            </div>
                        ) : (
                            <div className="mt-1 max-h-56 w-full space-y-2 overflow-y-auto rounded-box border border-base-300 bg-base-200/30 p-3">
                                {options.roles.map((role) => (
                                    <label key={role.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-base-300/40">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={adminRolesIds.includes(role.id)}
                                            onChange={() => toggleRole(role.id)}
                                            disabled={isDisabled}
                                        />
                                        <span className="text-sm">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isDisabled}
                        >
                            {configLoading ? 'Chargement...' : configSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
