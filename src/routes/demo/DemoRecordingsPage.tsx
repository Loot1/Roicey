import { ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonOne } from '../../components/ButtonOne'
import { DashboardAlert, DashboardPageHeader, RecordingMetaChip, RecordingSessionTracksPlayer } from '../../components/dashboard'
import { demoRecording, demoRecordingMixPath, demoRecordingUserTrackPaths } from '../../config'
import type { DashboardRecordingParticipant } from '../../types'
import { formatDateTime, formatDuration, getActualRecordingDurationSeconds, groupFilesByUser, type PreparedAudioSource } from '../../utils'
import { seoMeta } from '../../config/seoMeta'

export function DemoRecordingsPage() {
    const [tracksPrepared, setTracksPrepared] = useState(false)
    const [downloadLoadingUserId, setDownloadLoadingUserId] = useState<string | null>(null)
    const [downloadLoadingGlobalMix, setDownloadLoadingGlobalMix] = useState(false)
    const { t } = useTranslation()

    const recording = demoRecording
    const userGroups = useMemo(() => groupFilesByUser(recording), [recording])
    const userSources = useMemo<Record<string, PreparedAudioSource>>(() => {
        if (!tracksPrepared) {
            return {}
        }

        return Object.fromEntries(userGroups.flatMap((group) => {
            const streamPath = demoRecordingUserTrackPaths[group.userId]

            return streamPath
                ? [[group.userId, {
                    label: `${group.username} • ${t('demo.recordings.demoLabel')} #${recording.id}`,
                    objectUrl: streamPath,
                } satisfies PreparedAudioSource] as const]
                : []
        }))
    }, [recording.id, tracksPrepared, userGroups])
    const areTracksPrepared = userGroups.length > 0 && userGroups.every((group) => Boolean(userSources[group.userId]))
    const allParticipants: DashboardRecordingParticipant[] = recording.participants?.length
        ? recording.participants
        : userGroups.map((group) => ({
            userId: group.userId,
            username: group.username,
            avatarUrl: group.avatarUrl,
        }))

    const downloadStaticAsset = (path: string, fileName: string) => {
        const anchor = document.createElement('a')
        anchor.href = path
        anchor.download = fileName
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
    }

    const handleDownloadUserTrack = (userId: string) => {
        const group = userGroups.find((entry) => entry.userId === userId)
        const trackPath = demoRecordingUserTrackPaths[userId]
        if (!group || !trackPath) {
            return
        }

        setDownloadLoadingUserId(userId)

        try {
            downloadStaticAsset(trackPath, `${group.username.toLowerCase()}-${recording.id}.ogg`)
        } finally {
            setDownloadLoadingUserId((currentUserId) => (currentUserId === userId ? null : currentUserId))
        }
    }

    const handleDownloadGlobalMix = () => {
        setDownloadLoadingGlobalMix(true)

        try {
            downloadStaticAsset(demoRecordingMixPath, `mix-demo-${recording.id}.ogg`)
        } finally {
            setDownloadLoadingGlobalMix(false)
        }
    }

    const actualDurationSeconds = getActualRecordingDurationSeconds(recording)

    return (
        <section className="space-y-0 bg-base-100 pb-10 lg:pb-14">
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
                            </div>
                        </div>
                    </div>
                }
                actions={
                    <ButtonOne
                        label={areTracksPrepared ? t('dashboard.recordingDetail.tracksLoaded') : t('dashboard.recordingDetail.loadTracks')}
                        variant="outline"
                        Icon={ArrowDownTrayIcon}
                        onClick={() => setTracksPrepared(true)}
                        disabled={areTracksPrepared || recording.outputFiles.length === 0}
                    />
                }
            />

            <DashboardAlert tone="info" icon={<InformationCircleIcon className="h-5 w-5" />} className="alert-outline mx-6 mt-6 lg:mx-8">
                {t('demo.recordings.notice')}
            </DashboardAlert>

            <RecordingSessionTracksPlayer
                recording={recording}
                userGroups={userGroups}
                sourcesByUserId={userSources}
                isPreparing={false}
                onPrepare={() => setTracksPrepared(true)}
                onDownloadGlobalMix={handleDownloadGlobalMix}
                onDownloadUserTrack={handleDownloadUserTrack}
                downloadLoadingGlobalMix={downloadLoadingGlobalMix}
                downloadLoadingUserId={downloadLoadingUserId}
            />
        </section>
    )
}

export default DemoRecordingsPage

export const meta = seoMeta('demo')
