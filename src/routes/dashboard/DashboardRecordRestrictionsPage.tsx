import { ArrowPathIcon, MagnifyingGlassIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router'
import { deleteGuildDashboardRecordRestriction, getGuildDashboardRecordRestrictions } from '../../api/discordAuth'
import { ButtonOne, DashboardAlert, DashboardPageHeader, DashboardStateCard } from '../../components'
import type { DashboardLayoutContextValue, DashboardRecordRestriction } from '../../types'
import { formatDateTime } from '../../utils'

export function DashboardRecordRestrictionsPage() {
    const { selectedGuild, selectedGuildId } = useOutletContext<DashboardLayoutContextValue>()
    const [restrictions, setRestrictions] = useState<DashboardRecordRestriction[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [deletingRestrictionId, setDeletingRestrictionId] = useState<number | null>(null)
    const [searchUserId, setSearchUserId] = useState('')

    const loadRestrictions = async (guildId: string) => {
        setLoading(true)
        setError(null)

        try {
            setRestrictions(await getGuildDashboardRecordRestrictions(guildId))
        } catch {
            setError('Impossible de charger les sanctions d\'enregistrement pour ce serveur.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedGuildId) {
            setRestrictions([])
            setError(null)
            return
        }

        void loadRestrictions(selectedGuildId)
    }, [selectedGuildId])

    const summaryLabel = useMemo(() => {
        const total = restrictions.length
        return `${total} sanction${total > 1 ? 's' : ''} active${total > 1 ? 's' : ''}`
    }, [restrictions])

    const filteredRestrictions = useMemo(() => {
        const normalizedSearch = searchUserId.trim()
        if (!normalizedSearch) {
            return restrictions
        }

        return restrictions.filter((restriction) => restriction.userId.includes(normalizedSearch))
    }, [restrictions, searchUserId])

    const filteredSummaryLabel = useMemo(() => {
        if (!searchUserId.trim()) {
            return summaryLabel
        }

        const total = filteredRestrictions.length
        return `${total} résultat${total > 1 ? 's' : ''} pour l'ID recherché`
    }, [filteredRestrictions.length, searchUserId, summaryLabel])

    const handleRefreshRestrictions = () => {
        if (!selectedGuildId) {
            return
        }

        void loadRestrictions(selectedGuildId)
    }

    const handleDeleteRestriction = async (restriction: DashboardRecordRestriction) => {
        if (!selectedGuildId) {
            return
        }

        try {
            setDeletingRestrictionId(restriction.id)
            setError(null)
            await deleteGuildDashboardRecordRestriction(selectedGuildId, restriction.id)
            setRestrictions((currentRestrictions) => currentRestrictions.filter((entry) => entry.id !== restriction.id))
        } catch {
            setError('Impossible de supprimer cette sanction pour le moment.')
        } finally {
            setDeletingRestrictionId(null)
        }
    }

    const getInitials = (value: string) => value
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || '??'

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Bannissement des enregistrements"
                description={`Sanctions actives pour ${selectedGuild?.name ?? 'ce serveur'}: les utilisateurs listés ici ne peuvent plus utiliser la fonctionnalité de record.`}
                actions={<ButtonOne label="Actualiser" variant="outline" Icon={ArrowPathIcon} onClick={handleRefreshRestrictions} loading={loading} disabled={!selectedGuildId} />}
                bottom={(
                    <div className="space-y-3">
                        <div className="text-sm text-base-content/60">{filteredSummaryLabel}</div>
                        <label className="flex items-center gap-3 rounded-[1.25rem] border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
                            <MagnifyingGlassIcon className="h-5 w-5 text-base-content/45" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={searchUserId}
                                onChange={(event) => setSearchUserId(event.target.value.replace(/\s+/g, ''))}
                                className="w-full bg-transparent text-sm outline-none"
                                placeholder="Rechercher un utilisateur banni par ID Discord"
                            />
                            {searchUserId ? (
                                <button
                                    type="button"
                                    onClick={() => setSearchUserId('')}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-base-300 text-base-content/55 transition hover:border-base-content/25 hover:text-base-content"
                                    aria-label="Effacer la recherche"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            ) : null}
                        </label>
                    </div>
                )}
            />

            {error ? <DashboardAlert tone="warning" className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}

            <div className="px-6 py-4 lg:px-8">
                {loading ? (
                    <DashboardStateCard className="p-6 text-base-content/70">
                        <div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>Chargement des sanctions...</span></div>
                    </DashboardStateCard>
                ) : restrictions.length === 0 ? (
                    <DashboardStateCard tone="dashed" className="text-base-content/70">Aucune sanction d'enregistrement active sur ce serveur.</DashboardStateCard>
                ) : filteredRestrictions.length === 0 ? (
                    <DashboardStateCard tone="dashed" className="text-base-content/70">Aucun bannissement ne correspond à cet ID utilisateur.</DashboardStateCard>
                ) : (
                    <div className="space-y-4">
                        {filteredRestrictions.map((restriction) => (
                            <article key={restriction.id} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="avatar">
                                            <div className="h-14 w-14 rounded-full border border-base-300 bg-base-200 text-base-content/60 shadow-sm">
                                                {restriction.userAvatarUrl ? (
                                                    <img src={restriction.userAvatarUrl} alt={`Avatar de ${restriction.userName ?? restriction.userId}`} loading="lazy" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-sm font-black uppercase tracking-[0.12em]">
                                                        {getInitials(restriction.userName ?? restriction.userId)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="min-w-0 space-y-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-xl font-black tracking-tight">{restriction.userName ?? restriction.userId} <span className="text-base-content/45">({restriction.userId})</span></h2>
                                                    {searchUserId ? <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">Correspondance</span> : null}
                                                </div>
                                                <p className="mt-1 text-sm text-base-content/60">Ajoutée par {restriction.executorName ?? restriction.executorId} <span className="text-base-content/45">({restriction.executorId})</span> le {formatDateTime(restriction.createdAt)} • Motif: {restriction.reason ?? 'Non renseigné'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <ButtonOne
                                            label="Supprimer la sanction"
                                            variant="danger"
                                            size="sm"
                                            Icon={TrashIcon}
                                            onClick={() => { void handleDeleteRestriction(restriction) }}
                                            loading={deletingRestrictionId === restriction.id}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}