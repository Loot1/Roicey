import { ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { ButtonOne, DashboardAlert, DashboardPageHeader, RecordingSessionPlayer } from '../../components'
import { demoRecording, demoRecordingMixPath, demoRecordingUserTrackPaths } from '../../constants'
import type { DashboardRecordingParticipant } from '../../types'
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

export function DemoRecordingsPage() {
    const [tracksPrepared, setTracksPrepared] = useState(false)
    const [downloadLoadingUserId, setDownloadLoadingUserId] = useState<string | null>(null)
    const [downloadLoadingGlobalMix, setDownloadLoadingGlobalMix] = useState(false)

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
                    label: `${group.username} • Démo #${recording.id}`,
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
                                    toneClassName="border-[#ff6e00]/80 bg-[#ff6e00]/10 text-[#ff6e00]"
                                >
                                    <span>{recording.outputFiles.length}</span>
                                </RecordingMetaChip>
                            </div>
                        </div>
                    </div>
                }
                actions={
                    <ButtonOne
                        label={areTracksPrepared ? 'Pistes chargées' : 'Charger les pistes'}
                        variant="outline"
                        Icon={ArrowDownTrayIcon}
                        onClick={() => setTracksPrepared(true)}
                        disabled={areTracksPrepared || recording.outputFiles.length === 0}
                    />
                }
            />

            <DashboardAlert tone="info" icon={<InformationCircleIcon className="h-5 w-5" />} className="mx-6 mt-6 lg:mx-8">
                Cette démo lit uniquement des fichiers audio statiques stockés dans le site. Le téléchargement du mix récupère le master public de référence.
            </DashboardAlert>

            <RecordingSessionPlayer
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