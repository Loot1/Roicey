import { ArrowDownTrayIcon, ArrowPathIcon, BellAlertIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { useWavesurfer } from '@wavesurfer/react'
import { useEffect, useMemo, useRef } from 'react'
import type { DashboardRecording } from '../../types'
import { formatPlaybackClock, formatSize, getApproximateFileOffsetMs, getRecordingFileDurationMs, type UserRecordingGroup } from '../../utils'

type ParticipantMetrics = {
    speakingDurationSeconds: number
    totalSizeBytes: number
    segmentsCount: number
}

type RecordingSessionParticipantCardProps = {
    group: UserRecordingGroup
    index: number
    recording: DashboardRecording
    isMuted: boolean
    isActive: boolean
    isReady: boolean
    isRequester: boolean
    metrics?: ParticipantMetrics
    timelineDurationSeconds: number
    sourceUrl?: string
    currentTimeSeconds: number
    downloadLoadingUserId: string | null
    onToggleUserMute: (userId: string) => void
    onDownloadUserTrack: (userId: string) => void
}

function getLaneGradient(index: number): string {
    const hue = (index * 49 + 18) % 360
    return `linear-gradient(135deg, hsla(${hue} 88% 54% / 0.9), hsla(${(hue + 24) % 360} 88% 64% / 0.64))`
}

function getLaneWaveColors(index: number): { waveColor: string, progressColor: string } {
    const hue = (index * 49 + 18) % 360

    return {
        waveColor: `hsl(${hue} 88% 54% / 0.62)`,
        progressColor: `hsl(${(hue + 24) % 360} 88% 64% / 0.88)`,
    }
}

type ParticipantWaveformProps = {
    sourceUrl: string
    waveColor: string
    progressColor: string
    currentTimeSeconds: number
    opacity: number
    filter: string
}

function ParticipantWaveform({
    sourceUrl,
    waveColor,
    progressColor,
    currentTimeSeconds,
    opacity,
    filter,
}: ParticipantWaveformProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const options = useMemo(() => ({
        container: containerRef,
        height: 'auto' as const,
        waveColor,
        progressColor,
        url: sourceUrl,
        cursorWidth: 0.3,
        barWidth: 2,
        barGap: 1,
        barRadius: 8,
        barMinHeight: 1,
        width: '100%',
        fillParent: true,
        minPxPerSec: 0,
        hideScrollbar: true,
        dragToSeek: false,
        interact: false,
        normalize: true,
    }), [progressColor, sourceUrl, waveColor])

    const { wavesurfer } = useWavesurfer(options)

    useEffect(() => {
        wavesurfer?.setTime(currentTimeSeconds)
    }, [currentTimeSeconds, wavesurfer])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full"
            style={{
                opacity,
                filter,
            }}
        />
    )
}

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
        || '?'
}

