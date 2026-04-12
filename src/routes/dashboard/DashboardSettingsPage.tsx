import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { DashboardSelectField } from '../../components/DashboardSelectField'
import { emptyConfigForm, type ConfigFormState } from '../../components/dashboard'
import {
    getGuildDashboardConfig,
    getGuildDashboardOptions,
    saveGuildDashboardConfig,
    type GuildDashboardConfigInput,
    type GuildDashboardOptions,
} from '../../api/discordAuth'
import type { DashboardLayoutContextValue } from './DashboardLayout'

const emptyOptions: GuildDashboardOptions = {
    categories: [],
    voiceChannels: [],
    logChannels: [],
    roles: [],
}

export function DashboardSettingsPage() {
    const { selectedGuild, selectedGuildId } = useOutletContext<DashboardLayoutContextValue>()
    const [configForm, setConfigForm] = useState<ConfigFormState>(emptyConfigForm)
    const [options, setOptions] = useState<GuildDashboardOptions>(emptyOptions)
    const [configLoading, setConfigLoading] = useState(false)
    const [configSaving, setConfigSaving] = useState(false)
    const [configMessage, setConfigMessage] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false

        const loadGuildData = async () => {
            if (!selectedGuildId) {
                setConfigForm(emptyConfigForm)
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
                    setConfigForm({
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
    }, [selectedGuildId])

    const setField = (field: keyof ConfigFormState, value: string) => {
        setConfigForm((previous) => ({ ...previous, [field]: value }))
    }

    const toggleRole = (roleId: string) => {
        setConfigForm((previous) => {
            const hasRole = previous.adminRolesIds.includes(roleId)
            return {
                ...previous,
                adminRolesIds: hasRole
                    ? previous.adminRolesIds.filter((id) => id !== roleId)
                    : [...previous.adminRolesIds, roleId],
            }
        })
    }

    const handleSaveConfig = async () => {
        if (!selectedGuildId) {
            return
        }

        const maxMembers = Number(configForm.defaultMaxMembers)
        if (!Number.isInteger(maxMembers) || maxMembers < 1 || maxMembers > 99) {
            setConfigMessage('Le nombre de places par défaut doit être compris entre 1 et 99.')
            return
        }

        const payload: GuildDashboardConfigInput = {
            categoryId: configForm.categoryId,
            createChannelId: configForm.createChannelId,
            logChannelId: configForm.logChannelId,
            defaultMaxMembers: maxMembers,
            adminRolesIds: configForm.adminRolesIds,
        }

        try {
            setConfigSaving(true)
            setConfigMessage(null)
            const savedConfig = await saveGuildDashboardConfig(selectedGuildId, payload)
            setConfigForm({
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

    return (
        <section className="space-y-6">
            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
                {configMessage ? (
                    <div className="alert alert-info mb-4 py-2">
                        <span className="text-sm">{configMessage}</span>
                    </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                    <DashboardSelectField
                        label="Catégorie vocale"
                        value={configForm.categoryId}
                        placeholder="Aucune catégorie"
                        options={options.categories}
                        onChange={(value) => setField('categoryId', value)}
                        disabled={configLoading || configSaving}
                    />

                    <DashboardSelectField
                        label="Salon créateur"
                        value={configForm.createChannelId}
                        placeholder="Aucun salon"
                        options={options.voiceChannels}
                        onChange={(value) => setField('createChannelId', value)}
                        disabled={configLoading || configSaving}
                    />

                    <DashboardSelectField
                        label="Salon de logs"
                        value={configForm.logChannelId}
                        placeholder="Aucun salon"
                        options={options.logChannels}
                        onChange={(value) => setField('logChannelId', value)}
                        disabled={configLoading || configSaving}
                    />

                    <label className="form-control flex flex-col">
                        <span className="label-text mb-1">Limite par défaut (1-99)</span>
                        <input
                            type="number"
                            min={1}
                            max={99}
                            className="input input-bordered w-full"
                            value={configForm.defaultMaxMembers}
                            onChange={(event) => setField('defaultMaxMembers', event.target.value)}
                            disabled={configLoading || configSaving}
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
                        <div className="max-h-56 w-full space-y-2 overflow-y-auto rounded-box border border-base-300 bg-base-200/30 p-3 mt-1">
                            {options.roles.map((role) => (
                                <label key={role.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-base-300/40">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={configForm.adminRolesIds.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        disabled={configLoading || configSaving}
                                    />
                                    <span className="text-sm">{role.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => void handleSaveConfig()}
                        disabled={configLoading || configSaving}
                    >
                        {configLoading ? 'Chargement...' : configSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        </section>
    )
}
