import { ArrowPathIcon, ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { ResponsiveSidebarLayout } from '../../components/layouts/ResponsiveSidebarLayout'
import { getDashboardGuilds, getDiscordSession, startDiscordLogin } from '../../api/discordAuth'
import { useDashboardGuildSelection } from '../../contexts/DashboardContext'
import type { DashboardLayoutContextValue, DiscordGuild, DiscordUser } from '../../types'

export function DashboardLayout() {
    const location = useLocation()
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
                        setError(null)
                    }

                    await startDiscordLogin(`${location.pathname}${location.search}`)
                    return
                }

                const manageableGuilds = await getDashboardGuilds()

                if (!ignore) {
                    setUser(sessionUser)
                    setGuilds(manageableGuilds)
                    
                    // If no guild is selected, select the first one
                    if (!selectedGuildId && manageableGuilds.length > 0) {
                        setSelectedGuildId(manageableGuilds[0].id)
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
    }, [location.pathname, location.search, selectedGuildId, setSelectedGuildId])

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

    if (loading || !user) {
        return (
            <main className="min-h-[70vh] bg-base-100 px-6 py-16 lg:px-10">
                <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-box border border-base-300 bg-base-200/40 p-8 shadow-lg">
                    <ArrowPathIcon className="h-6 w-6 animate-spin text-primary" />
                    <div>
                        <h1 className="text-2xl font-black">Connexion au dashboard</h1>
                        <p className="text-base-content/70">Chargement de ta session Discord en cours...</p>
                    </div>
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
            asideClassName="fixed inset-y-0 left-0 z-40 mt-16 w-72 overflow-y-auto border-r border-base-300 bg-base-200/50 lg:static lg:mt-0"
            contentWrapperClassName="mx-auto max-w-5xl px-6 py-10 lg:px-10"
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
                                    className="flex w-full items-center gap-3 rounded-lg bg-primary/20 px-3 py-3 text-left text-primary transition hover:bg-primary/25"
                                    onClick={() => setGuildPickerOpen((previous) => !previous)}
                                    aria-expanded={guildPickerOpen}
                                >
                                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/15 text-xs font-black text-primary">
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

                                    <ChevronDownIcon className={`h-4 w-4 flex-none text-primary/70 transition ${guildPickerOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {guildPickerOpen ? (
                                    <div className="space-y-2 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
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
                                                            : 'bg-base-200/40 text-base-content/75 hover:bg-base-300/50'
                                                    }`}
                                                >
                                                    <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg text-xs font-black ${
                                                        isSelected ? 'bg-primary/15 text-primary' : 'bg-base-300/40 text-base-content'
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
                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) => `flex rounded-lg px-3 py-2 text-sm transition ${
                                isActive
                                    ? 'bg-primary/20 text-primary font-semibold'
                                    : 'text-base-content/75 hover:bg-base-300/50'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            Vue d’ensemble
                        </NavLink>
                        <NavLink
                            to="/dashboard/settings"
                            className={({ isActive }) => `mt-1 flex rounded-lg px-3 py-2 text-sm transition ${
                                isActive
                                    ? 'bg-primary/20 text-primary font-semibold'
                                    : 'text-base-content/75 hover:bg-base-300/50'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            Configuration
                        </NavLink>
                    </div>
                </nav>
            }
        >
            {error ? (
                <div className="alert alert-warning mb-6">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            ) : null}

            <Outlet context={{ selectedGuild, selectedGuildId, user } satisfies DashboardLayoutContextValue} />
        </ResponsiveSidebarLayout>
    )
}