export function RecordingSessionParticipantCard({
    group,
    index,
    recording,
    isMuted,
    isActive,
    isReady,
    isRequester,
    metrics,
    timelineDurationSeconds,
    sourceUrl,
    currentTimeSeconds,
    downloadLoadingUserId,
    onToggleUserMute,
    onDownloadUserTrack,
}: RecordingSessionParticipantCardProps) {
    const opacityWave = isMuted ? 0.30 : isActive ? 1 : 0.72
    const { waveColor, progressColor } = getLaneWaveColors(index)

    return (
        <div className={`grid grid-cols-1 gap-3 md:gap-4 rounded-[1.35rem] border bg-base-100 px-4 py-3 shadow-sm transition xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] ${isActive ? 'border-primary/25 bg-primary/[0.03]' : 'border-base-300'} ${!isReady ? 'opacity-60' : ''}`}>
            <article className={`${isActive ? 'text-base-content' : ''} p-1`} aria-label={`Participant ${group.username}`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="h-10 w-10 rounded-full border border-base-300 bg-base-200 text-base-content/60 shadow-sm">
                                    {group.avatarUrl ? (
                                        <img src={group.avatarUrl} alt={`Avatar de ${group.username}`} loading="lazy" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase tracking-[0.12em]">
                                            {getInitials(group.username)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full border border-white/60" style={{ background: getLaneGradient(index) }} />
                                    <p className="truncate text-base font-black">{group.username}</p>
                                    {isRequester ? (
                                        <span className="inline-flex items-center text-error" title="Demandeur de l'enregistrement" aria-label="Demandeur de l'enregistrement">
                                            <BellAlertIcon className="h-4 w-4" />
                                        </span>
                                    ) : null}
                                </div>
                                <p className="mt-1 text-xs text-base-content/50">{group.userId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`btn btn-sm btn-square ${isMuted ? 'border-error bg-error text-error-content hover:bg-error/90' : 'btn-ghost border border-base-300'}`}
                            onClick={() => onToggleUserMute(group.userId)}
                            disabled={!isReady}
                            aria-label={isMuted ? `Réactiver ${group.username}` : `Muter ${group.username}`}
                        >
                            <MicrophoneIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-square btn-ghost border border-base-300"
                            onClick={() => onDownloadUserTrack(group.userId)}
                            disabled={!isReady || downloadLoadingUserId === group.userId}
                            aria-label={`Télécharger la piste de ${group.username}`}
                        >
                            {downloadLoadingUserId === group.userId ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <ArrowDownTrayIcon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-base-content/55">
                    <span>Temps de parole: <span className="font-semibold text-base-content/75">{formatPlaybackClock(metrics?.speakingDurationSeconds ?? 0)}</span></span>
                    <span>Taille: <span className="font-semibold text-base-content/75">{formatSize(metrics?.totalSizeBytes ?? 0)}</span></span>
                    <span>{metrics?.segmentsCount ?? 0} segment{(metrics?.segmentsCount ?? 0) > 1 ? 's' : ''}</span>
                </div>
            </article>

            <div className="pb-1 lg:py-1">
                <div className={`relative h-12 w-full overflow-hidden rounded-full border ${isActive ? 'border-primary/35 bg-primary/5' : 'border-base-300 bg-base-200/35'}`}>
                    {isReady ? (
                        <>
                            <div
                                className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, hsl(var(--bc) / 0.24) 1px, transparent 1px)',
                                    backgroundSize: '6px 2px',
                                }}
                            />
                            {sourceUrl ? (
                                <ParticipantWaveform
                                    sourceUrl={sourceUrl}
                                    waveColor={waveColor}
                                    progressColor={progressColor}
                                    currentTimeSeconds={currentTimeSeconds}
                                    opacity={opacityWave}
                                    filter={isActive && !isMuted ? 'drop-shadow(0 0 14px rgba(0,0,0,0.14))' : 'none'}
                                />
                            ) : null}
                        </>
                    ) : (
                        group.files.map((file) => {
                            const offsetMs = getApproximateFileOffsetMs(recording, file)
                            const durationMs = getRecordingFileDurationMs(file)
                            const leftPercent = (offsetMs / (timelineDurationSeconds * 1_000)) * 100
                            const widthPercent = Math.max(1.5, (durationMs / (timelineDurationSeconds * 1_000)) * 100)

                            return (
                                <div
                                    key={file.index}
                                    className={`absolute top-1/2 h-7 -translate-y-1/2 rounded-full border border-white/30 ${isActive && !isMuted ? 'shadow-[0_0_18px_rgba(0,0,0,0.14)]' : ''}`}
                                    style={{
                                        left: `${leftPercent}%`,
                                        width: `${Math.min(widthPercent, Math.max(1.5, 100 - leftPercent))}%`,
                                        background: getLaneGradient(index),
                                        opacity: opacityWave,
                                    }}
                                />
                            )
                        })
                    )}
                </div>

                <div className="mt-3 flex items-center justify-start text-xs font-semibold text-base-content/55">
                    <span>{isMuted ? 'Muet' : isActive ? 'Parle actuellement' : 'En attente'}</span>
                </div>
            </div>
        </div>
    )
}
