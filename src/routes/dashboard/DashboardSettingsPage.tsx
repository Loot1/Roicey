import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router'
import { ButtonOne, DashboardAlert, DashboardPageHeader, DashboardSelectField, DashboardStateCard } from '../../components'
import { getGuildDashboardConfig, getGuildDashboardOptions, saveGuildDashboardConfig } from '../../api/discordAuth'
import type { DashboardLayoutContextValue, GuildDashboardConfigInput, GuildDashboardOptions } from '../../types'

interface ConfigFormState {
    categoryId: string
    createChannelId: string
    modChannelId: string
    defaultMaxMembers: string
    defaultRecordingDurationSeconds: string
    adminRolesIds: string[]
}

const defaultFormValues: ConfigFormState = {
    categoryId: '',
    createChannelId: '',
    modChannelId: '',
    defaultMaxMembers: '7',
    defaultRecordingDurationSeconds: '60',
    adminRolesIds: [],
}

const emptyOptions: GuildDashboardOptions = {
    categories: [],
    voiceChannels: [],
    modChannels: [],
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
                        modChannelId: config.modChannelId ?? '',
                        defaultMaxMembers: String(config.defaultMaxMembers),
                        defaultRecordingDurationSeconds: String(config.defaultRecordingDurationSeconds),
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

        const recordingDurationSeconds = Number(data.defaultRecordingDurationSeconds)
        if (!Number.isInteger(recordingDurationSeconds) || recordingDurationSeconds < 10 || recordingDurationSeconds > 180) {
            setConfigMessage("La durée d'enregistrement par défaut doit être comprise entre 10 et 180 secondes.")
            return
        }

        const payload: GuildDashboardConfigInput = {
            categoryId: data.categoryId,
            createChannelId: data.createChannelId,
            modChannelId: data.modChannelId,
            defaultMaxMembers: maxMembers,
            defaultRecordingDurationSeconds: recordingDurationSeconds,
            adminRolesIds: data.adminRolesIds,
        }

        try {
            setConfigSaving(true)
            setConfigMessage(null)
            const savedConfig = await saveGuildDashboardConfig(selectedGuildId, payload)
            form.reset({
                categoryId: savedConfig.categoryId ?? '',
                createChannelId: savedConfig.createChannelId ?? '',
                modChannelId: savedConfig.modChannelId ?? '',
                defaultMaxMembers: String(savedConfig.defaultMaxMembers),
                defaultRecordingDurationSeconds: String(savedConfig.defaultRecordingDurationSeconds),
                adminRolesIds: savedConfig.adminRolesIds,
            })
            setConfigMessage('Configuration sauvegardée avec succès.')
        } catch {
            setConfigMessage('La sauvegarde a échoué. Vérifie les valeurs puis réessaie.')
        } finally {
            setConfigSaving(false)
        }
    }

    const adminRolesIds = form.watch('adminRolesIds')
    const isDisabled = configLoading || configSaving
    const formId = 'dashboard-settings-form'

    if (selectedGuild && !selectedGuild.canAccessSettings) {
        return (
            <section className="space-y-0 bg-base-100">
                <DashboardPageHeader
                    title="Configuration"
                    description="Cette section est réservée aux administrateurs de la guilde."
                />

                <div className="px-6 py-4 lg:px-8">
                    <DashboardStateCard tone="dashed" className="text-base-content/70">
                        Tu dois avoir la permission Administrateur sur ce serveur pour modifier la configuration.
                    </DashboardStateCard>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Configuration"
                description="Ajuste les paramètres du serveur, les salons utilisés par Voicey et les rôles autorisés à gérer les salons vocaux."
                actions={<ButtonOne label="Sauvegarder" type="submit" form={formId} loadingLabel={configLoading ? 'Chargement...' : 'Sauvegarde...'} loading={isDisabled} />}
            />

            <div className="px-6 py-4 lg:px-8">
                {configMessage ? (
                    <DashboardAlert className="mb-6 py-2 shadow-sm">{configMessage}</DashboardAlert>
                ) : null}

                <form id={formId} onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
                    <div className="rounded-[1.6rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                        <div className="mb-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/45">Canaux</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">Structure vocale</h2>
                        </div>

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
                            name="modChannelId"
                            label="Salon de modération"
                            placeholder="Aucun salon"
                            options={options.modChannels}
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

                        <label className="form-control flex flex-col">
                            <span className="label-text mb-1">Durée d'enregistrement par défaut (10-180s)</span>
                            <input
                                type="number"
                                min={10}
                                max={180}
                                className="input input-bordered w-full"
                                {...form.register('defaultRecordingDurationSeconds')}
                                disabled={isDisabled}
                            />
                        </label>
                        </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                        <div className="mb-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/45">Accès</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">Rôles de modération</h2>
                        </div>

                        <div className="form-control">
                            {options.roles.length === 0 ? (
                                <div className="rounded-box border border-dashed border-base-300 p-3 text-sm text-base-content/65">
                                    Aucun rôle disponible pour ce serveur.
                                </div>
                            ) : (
                                <div className="max-h-72 w-full space-y-2 overflow-y-auto rounded-box border border-base-300 bg-base-200/30 p-3">
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
                    </div>
                </form>
            </div>
        </section>
    )
}
