import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useBlocker, useOutletContext } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ButtonOne } from '../../components/ButtonOne'
import { DashboardAlert, DashboardPageHeader, DashboardSelectField, DashboardStateCard } from '../../components/dashboard'
import { getGuildDashboardConfig, getGuildDashboardOptions, saveGuildDashboardConfig } from '../../api/discordAuth'
import type { DashboardLayoutContextValue, GuildDashboardConfigInput, GuildDashboardOptions } from '../../types'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useLocalizedPath } from '../../hooks/useLocale'

interface ConfigFormState {
    categoryId: string
    createChannelId: string
    logChannelId: string
    defaultMaxMembers: string
    defaultRecordingDurationSeconds: string
    adminRolesIds: string[]
}

const defaultFormValues: ConfigFormState = {
    categoryId: '',
    createChannelId: '',
    logChannelId: '',
    defaultMaxMembers: '7',
    defaultRecordingDurationSeconds: '60',
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
    const { t } = useTranslation()
    const localizedPath = useLocalizedPath()
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
                        defaultRecordingDurationSeconds: String(config.defaultRecordingDurationSeconds),
                        adminRolesIds: config.adminRolesIds,
                    })
                    setOptions(guildOptions)
                }
            } catch {
                if (!ignore) {
                    setConfigMessage(t('dashboard.settings.loadError'))
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
            setConfigMessage(t('dashboard.settings.invalidMaxMembers'))
            return
        }

        const recordingDurationSeconds = Number(data.defaultRecordingDurationSeconds)
        if (!Number.isInteger(recordingDurationSeconds) || recordingDurationSeconds < 10 || recordingDurationSeconds > 180) {
            setConfigMessage(t('dashboard.settings.invalidDuration'))
            return
        }

        const payload: GuildDashboardConfigInput = {
            categoryId: data.categoryId,
            createChannelId: data.createChannelId,
            logChannelId: data.logChannelId,
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
                logChannelId: savedConfig.logChannelId ?? '',
                defaultMaxMembers: String(savedConfig.defaultMaxMembers),
                defaultRecordingDurationSeconds: String(savedConfig.defaultRecordingDurationSeconds),
                adminRolesIds: savedConfig.adminRolesIds,
            })
            setConfigMessage(t('dashboard.settings.saveSuccess'))
        } catch {
            setConfigMessage(t('dashboard.settings.saveError'))
        } finally {
            setConfigSaving(false)
        }
    }

    const adminRolesIds = form.watch('adminRolesIds')
    const isDisabled = configLoading || configSaving
    const formId = 'dashboard-settings-form'
    const isDirty = form.formState.isDirty

    const blocker = useBlocker(isDirty)

    if (selectedGuild && !selectedGuild.canAccessSettings) {
        return (
            <section className="space-y-0 bg-base-100">
                <DashboardPageHeader
                    title={t('dashboard.settings.title')}
                    description={t('dashboard.settings.noAccessDesc')}
                />

                <div className="px-6 py-4 lg:px-8">
                    <DashboardStateCard tone="dashed" className="text-base-content/70">
                        {t('dashboard.settings.noAccessText')}
                    </DashboardStateCard>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-0 bg-base-100">
            {blocker.state === 'blocked' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-[1.6rem] border border-base-300 bg-base-100 p-6 shadow-xl">
                        <h2 className="text-lg font-black tracking-tight">{t('dashboard.settings.unsavedTitle')}</h2>
                        <p className="mt-2 text-sm text-base-content/70">{t('dashboard.settings.unsavedMessage')}</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button className="btn btn-ghost btn-sm" onClick={() => blocker.reset()}>
                                {t('dashboard.settings.unsavedCancel')}
                            </button>
                            <button className="btn btn-error btn-sm" onClick={() => blocker.proceed()}>
                                {t('dashboard.settings.unsavedConfirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DashboardPageHeader
                title={t('dashboard.settings.title')}
                description={t('dashboard.settings.description')}
                actions={<ButtonOne label={t('dashboard.settings.saveButton')} type="submit" form={formId} loadingLabel={configLoading ? t('dashboard.settings.loadingLabel') : t('dashboard.settings.savingLabel')} loading={isDisabled} />}
            />

            <DashboardAlert tone="info" icon={<InformationCircleIcon className="h-5 w-5" />} className="alert-outline mx-6 mt-6 lg:mx-8">
                <div className="grid w-full gap-4 md:grid-cols-2 md:items-center">
                    <p>{t('dashboard.settings.docsText')}</p>
                    <Link to={localizedPath('/docs/settings')} className="btn btn-primary btn-sm w-fit justify-self-start md:justify-self-end">
                        {t('dashboard.settings.docsButton')}
                    </Link>
                </div>
            </DashboardAlert>

            <div className="px-6 py-8 lg:px-8">
                {configMessage ? (
                    <DashboardAlert className="mb-6 py-2 shadow-sm">{configMessage}</DashboardAlert>
                ) : null}

                <form id={formId} onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
                    <div className="rounded-[1.6rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                        <div className="mb-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/45">{t('dashboard.settings.channelsSectionBadge')}</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">{t('dashboard.settings.channelsSection')}</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                        <DashboardSelectField
                            control={form.control}
                            name="categoryId"
                            label={t('dashboard.settings.categoryLabel')}
                            placeholder={t('dashboard.settings.categoryPlaceholder')}
                            options={options.categories}
                            disabled={isDisabled}
                        />

                        <DashboardSelectField
                            control={form.control}
                            name="createChannelId"
                            label={t('dashboard.settings.createChannelLabel')}
                            placeholder={t('dashboard.settings.createChannelPlaceholder')}
                            options={options.voiceChannels}
                            disabled={isDisabled}
                        />

                        <DashboardSelectField
                            control={form.control}
                            name="logChannelId"
                            label={t('dashboard.settings.logChannelLabel')}
                            placeholder={t('dashboard.settings.logChannelPlaceholder')}
                            options={options.logChannels}
                            disabled={isDisabled}
                        />

                        <label className="form-control flex flex-col">
                            <span className="label-text mb-1">{t('dashboard.settings.maxMembersLabel')}</span>
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
                            <span className="label-text mb-1">{t('dashboard.settings.durationLabel')}</span>
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
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-base-content/45">{t('dashboard.settings.rolesSectionBadge')}</p>
                            <h2 className="mt-1 text-2xl font-black tracking-tight">{t('dashboard.settings.rolesSection')}</h2>
                        </div>

                        <div className="form-control">
                            {options.roles.length === 0 ? (
                                <div className="rounded-box border border-dashed border-base-300 p-3 text-sm text-base-content/65">
                                    {t('dashboard.settings.noRoles')}
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
                                            <span
                                                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                                style={{ backgroundColor: role.color !== '#000000' ? role.color : 'transparent', border: role.color !== '#000000' ? 'none' : '1.5px solid currentColor', opacity: role.color !== '#000000' ? 1 : 0.25 }}
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

export default DashboardSettingsPage
