import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline'
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

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Bannissement des enregistrements"
                description={`Sanctions actives pour ${selectedGuild?.name ?? 'ce serveur'}: les utilisateurs listés ici ne peuvent plus utiliser la fonctionnalité de record.`}
                actions={<ButtonOne label="Actualiser" variant="outline" Icon={ArrowPathIcon} onClick={handleRefreshRestrictions} loading={loading} disabled={!selectedGuildId} />}
                bottom={<div className="text-sm text-base-content/60">{summaryLabel}</div>}
            />

            {error ? <DashboardAlert tone="warning" className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}

            <div className="px-6 py-4 lg:px-8">
                {loading ? (
                    <DashboardStateCard className="p-6 text-base-content/70">
                        <div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>Chargement des sanctions...</span></div>
                    </DashboardStateCard>
                ) : restrictions.length === 0 ? (
                    <DashboardStateCard tone="dashed" className="text-base-content/70">Aucune sanction d'enregistrement active sur ce serveur.</DashboardStateCard>
                ) : (
                    <div className="space-y-4">
                        {restrictions.map((restriction) => (
                            <article key={restriction.id} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-black tracking-tight">{restriction.userName ?? restriction.userId} <span className="text-base-content/45">({restriction.userId})</span></h2>
                                                <span className="rounded-full border border-base-300 bg-base-200/40 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-base-content/60">#{restriction.id}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-base-content/60">Ajoutée par {restriction.executorName ?? restriction.executorId} <span className="text-base-content/45">({restriction.executorId})</span> le {formatDateTime(restriction.createdAt)} • Motif: {restriction.reason ?? 'Non renseigné'}</p>
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