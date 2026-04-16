import { ArrowDownTrayIcon, ArrowLeftIcon, ArrowPathIcon, ExclamationTriangleIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router'
import { deleteGuildRecording, downloadGuildRecordingMix, downloadGuildRecordingUserMix, getGuildDashboardRecording } from '../../api/discordAuth'
import { ButtonOne, DashboardPageHeader, RecordingSessionPlayer } from '../../components'
import type { DashboardLayoutContextValue, DashboardRecording } from '../../types'
import { canDeleteRecording, formatDateTime, formatDuration, getActualRecordingDurationSeconds, groupFilesByUser, type PreparedAudioSource } from './recordingsShared'

export function DashboardRecordingDetailPage() {
    const { selectedGuild, selectedGuildId } = useOutletContext<DashboardLayoutContextValue>()
    const params = useParams()
    const navigate = useNavigate()
    const [recording, setRecording] = useState<DashboardRecording | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preparedSources, setPreparedSources] = useState<Record<string, PreparedAudioSource>>({})
    const [audioLoadingKey, setAudioLoadingKey] = useState<string | null>(null)
    const [downloadLoadingKey, setDownloadLoadingKey] = useState<string | null>(null)
    const [globalMixDownloadLoading, setGlobalMixDownloadLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const preparedSourcesRef = useRef<Record<string, PreparedAudioSource>>({})

    const recordingId = Number.parseInt(params.recordingId ?? '', 10)

    const clearPreparedSources = () => {
        setPreparedSources((currentSources) => {
            Object.values(currentSources).forEach((entry) => {
                URL.revokeObjectURL(entry.objectUrl)
            })

            return {}
        })
    }

    useEffect(() => {
        preparedSourcesRef.current = preparedSources
    }, [preparedSources])

    useEffect(() => {
        return () => {
            Object.values(preparedSourcesRef.current).forEach((entry) => {
                URL.revokeObjectURL(entry.objectUrl)
            })
        }
    }, [])

    useEffect(() => {
        let ignore = false

        clearPreparedSources()

        if (!selectedGuildId || !Number.isInteger(recordingId) || recordingId < 1) {
            setRecording(null)
            setError(Number.isInteger(recordingId) ? null : "Identifiant d'enregistrement invalide.")
            return
        }

        void (async () => {
            try {
                setLoading(true)
                setError(null)
                const nextRecording = await getGuildDashboardRecording(selectedGuildId, recordingId)

                if (!ignore) {
                    setRecording(nextRecording)
                }
            } catch {
                if (!ignore) {
                    setRecording(null)
                    setError('Impossible de charger cet enregistrement.')
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        })()

        return () => {
            ignore = true
        }
    }, [recordingId, selectedGuildId])

    const userGroups = useMemo(() => (recording ? groupFilesByUser(recording) : []), [recording])

    const ensureUserMixBlob = async (userId: string): Promise<Blob> => {
        if (!selectedGuildId || !recording) {
            throw new Error('Aucune guilde sélectionnée.')
        }

        return downloadGuildRecordingUserMix(selectedGuildId, recording.id, userId)
    }

    const prepareAllUserSources = async () => {
        if (!recording) {
            return
        }

        const groupsToPrepare = userGroups.filter((group) => !preparedSources[`user:${recording.id}:${group.userId}`])

        if (groupsToPrepare.length === 0) {
            return
        }

        try {
            setAudioLoadingKey(`session:${recording.id}`)
            setError(null)

            const nextEntries = await Promise.all(groupsToPrepare.map(async (group) => {
                const mixedAudioBlob = await ensureUserMixBlob(group.userId)
                const objectUrl = URL.createObjectURL(mixedAudioBlob)
                const sourceKey = `user:${recording.id}:${group.userId}`

                return [sourceKey, {
                    label: `${group.username} • Demande #${recording.id}`,
                    objectUrl,
                } satisfies PreparedAudioSource] as const
            }))

            setPreparedSources((currentSources) => ({
                ...currentSources,
                ...Object.fromEntries(nextEntries),
            }))
        } catch {
            setError('La préparation des pistes audio a échoué pour cet enregistrement.')
        } finally {
            setAudioLoadingKey((currentKey) => (currentKey === `session:${recording?.id ?? 'unknown'}` ? null : currentKey))
        }
    }

    const ensureUserSource = async (userId: string): Promise<PreparedAudioSource> => {
        if (!recording) {
            throw new Error('Enregistrement introuvable.')
        }

        const sourceKey = `user:${recording.id}:${userId}`
        const cachedSource = preparedSourcesRef.current[sourceKey]
        if (cachedSource) {
            return cachedSource
        }

        const group = userGroups.find((entry) => entry.userId === userId)
        if (!group) {
            throw new Error('Participant introuvable.')
        }

        const mixedAudioBlob = await ensureUserMixBlob(userId)
        const objectUrl = URL.createObjectURL(mixedAudioBlob)
        const source = {
            label: `${group.username} • Demande #${recording.id}`,
            objectUrl,
        } satisfies PreparedAudioSource

        setPreparedSources((currentSources) => ({
            ...currentSources,
            [sourceKey]: source,
        }))

        return source
    }

    const downloadUserTrack = async (userId: string) => {
        if (!recording) {
            return
        }

        try {
            setDownloadLoadingKey(userId)
            const group = userGroups.find((entry) => entry.userId === userId)
            if (!group) {
                return
            }

            const source = await ensureUserSource(userId)
            const anchor = document.createElement('a')
            anchor.href = source.objectUrl
            anchor.download = `${group.username}-${recording.id}.ogg`
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
        } catch {
            setError('Le téléchargement de la piste participant a échoué.')
        } finally {
            setDownloadLoadingKey((currentKey) => (currentKey === userId ? null : currentKey))
        }
    }

    const downloadGlobalMix = async (mutedUserIds: string[]) => {
        if (!recording || !selectedGuildId) {
            return
        }

        try {
            setGlobalMixDownloadLoading(true)
            setError(null)

            const mixBlob = await downloadGuildRecordingMix(selectedGuildId, recording.id, mutedUserIds)
            const objectUrl = URL.createObjectURL(mixBlob)
            const anchor = document.createElement('a')
            anchor.href = objectUrl
            anchor.download = `mix-${recording.id}.ogg`
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            URL.revokeObjectURL(objectUrl)
        } catch {
            setError('Le téléchargement du mix global a échoué.')
        } finally {
            setGlobalMixDownloadLoading(false)
        }
    }

    const handleDeleteRecording = async () => {
        if (!selectedGuildId || !recording) {
            return
        }

        if (!canDeleteRecording(recording)) {
            setError('Seuls les enregistrements terminés ou échoués peuvent être supprimés.')
            return
        }

        const confirmed = window.confirm(`Supprimer définitivement la demande #${recording.id} et toutes ses pistes audio ?`)
        if (!confirmed) {
            return
        }

        try {
            setDeleteLoading(true)
            setError(null)
            await deleteGuildRecording(selectedGuildId, recording.id)
            navigate('/dashboard/recordings')
        } catch {
            setError("La suppression de l'enregistrement a échoué.")
            setDeleteLoading(false)
        }
    }

    const handlePrepareTracks = () => {
        void prepareAllUserSources()
    }

    const handleDownloadUserTrack = (userId: string) => {
        void downloadUserTrack(userId)
    }

    const handleDownloadGlobalMix = (mutedUserIds: string[]) => {
        void downloadGlobalMix(mutedUserIds)
    }

    const handleDeleteButtonClick = () => {
        void handleDeleteRecording()
    }

    if (!selectedGuild) {
        return <section className="bg-base-100 px-6 py-8 lg:px-8"><div className="rounded-[1.5rem] border border-base-300 bg-base-200/40 p-8 text-base-content/70 shadow-sm">Sélectionne un serveur dans la sidebar pour consulter ses enregistrements.</div></section>
    }

    if (loading) {
        return <section className="bg-base-100 px-6 py-8 lg:px-8"><div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-8 shadow-sm"><div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>Chargement de l'enregistrement en cours...</span></div></div></section>
    }

    if (!recording) {
        return (
            <section className="space-y-4 bg-base-100 px-6 py-8 lg:px-8">
                <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm self-start"><ArrowLeftIcon className="h-4 w-4" />Retour aux enregistrements</Link>
                <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-8 shadow-sm"><div className="flex items-start gap-3 text-base-content/70"><ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-warning" /><span>{error ?? 'Enregistrement introuvable.'}</span></div></div>
            </section>
        )
    }

    const hasApproximateSync = recording.outputFiles.some((file) => file.startOffsetMs === null)
    const actualDurationSeconds = getActualRecordingDurationSeconds(recording)
    const userSources = Object.fromEntries(userGroups.flatMap((group) => {
        const source = preparedSources[`user:${recording.id}:${group.userId}`]
        return source ? [[group.userId, source] as const] : []
    }))
    const areTracksPrepared = userGroups.length > 0 && userGroups.every((group) => Boolean(userSources[group.userId]))

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title={
                    <span className="flex w-full min-w-0 items-center justify-between gap-3 leading-none sm:inline-flex sm:w-auto sm:max-w-full sm:flex-wrap sm:justify-start">
                        <span className="block min-w-0 flex-1 truncate leading-tight sm:max-w-[32rem] sm:flex-none lg:max-w-[40rem]">{recording.channelName ?? `Salon ${recording.channelId}`}</span>
                        <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase leading-none tracking-[0.16em] text-primary">Demande #{recording.id}</span>
                    </span>
                }
                description={
                    <div className="space-y-3">
                        <p>Demandé par {recording.requesterName ?? recording.requesterId} ({recording.requesterId}) le {formatDateTime(recording.requestedAt)}.</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/60">
                            <span>Date: <span className="font-semibold text-base-content/80">{formatDateTime(recording.requestedAt)}</span></span>
                            <span>Durée: <span className="font-semibold text-base-content/80">{`${actualDurationSeconds ? formatDuration(actualDurationSeconds) : 'Indisponible'} / ${formatDuration(recording.durationSeconds)}`}</span></span>
                            <span>Participants: <span className="font-semibold text-base-content/80">{userGroups.length}</span></span>
                            <span>Segments: <span className="font-semibold text-base-content/80">{recording.outputFiles.length}</span></span>
                        </div>
                    </div>
                }
                backButton={
                    <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm"><ArrowLeftIcon className="h-4 w-4" />Retour aux enregistrements</Link>
                }
                actions={
                    <>
                        <ButtonOne
                            label={areTracksPrepared ? 'Pistes chargées' : 'Charger les pistes'}
                            variant="outline"
                            Icon={ArrowDownTrayIcon}
                            onClick={handlePrepareTracks}
                            loading={audioLoadingKey === `session:${recording.id}`}
                            disabled={areTracksPrepared || recording.outputFiles.length === 0}
                        />
                        <ButtonOne
                            label="Supprimer"
                            variant="danger"
                            Icon={TrashIcon}
                            onClick={handleDeleteButtonClick}
                            loading={deleteLoading}
                            disabled={!canDeleteRecording(recording)}
                        />
                    </>
                }
            />

            {error ? <div className="alert alert-warning mx-6 mt-6 lg:mx-8"><ExclamationTriangleIcon className="h-5 w-5" /><span>{error}</span></div> : null}

            <RecordingSessionPlayer
                recording={recording}
                userGroups={userGroups}
                sourcesByUserId={userSources}
                isPreparing={audioLoadingKey === `session:${recording.id}`}
                onPrepare={handlePrepareTracks}
                onDownloadGlobalMix={handleDownloadGlobalMix}
                onDownloadUserTrack={handleDownloadUserTrack}
                downloadLoadingGlobalMix={globalMixDownloadLoading}
                downloadLoadingUserId={downloadLoadingKey}
            />

            {hasApproximateSync ? <div className="mx-6 mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-content/80 lg:mx-8">Certains segments ne possèdent pas encore d'offset exact. La timeline reste lisible, mais la synchronisation peut être approximative sur les anciens enregistrements.</div> : null}

            {recording.errorMessage ? <div className="mx-6 mt-6 rounded-2xl border border-error/30 bg-error/8 p-4 text-sm text-error lg:mx-8"><div className="flex items-center gap-2 font-semibold"><XCircleIcon className="h-5 w-5" />Échec de traitement</div><p className="mt-2 text-error/85">{recording.errorMessage}</p></div> : null}
        </section>
    )
}