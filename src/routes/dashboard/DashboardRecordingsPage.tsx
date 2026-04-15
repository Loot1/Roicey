import { ArrowPathIcon, EyeIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import { deleteGuildRecording, getGuildDashboardRecordings } from '../../api/discordAuth'
import { ButtonOne, DashboardPageHeader } from '../../components'
import type { DashboardLayoutContextValue, DashboardRecording } from '../../types'
import { canDeleteRecording, formatDateTime, formatDuration, getActualRecordingDurationSeconds, getRecordingStatusLabel, groupFilesByUser } from './recordingsShared'

type StatusFilter = 'ALL' | DashboardRecording['status']

function getStatusClassName(status: DashboardRecording['status']): string {
    switch (status) {
    case 'COMPLETED':
        return 'bg-success/10 text-success'
    case 'PROCESSING':
        return 'bg-info/10 text-info'
    case 'PENDING':
        return 'bg-warning/12 text-warning'
    case 'FAILED':
        return 'bg-error/10 text-error'
    }
}

export function DashboardRecordingsPage() {
    const { selectedGuild, selectedGuildId } = useOutletContext<DashboardLayoutContextValue>()
    const [recordings, setRecordings] = useState<DashboardRecording[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null)

    const loadRecordings = async (guildId: string) => {
        setLoading(true)
        setError(null)

        try {
            setRecordings(await getGuildDashboardRecordings(guildId))
        } catch {
            setError('Impossible de charger les enregistrements de ce serveur.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedGuildId) {
            setRecordings([])
            setError(null)
            return
        }

        void loadRecordings(selectedGuildId)
    }, [selectedGuildId])

    const filteredRecordings = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return recordings.filter((recording) => {
            if (statusFilter !== 'ALL' && recording.status !== statusFilter) {
                return false
            }

            if (dateFilter && recording.requestedAt.slice(0, 10) !== dateFilter) {
                return false
            }

            if (!normalizedSearch) {
                return true
            }

            const searchableText = [
                recording.id,
                recording.channelId,
                recording.channelName,
                recording.requesterId,
                recording.requesterName,
            ].join(' ').toLowerCase()

            return searchableText.includes(normalizedSearch)
        })
    }, [dateFilter, recordings, searchTerm, statusFilter])

    const summaryLabel = useMemo(() => {
        const total = filteredRecordings.length
        const available = filteredRecordings.filter((recording) => recording.status === 'COMPLETED').length

        return `${total} ligne${total > 1 ? 's' : ''} • ${available} disponible${available > 1 ? 's' : ''}`
    }, [filteredRecordings])

    const handleRefreshRecordings = () => {
        if (!selectedGuildId) {
            return
        }

        void loadRecordings(selectedGuildId)
    }

    const handleDeleteRecording = async (recording: DashboardRecording) => {
        if (!selectedGuildId || !canDeleteRecording(recording)) {
            return
        }

        const confirmed = window.confirm(`Supprimer définitivement la demande #${recording.id} et toutes ses pistes audio ?`)
        if (!confirmed) {
            return
        }

        try {
            setDeleteLoadingId(recording.id)
            setError(null)
            await deleteGuildRecording(selectedGuildId, recording.id)
            setRecordings((currentRecordings) => currentRecordings.filter((item) => item.id !== recording.id))
        } catch {
            setError('La suppression de l’enregistrement a échoué.')
        } finally {
            setDeleteLoadingId((currentId) => (currentId === recording.id ? null : currentId))
        }
    }

    if (!selectedGuild) {
        return <section className="bg-base-100 px-6 py-8 lg:px-8"><div className="rounded-[1.5rem] border border-base-300 bg-base-200/40 p-8 text-base-content/70 shadow-sm">Sélectionne un serveur dans la sidebar pour consulter ses enregistrements.</div></section>
    }

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Enregistrements"
                description={summaryLabel}
                actions={<ButtonOne label="Actualiser" variant="outline" Icon={ArrowPathIcon} onClick={handleRefreshRecordings} loading={loading} disabled={!selectedGuildId} />}
                bottom={
                    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
                    <label className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3">
                        <MagnifyingGlassIcon className="h-4 w-4 text-base-content/45" />
                        <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Salon, demandeur, ID..." />
                    </label>

                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="select rounded-2xl border-base-300 bg-base-100">
                        <option value="ALL">Tous les statuts</option>
                        <option value="COMPLETED">Disponibles</option>
                        <option value="PROCESSING">En cours</option>
                        <option value="PENDING">En attente</option>
                        <option value="FAILED">Échoués</option>
                    </select>

                    <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="input rounded-2xl border-base-300 bg-base-100" />
                    </div>
                }
            />

            {error ? <div className="alert alert-warning mx-6 mt-6 lg:mx-8"><span>{error}</span></div> : null}

            <div className="px-6 py-4 lg:px-8">
            {loading ? (
                <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>Chargement des enregistrements...</span></div>
                </div>
            ) : filteredRecordings.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-8 text-base-content/70 shadow-sm">Aucun enregistrement ne correspond au filtre actuel.</div>
            ) : (
                <div className="space-y-4">
                    {filteredRecordings.map((recording) => {
                        const usersCount = groupFilesByUser(recording).length
                        const actualDurationSeconds = getActualRecordingDurationSeconds(recording)
                        const canOpen = recording.outputFiles.length > 0

                        return (
                            <article key={recording.id} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
                                            <span className="rounded-full border border-base-300 bg-base-200/40 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-base-content/60">Demande #{recording.id}</span>
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${getStatusClassName(recording.status)}`}>{getRecordingStatusLabel(recording.status)}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight">{recording.channelName ?? 'Salon inconnu'}</h2>
                                            <p className="mt-1 text-sm text-base-content/60">Demandé par {recording.requesterName ?? recording.requesterId} le {formatDateTime(recording.requestedAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/60">
                                        <span>Durée: <span className="font-semibold text-base-content/80">{actualDurationSeconds ? formatDuration(actualDurationSeconds) : 'Indisponible'}</span></span>
                                        <span>Demandée: <span className="font-semibold text-base-content/80">{formatDuration(recording.durationSeconds)}</span></span>
                                        <span>Participants: <span className="font-semibold text-base-content/80">{usersCount}</span></span>
                                        <span>Segments: <span className="font-semibold text-base-content/80">{recording.outputFiles.length}</span></span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Link to={`/dashboard/recordings/${recording.id}`} className={`btn btn-sm ${canOpen ? 'btn-ghost border border-base-300' : 'btn-disabled'}`}>
                                            <EyeIcon className="h-4 w-4" />Détail
                                        </Link>
                                        <ButtonOne
                                            label="Supprimer"
                                            variant="danger"
                                            size="sm"
                                            Icon={TrashIcon}
                                            onClick={() => { void handleDeleteRecording(recording) }}
                                            loading={deleteLoadingId === recording.id}
                                            disabled={!canDeleteRecording(recording)}
                                        />
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
            </div>
        </section>
    )
}