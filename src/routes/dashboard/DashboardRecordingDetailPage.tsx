import { ArrowDownTrayIcon, ArrowLeftIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { downloadRecordingSourceMix, downloadRecordingSourceUserMix, resolveDashboardRecordingSource } from '../../api/discordAuth'
import { ButtonOne, DashboardAlert, DashboardPageHeader, DashboardStateCard, RecordingSessionPlayer } from '../../components'
import type { DashboardRecording, DashboardRecordingParticipant } from '../../types'
import { formatDateTime, formatDuration, getActualRecordingDurationSeconds, groupFilesByUser, type PreparedAudioSource } from '../../utils'

type RecordingMetaChipProps = {
    label: string
    toneClassName: string
    children: ReactNode
    leading?: ReactNode
}

function RecordingMetaChip({ label, toneClassName, children, leading }: RecordingMetaChipProps) {
    return (
        <div className={`inline-flex h-8 items-center gap-2 rounded-full border text-xs font-black uppercase leading-none tracking-[0.16em] ${leading ? 'pl-0 pr-3' : 'px-3'} ${toneClassName}`}>
            {leading ? <div className="inline-flex items-center">{leading}</div> : null}
            <span>{label}</span>
            <div className="inline-flex items-center gap-2 font-semibold normal-case tracking-normal text-base-content/85">
                {children}
            </div>
        </div>
    )
}

export function DashboardRecordingDetailPage() {
    const [searchParams] = useSearchParams()
    const [recording, setRecording] = useState<DashboardRecording | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preparedSources, setPreparedSources] = useState<Record<string, PreparedAudioSource>>({})
    const [audioLoadingKey, setAudioLoadingKey] = useState<string | null>(null)
    const [downloadLoadingKey, setDownloadLoadingKey] = useState<string | null>(null)
    const [globalMixDownloadLoading, setGlobalMixDownloadLoading] = useState(false)
    const preparedSourcesRef = useRef<Record<string, PreparedAudioSource>>({})
    const source = searchParams.get('source')?.trim() ?? ''

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

        if (!source) {
            setRecording(null)
            setError('Aucune source d\'archive fournie.')
            return
        }

        void (async () => {
            try {
                setLoading(true)
                setError(null)
                const nextRecording = await resolveDashboardRecordingSource(source)

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
    }, [source])

    const userGroups = useMemo(() => (recording ? groupFilesByUser(recording) : []), [recording])

    const ensureUserMixBlob = async (userId: string): Promise<Blob> => {
        if (!source || !recording) {
            throw new Error('Aucune source d\'archive disponible.')
        }

        return downloadRecordingSourceUserMix(source, userId)
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
        if (!recording || !source) {
            return
        }

        try {
            setGlobalMixDownloadLoading(true)
            setError(null)

            const mixBlob = await downloadRecordingSourceMix(source, mutedUserIds)
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

    const handlePrepareTracks = () => {
        void prepareAllUserSources()
    }

    const handleDownloadUserTrack = (userId: string) => {
        void downloadUserTrack(userId)
    }

    const handleDownloadGlobalMix = (mutedUserIds: string[]) => {
        void downloadGlobalMix(mutedUserIds)
    }

    if (loading) {
        return (
            <section className="bg-base-100 px-6 py-8 lg:px-8">
                <DashboardStateCard className="text-base-content/70">
                    <div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>Chargement de l'enregistrement en cours...</span></div>
                </DashboardStateCard>
            </section>
        )
    }

    if (!recording) {
        return (
            <section className="space-y-4 bg-base-100 px-6 py-8 lg:px-8">
                <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm self-start"><ArrowLeftIcon className="h-4 w-4" />Retour aux enregistrements</Link>
                <DashboardStateCard className="text-base-content/70"><div className="flex items-start gap-3 text-base-content/70"><ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-warning" /><span>{error ?? 'Enregistrement introuvable.'}</span></div></DashboardStateCard>
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
    const allParticipants: DashboardRecordingParticipant[] = recording.participants?.length
        ? recording.participants
        : userGroups.map((group) => ({
            userId: group.userId,
            username: group.username,
            avatarUrl: group.avatarUrl,
        }))

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title={recording.channelName ?? `Salon ${recording.channelId}`}
                description={
                    <div className="space-y-3">
                        <div className="space-y-3">
                            <p>
                                Demandé par {recording.requesterName ?? recording.requesterId} ({recording.requesterId}) le {formatDateTime(recording.requestedAt)}.
                                {' '}Raison: <span className="font-semibold text-base-content/80">{recording.reason}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <RecordingMetaChip
                                    label="Durée"
                                    toneClassName="border-[#00a86b]/80 bg-[#00a86b]/10 text-[#00a86b]"
                                >
                                    <span>{`${actualDurationSeconds ? formatDuration(actualDurationSeconds) : 'Indisponible'} / ${formatDuration(recording.durationSeconds)}`}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label="Voice room"
                                    toneClassName="border-[#1520a6]/30 bg-[#1520a6]/12 text-[#1520a6]"
                                >
                                    <span>{recording.voiceRoomId ? `#${recording.voiceRoomId}` : 'Aucune'}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label="Participants"
                                    toneClassName="border-[#5865F2]/30 bg-[#5865F2]/12 text-[#5865F2]"
                                    leading={
                                        <div className="-ml-[5px] flex -space-x-1.5">
                                            {allParticipants.slice(0, 6).map((participant) => (
                                                <div key={participant.userId} className="avatar">
                                                    <div className="h-8 w-8 rounded-full border border-[#5865F2]/30 bg-base-200 text-[9px] font-black text-base-content shadow-none">
                                                        {participant.avatarUrl ? (
                                                            <img src={participant.avatarUrl} alt={participant.username} loading="lazy" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center uppercase">
                                                                {(participant.username[0] ?? '?').toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                >
                                    <span>{allParticipants.length}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label="Segments"
                                    toneClassName="border-[#c35500]/80 bg-[#c35500]/10 text-[#c35500]"
                                >
                                    <span>{recording.outputFiles.length}</span>
                                </RecordingMetaChip>
                            </div>
                        </div>
                    </div>
                }
                backButton={
                    <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm"><ArrowLeftIcon className="h-4 w-4" />Retour aux enregistrements</Link>
                }
                actions={
                    <ButtonOne
                        label={areTracksPrepared ? 'Pistes chargées' : 'Charger les pistes'}
                        variant="outline"
                        Icon={ArrowDownTrayIcon}
                        onClick={handlePrepareTracks}
                        loading={audioLoadingKey === `session:${recording.id}`}
                        disabled={areTracksPrepared || recording.outputFiles.length === 0}
                    />
                }
            />

            {error ? <DashboardAlert tone="warning" icon={<ExclamationTriangleIcon className="h-5 w-5" />} className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}

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