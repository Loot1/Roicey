import { ArrowPathIcon, ChevronDownIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { DashboardAlert, DashboardStateCard, ResponsiveSidebarLayout } from '../../components'
import { getDashboardGuilds, getDiscordSession, startDiscordLogin } from '../../api/discordAuth'
import { useDashboardGuildSelection } from '../../hooks'
import { dashboardSidebarNavigation, VOICEY_INVITE_URL } from '../../constants'
import type { DashboardLayoutContextValue, DiscordGuild, DiscordUser } from '../../types'

export function DashboardLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const authError = useMemo(() => new URLSearchParams(location.search).get('authError'), [location.search])
    const invitedGuildId = useMemo(() => new URLSearchParams(location.search).get('guild_id'), [location.search])
    const inviteBotUrl = useMemo(() => {
        const url = new URL(VOICEY_INVITE_URL)
        url.searchParams.set('redirect_uri', `${window.location.origin}/dashboard`)
        url.searchParams.set('response_type', 'code')
        return url.toString()
    }, [])
    const { selectedGuildId, setSelectedGuildId } = useDashboardGuildSelection()
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
                            ? 'Connexion Discord annulée. Relance la connexion si tu veux accéder au dashboard.'
                            : authError
                                ? 'La connexion Discord a échoué. Réessaie pour continuer.'
                                : null)
                    }

                    if (authError) {
                        return
                    }

                    await startDiscordLogin(`${location.pathname}${location.search}`)
                    return
                }

                const dashboardGuilds = await getDashboardGuilds()

                if (!ignore) {
                    setUser(sessionUser)
                    setGuilds(dashboardGuilds)

                    // Keep the selected guild in sync with the currently accessible guild list.
                    const hasSelectedGuild = selectedGuildId
                        ? dashboardGuilds.some((guild) => guild.id === selectedGuildId)
                        : false
                    const hasInvitedGuild = invitedGuildId
                        ? dashboardGuilds.some((guild) => guild.id === invitedGuildId)
                        : false

                    if (dashboardGuilds.length === 0) {
                        setSelectedGuildId(null)
                    } else if (invitedGuildId && hasInvitedGuild) {
                        setSelectedGuildId(invitedGuildId)
                    } else if (!selectedGuildId || !hasSelectedGuild) {
                        setSelectedGuildId(dashboardGuilds[0].id)
                    }

                    setError(null)
                }
            } catch {
                if (!ignore) {
                    setError('Impossible de charger les données du dashboard pour le moment.')
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
    }, [authError, invitedGuildId, location.pathname, location.search, selectedGuildId, setSelectedGuildId])

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
            <main className="flex min-h-screen items-center justify-center bg-base-100 px-6 py-16 lg:px-10">
                <div className="flex items-center gap-4 text-center lg:text-left">
                    <ArrowPathIcon className="h-6 w-6 animate-spin text-primary" />
                    <div>
                        <h1 className="text-2xl font-black">Connexion au dashboard</h1>
                        <p className="text-base-content/70">Chargement de ta session Discord en cours...</p>
                    </div>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-base-100 px-6 py-16 lg:px-10">
                <div className="w-full max-w-xl space-y-4">
                    <DashboardAlert tone="warning" icon={<ExclamationTriangleIcon className="h-5 w-5" />}>
                        {error ?? 'Aucune session Discord active.'}
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
            </main>
        )
    }

    return (
        <ResponsiveSidebarLayout
            mobileTitle="Dashboard"
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onCloseSidebar={() => setSidebarOpen(false)}
            asideClassName="fixed inset-y-0 left-0 z-40 mt-16 w-72 overflow-y-auto border-r border-base-300 bg-base-200 lg:static lg:mt-0 lg:bg-base-200/50"
            contentWrapperClassName="py-0"
            sidebar={
                <nav className="space-y-4 p-4">
                    <div>
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">Serveur</p>
                        {guilds.length === 0 ? (
                            <div className="rounded-box border border-dashed border-base-300 px-3 py-4 text-sm text-base-content/65">
                                Aucun serveur gérable trouvé.
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
                                        <p className="truncate text-sm font-semibold">{selectedGuild?.name ?? 'Aucune guilde'}</p>
                                        {selectedGuild ? (
                                            <p className="text-xs text-base-content/60">
                                                {selectedGuild.owner ? 'Propriétaire' : 'Membre'}
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
                                                <p className="truncate text-sm font-semibold text-base-content">Ajouter Voicey</p>
                                                <p className="text-xs text-base-content/60">Inviter le bot sur un serveur</p>
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
                                                        <p className="text-xs text-base-content/60">{guild.owner ? 'Propriétaire' : 'Membre'}</p>
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
                        <p className="px-3 py-2 text-xs font-semibold uppercase text-base-content/50">Navigation</p>
                        {dashboardSidebarNavigation
                            .filter((item) => item.id !== 'settings' || selectedGuild?.canAccessSettings)
                            .map((item, index) => (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                end={item.end}
                                className={({ isActive }) => `${index > 0 ? 'mt-1 ' : ''}flex rounded-lg px-3 py-2 text-sm transition ${
                                    isActive
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'text-base-content/75 hover:bg-base-300/50'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.title}
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
                        Sélectionne un serveur dans la sidebar pour accéder à cette section du dashboard.
                    </DashboardStateCard>
                </section>
            ) : (
            <Outlet context={{ selectedGuild, selectedGuildId, user } satisfies DashboardLayoutContextValue} />
            )}
        </ResponsiveSidebarLayout>
    )
}
