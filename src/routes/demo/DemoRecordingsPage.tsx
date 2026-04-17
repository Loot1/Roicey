import { ArrowDownTrayIcon, InformationCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { DashboardAlert, DashboardPageHeader, RecordingSessionPlayer } from '../../components'
import { demoRecording, demoRecordingMixPath, demoRecordingUserTrackPaths } from '../../constants'
import { formatDateTime, formatDuration, getActualRecordingDurationSeconds, groupFilesByUser, type PreparedAudioSource } from '../../utils'

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
                title={
                    <span className="flex w-full min-w-0 items-center justify-between gap-3 leading-none sm:inline-flex sm:w-auto sm:max-w-full sm:flex-wrap sm:justify-start">
                        <span className="block min-w-0 flex-1 truncate leading-tight sm:max-w-[32rem] sm:flex-none lg:max-w-[40rem]">{recording.channelName ?? `Salon ${recording.channelId}`}</span>
                        <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase leading-none tracking-[0.16em] text-primary">Démo publique</span>
                    </span>
                }
                description={
                    <div className="space-y-3">
                        <p>Demandé par {recording.requesterName ?? recording.requesterId} ({recording.requesterId}) le {formatDateTime(recording.requestedAt)}.</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/60">
                            <span>Durée: <span className="font-semibold text-base-content/80">{`${actualDurationSeconds ? formatDuration(actualDurationSeconds) : 'Indisponible'} / ${formatDuration(recording.durationSeconds)}`}</span></span>
                            <span>Participants: <span className="font-semibold text-base-content/80">{userGroups.length}</span></span>
                            <span>Segments: <span className="font-semibold text-base-content/80">{recording.outputFiles.length}</span></span>
                        </div>
                    </div>
                }
                actions={
                    <button className="btn btn-outline" onClick={() => setTracksPrepared(true)} disabled={areTracksPrepared || recording.outputFiles.length === 0}>
                        {areTracksPrepared ? <ArrowDownTrayIcon className="h-4 w-4" /> : <PlayCircleIcon className="h-4 w-4" />}
                        {areTracksPrepared ? 'Pistes chargées' : 'Charger les pistes'}
                    </button>
                }
                bottom={
                    <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary badge-soft">Extraits réels dans public</span>
                        <span className="badge badge-secondary badge-soft">Aucune API</span>
                        <span className="badge badge-accent badge-soft">OGG natif</span>
                    </div>
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