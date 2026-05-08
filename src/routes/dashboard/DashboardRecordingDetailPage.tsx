import { ArrowDownTrayIcon, ArrowLeftIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import type { TFunction } from 'i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { downloadRecordingSourceMix, downloadRecordingSourceUserMix, resolveDashboardRecordingSource } from '../../api/discordAuth'
import { ButtonOne } from '../../components/ButtonOne'
import { DashboardAlert, DashboardPageHeader, DashboardStateCard, RecordingMetaChip, RecordingSessionTracksPlayer } from '../../components/dashboard'
import type { DashboardRecording, DashboardRecordingParticipant, RecordingStopReason } from '../../types'
import { formatDateTime, formatDuration, getActualRecordingDurationSeconds, groupFilesByUser, type PreparedAudioSource } from '../../utils'

function formatStopReason(reason: RecordingStopReason | null, t: TFunction): string {
    switch (reason) {
        case 'completed': return t('dashboard.recordingDetail.stopCompleted')
        case 'manual': return t('dashboard.recordingDetail.stopManual')
        case 'size_limit': return t('dashboard.recordingDetail.stopSizeLimit')
        case 'disconnected': return t('dashboard.recordingDetail.stopDisconnected')
        default: return t('dashboard.recordingDetail.stopCompleted')
    }
}

function stopReasonToneClassName(reason: RecordingStopReason | null): string {
    switch (reason) {
        case 'completed': return 'border-[#00a86b]/80 bg-[#00a86b]/10 text-[#00a86b]'
        case 'manual': return 'border-[#f59e0b]/80 bg-[#f59e0b]/10 text-[#b45309]'
        case 'size_limit': return 'border-[#ef4444]/70 bg-[#ef4444]/10 text-[#b91c1c]'
        case 'disconnected': return 'border-[#ef4444]/70 bg-[#ef4444]/10 text-[#b91c1c]'
        default: return 'border-[#00a86b]/80 bg-[#00a86b]/10 text-[#00a86b]'
    }
}

export function DashboardRecordingDetailPage() {
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
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
            setError(t('dashboard.recordingDetail.noSource'))
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
                    setError(t('dashboard.recordingDetail.loadError'))
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

        const createdUrls: string[] = []

        try {
            setAudioLoadingKey(`session:${recording.id}`)
            setError(null)

            const nextEntries = await Promise.all(groupsToPrepare.map(async (group) => {
                const mixedAudioBlob = await ensureUserMixBlob(group.userId)
                const objectUrl = URL.createObjectURL(mixedAudioBlob)
                createdUrls.push(objectUrl)
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
            createdUrls.forEach((url) => URL.revokeObjectURL(url))
            setError(t('dashboard.recordingDetail.prepareFailed'))
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
            setError(t('dashboard.recordingDetail.downloadTrackFailed'))
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
            setError(t('dashboard.recordingDetail.downloadMixFailed'))
        } finally {
            setGlobalMixDownloadLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="bg-base-100 px-6 py-8 lg:px-8">
                <DashboardStateCard className="text-base-content/70">
                    <div className="flex items-center gap-3 text-base-content/70"><ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /><span>{t('dashboard.recordingDetail.loading')}</span></div>
                </DashboardStateCard>
            </section>
        )
    }

    if (!recording) {
        return (
            <section className="space-y-4 bg-base-100 px-6 py-8 lg:px-8">
                <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm self-start"><ArrowLeftIcon className="h-4 w-4" />{t('dashboard.recordingDetail.backButton')}</Link>
                <DashboardStateCard className="text-base-content/70"><div className="flex items-start gap-3 text-base-content/70"><ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-warning" /><span>{error ?? t('dashboard.recordingDetail.notFound')}</span></div></DashboardStateCard>
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
                title={recording.channelName ?? t('dashboard.recordingDetail.channelFallback', { id: recording.channelId })}
                description={
                    <div className="space-y-3">
                        <div className="space-y-3">
                            <p>
                                {t('dashboard.recordingDetail.requestedBy', { requester: recording.requesterName ?? recording.requesterId, requesterId: recording.requesterId, date: formatDateTime(recording.requestedAt) })}
                                {' '}{t('dashboard.recordingDetail.reason')}: <span className="font-semibold text-base-content/80">{recording.reason}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <RecordingMetaChip
                                    label={t('dashboard.recordingDetail.chipDuration')}
                                    toneClassName="border-[#00a86b]/80 bg-[#00a86b]/10 text-[#00a86b]"
                                >
                                    <span>{`${actualDurationSeconds ? formatDuration(actualDurationSeconds) : t('dashboard.recordingDetail.durationUnavailable')} / ${formatDuration(recording.durationSeconds)}`}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label={t('dashboard.recordingDetail.chipVoiceRoom')}
                                    toneClassName="border-[#1520a6]/30 bg-[#1520a6]/12 text-[#1520a6]"
                                >
                                    <span>{recording.voiceRoomId ? `#${recording.voiceRoomId}` : t('dashboard.recordingDetail.noVoiceRoom')}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label={t('dashboard.recordingDetail.chipParticipants')}
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
                                    label={t('dashboard.recordingDetail.chipSegments')}
                                    toneClassName="border-[#c35500]/80 bg-[#c35500]/10 text-[#c35500]"
                                >
                                    <span>{recording.outputFiles.length}</span>
                                </RecordingMetaChip>
                                <RecordingMetaChip
                                    label={t('dashboard.recordingDetail.chipStatus')}
                                    toneClassName={stopReasonToneClassName(recording.stopReason ?? null)}
                                >
                                    <span>{formatStopReason(recording.stopReason ?? null, t)}</span>
                                </RecordingMetaChip>
                            </div>
                        </div>
                    </div>
                }
                backButton={
                    <Link to="/dashboard/recordings" className="btn btn-ghost btn-sm"><ArrowLeftIcon className="h-4 w-4" />{t('dashboard.recordingDetail.backButton')}</Link>
                }
                actions={
                    <ButtonOne
                        label={areTracksPrepared ? t('dashboard.recordingDetail.tracksLoaded') : t('dashboard.recordingDetail.loadTracks')}
                        variant="outline"
                        Icon={ArrowDownTrayIcon}
                        onClick={() => { void prepareAllUserSources() }}
                        loading={audioLoadingKey === `session:${recording.id}`}
                        disabled={areTracksPrepared || recording.outputFiles.length === 0}
                    />
                }
            />

            {error ? <DashboardAlert tone="warning" icon={<ExclamationTriangleIcon className="h-5 w-5" />} className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}

            <RecordingSessionTracksPlayer
                recording={recording}
                userGroups={userGroups}
                sourcesByUserId={userSources}
                isPreparing={audioLoadingKey === `session:${recording.id}`}
                onPrepare={() => { void prepareAllUserSources() }}
                onDownloadGlobalMix={(mutedUserIds) => { void downloadGlobalMix(mutedUserIds) }}
                onDownloadUserTrack={(userId) => { void downloadUserTrack(userId) }}
                downloadLoadingGlobalMix={globalMixDownloadLoading}
                downloadLoadingUserId={downloadLoadingKey}
            />

            {hasApproximateSync ? <div className="mx-6 mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-content/80 lg:mx-8">{t('dashboard.recordingDetail.approximateSync')}</div> : null}

            {recording.errorMessage ? <div className="mx-6 mt-6 rounded-2xl border border-error/30 bg-error/8 p-4 text-sm text-error lg:mx-8"><div className="flex items-center gap-2 font-semibold"><XCircleIcon className="h-5 w-5" />{t('dashboard.recordingDetail.processingFailed')}</div><p className="mt-2 text-error/85">{recording.errorMessage}</p></div> : null}
        </section>
    )
}