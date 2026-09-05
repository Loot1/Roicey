import { ArrowPathIcon, ChevronDownIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DashboardAlert, DashboardStateCard } from '../dashboard'
import { ResponsiveSidebarLayout } from './ResponsiveSidebarLayout'
import { getDashboardGuilds, getDiscordSession, startDiscordLogin } from '../../api/discordAuth'
import { useDashboardGuildSelection } from '../../hooks/useDashboardGuildSelection'
import { DASHBOARD_SIDEBAR_NAVIGATION, VOICEY_INVITE_URL } from '../../config'
import { SITE_URL } from '../../config/seoRoutes'
import type { DashboardLayoutContextValue, DiscordGuild, DiscordUser } from '../../types'

export function DashboardLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const authError = useMemo(() => new URLSearchParams(location.search).get('authError'), [location.search])
    const invitedGuildId = useMemo(() => new URLSearchParams(location.search).get('guild_id'), [location.search])
    const inviteBotUrl = useMemo(() => {
        const url = new URL(VOICEY_INVITE_URL)
        const origin = typeof window === 'undefined' ? SITE_URL : window.location.origin
        url.searchParams.set('redirect_uri', `${origin}/dashboard`)
        url.searchParams.set('response_type', 'code')
        return url.toString()
    }, [])
    const { selectedGuildId, setSelectedGuildId } = useDashboardGuildSelection()
    const selectedGuildIdRef = useRef(selectedGuildId)
    const locationRef = useRef(location)

    useEffect(() => {
        selectedGuildIdRef.current = selectedGuildId
    }, [selectedGuildId])

    useEffect(() => {
        locationRef.current = location
    }, [location])
    const [user, setUser] = useState<DiscordUser | null>(null)
    const [guilds, setGuilds] = useState<DiscordGuild[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [guildPickerOpen, setGuildPickerOpen] = useState(false)
    const guildPickerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let ignore = false

        const loadDashboard = async () => {
            try {
                setLoading(true)
                const sessionUser = await getDiscordSession()

                if (!sessionUser) {
                    if (!ignore) {
                        setUser(null)
                        setGuilds([])
                        setSelectedGuildId(null)
                        setError(authError === 'access_denied'
                            ? t('dashboard.layout.authCancelled')
                            : authError
                                ? t('dashboard.layout.authError')
                                : null)
                    }

                    if (authError) {
                        return
                    }

                    await startDiscordLogin(`${locationRef.current.pathname}${locationRef.current.search}`)
                    return
                }

                const dashboardGuilds = await getDashboardGuilds()

                if (!ignore) {
                    setUser(sessionUser)
                    setGuilds(dashboardGuilds)

                    // Keep the selected guild in sync with the currently accessible guild list.
                    const hasSelectedGuild = selectedGuildIdRef.current
                        ? dashboardGuilds.some((guild) => guild.id === selectedGuildIdRef.current)
                        : false
                    const hasInvitedGuild = invitedGuildId
                        ? dashboardGuilds.some((guild) => guild.id === invitedGuildId)
                        : false

                    if (dashboardGuilds.length === 0) {
                        setSelectedGuildId(null)
                    } else if (invitedGuildId && hasInvitedGuild) {
                        setSelectedGuildId(invitedGuildId)
                    } else if (!selectedGuildIdRef.current || !hasSelectedGuild) {
                        setSelectedGuildId(dashboardGuilds[0].id)
                    }

                    setError(null)
                }
            } catch {
                if (!ignore) {
                    setError(t('dashboard.layout.loadError'))
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        void loadDashboard()

        return () => {
            ignore = true
        }
    }, [authError, invitedGuildId, setSelectedGuildId])

    useEffect(() => {
        if (!invitedGuildId || loading) {
            return
        }

        const hasGuildQuery = new URLSearchParams(location.search).has('guild_id')
        if (!hasGuildQuery) {
            return
        }

        navigate('/dashboard', { replace: true })
    }, [invitedGuildId, loading, location.search, navigate])

    const selectedGuild = useMemo(() => guilds.find((guild) => guild.id === selectedGuildId) ?? null, [guilds, selectedGuildId])

    useEffect(() => {
        if (!guildPickerOpen) {
            return
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (guildPickerRef.current && !guildPickerRef.current.contains(event.target as Node)) {
                setGuildPickerOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setGuildPickerOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [guildPickerOpen])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-100 px-6 py-16 lg:px-10">
                <div className="flex items-center gap-4 text-center lg:text-left">
                    <ArrowPathIcon className="h-6 w-6 animate-spin text-primary" />
                    <div>
                        <h1 className="text-2xl font-black">{t('dashboard.layout.loadingTitle')}</h1>
                        <p className="text-base-content/70">{t('dashboard.layout.loadingDesc')}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-100 px-6 py-16 lg:px-10">
                <div className="w-full max-w-xl space-y-4">
                    <DashboardAlert tone="warning" icon={<ExclamationTriangleIcon className="h-5 w-5" />}>
                        {error ?? t('dashboard.layout.noSession')}
                    </DashboardAlert>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            void startDiscordLogin(`${location.pathname}`)
                        }}
                    >
                        Reconnecter Discord
                    </button>
                </div>
            </div>
        )
    }

    return (
        <ResponsiveSidebarLayout
            mobileTitle={t('dashboard.layout.mobileTitle')}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCloseSidebar={() => setSidebarOpen(false)}
            asideClassName="fixed inset-y-0 left-0 z-40 mt-16 w-72 overflow-y-auto border-r border-base-300 bg-base-200 lg:static lg:mt-0 lg:bg-base-200/50"
            contentWrapperClassName="py-0"
            sidebar={
                <nav className="space-y-4 p-4">
                    <div>
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">{t('dashboard.layout.serverSection')}</p>
                        {guilds.length === 0 ? (
                            <div className="rounded-box border border-dashed border-base-300 px-3 py-4 text-sm text-base-content/65">
                                    {t('dashboard.layout.noServer')}
                            </div>
                        ) : (
                            <div ref={guildPickerRef} className="space-y-2">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-lg border border-base-300 bg-base-100 px-3 py-3 text-left text-base-content transition hover:border-base-300 hover:bg-base-100"
                                    onClick={() => setGuildPickerOpen((previous) => !previous)}
                                    aria-expanded={guildPickerOpen}
                                >
                                    <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg text-xs font-black text-primary ${selectedGuild?.iconUrl ? '' : 'bg-primary/15'}`}>
                                        {selectedGuild?.iconUrl ? (
                                            <img src={selectedGuild.iconUrl} alt={selectedGuild.name} className="h-10 w-10 rounded-lg object-cover" />
                                        ) : (
                                            selectedGuild?.name.slice(0, 2).toUpperCase() ?? '??'
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{selectedGuild?.name ?? t('dashboard.layout.noGuild')}</p>
                                        {selectedGuild ? (
                                            <p className="text-xs text-base-content/60">
                                                    {selectedGuild.owner ? t('dashboard.layout.roleOwner') : t('dashboard.layout.roleMember')}
                                            </p>
                                        ) : null}
                                    </div>

                                    <ChevronDownIcon className={`h-4 w-4 flex-none text-base-content/60 transition ${guildPickerOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {guildPickerOpen ? (
                                    <div className="space-y-2 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                                        <a
                                            href={inviteBotUrl}
                                            className="flex w-full items-center gap-3 rounded-lg bg-base-100 px-3 py-3 text-left text-base-content/75 transition hover:bg-base-300/50"
                                        >
                                            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-base-300/40 text-base-content">
                                                <PlusIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-base-content">{t('dashboard.layout.addVoicey')}</p>
                                                <p className="text-xs text-base-content/60">{t('dashboard.layout.addVoiceyDesc')}</p>
                                            </div>
                                        </a>
                                        {guilds.map((guild) => {
                                            const isSelected = guild.id === selectedGuildId

                                            return (
                                                <button
                                                    key={guild.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedGuildId(guild.id)
                                                        setGuildPickerOpen(false)
                                                        setSidebarOpen(false)
                                                    }}
                                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                                                        isSelected
                                                            ? 'bg-primary/20 text-primary'
                                                            : 'bg-base-100 text-base-content/75 hover:bg-base-300/50'
                                                    }`}
                                                >
                                                    <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg text-xs font-black ${
                                                        guild.iconUrl
                                                            ? isSelected
                                                                ? 'text-base-content'
                                                                : 'text-base-content'
                                                            : isSelected
                                                                ? 'bg-base-200 text-base-content'
                                                                : 'bg-base-300/40 text-base-content'
                                                    }`}>
                                                        {guild.iconUrl ? (
                                                            <img src={guild.iconUrl} alt={guild.name} className="h-10 w-10 rounded-lg object-cover" />
                                                        ) : (
                                                            guild.name.slice(0, 2).toUpperCase()
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold">{guild.name}</p>
                                                        <p className="text-xs text-base-content/60">{guild.owner ? t('dashboard.layout.roleOwner') : t('dashboard.layout.roleMember')}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">{t('dashboard.layout.navSection')}</p>
                        {DASHBOARD_SIDEBAR_NAVIGATION
                            .filter((item) => item.id !== 'settings' || selectedGuild?.canAccessSettings)
                            .map((item, index) => (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                end={'end' in item ? item.end : undefined}
                                className={({ isActive }) => `${index > 0 ? 'mt-1 ' : ''}flex rounded-lg px-3 py-2 text-sm transition ${
                                    isActive
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'text-base-content/75 hover:bg-base-300/50'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {t(item.title)}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            }
        >
            {error ? (
                <DashboardAlert tone="warning" icon={<ExclamationTriangleIcon className="h-5 w-5" />} className="mb-6">
                    {error}
                </DashboardAlert>
            ) : null}

            {!selectedGuild ? (
                <section className="bg-base-100 px-6 py-8 lg:px-8">
                    <DashboardStateCard tone="muted" className="text-base-content/70">
                        {t('dashboard.layout.selectServer')}
                    </DashboardStateCard>
                </section>
            ) : (
            <Outlet context={{ selectedGuild, selectedGuildId, user } satisfies DashboardLayoutContextValue} />
            )}
        </ResponsiveSidebarLayout>
    )
}

export default DashboardLayout
