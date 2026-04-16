import { ArrowDownTrayIcon, ArrowPathIcon, BackwardIcon, BellAlertIcon, ForwardIcon, MicrophoneIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { DashboardRecording } from '../../types'
import { formatPlaybackClock, formatSize, getActiveSpeakerIds, getApproximateFileOffsetMs, getRecordingFileDurationMs, getRecordingTimelineDurationMs, type PreparedAudioSource, type UserRecordingGroup } from '../../utils'

type SessionPlayerButtonVariant = 'primary' | 'ghost' | 'danger'
type SessionPlayerButtonSize = 'md' | 'sm'

type SessionPlayerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: SessionPlayerButtonVariant
    size?: SessionPlayerButtonSize
    children: ReactNode
}

function SessionPlayerButton({
    type = 'button',
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: SessionPlayerButtonProps) {
    const variantClassName = variant === 'primary'
        ? 'btn-primary'
        : variant === 'danger'
            ? 'border-0 bg-error text-error-content hover:bg-error/90 disabled:bg-error/70'
            : 'btn-ghost'
    const sizeClassName = size === 'sm' ? 'btn-sm' : ''

    return (
        <button
            type={type}
            className={['btn', variantClassName, sizeClassName, className].filter(Boolean).join(' ')}
            {...props}
        >
            {children}
        </button>
    )
}

type RecordingSessionPlayerProps = {
    recording: DashboardRecording
    userGroups: UserRecordingGroup[]
    sourcesByUserId: Record<string, PreparedAudioSource>
    isPreparing: boolean
    onPrepare: () => void
    onDownloadGlobalMix: (mutedUserIds: string[]) => void
    onDownloadUserTrack: (userId: string) => void
    downloadLoadingGlobalMix: boolean
    downloadLoadingUserId: string | null
}

function getLaneGradient(index: number): string {
    const hue = (index * 49 + 18) % 360
    return `linear-gradient(135deg, hsla(${hue} 88% 54% / 0.9), hsla(${(hue + 24) % 360} 88% 64% / 0.64))`
}

export function RecordingSessionPlayer({
    recording,
    userGroups,
    sourcesByUserId,
    isPreparing,
    onPrepare,
    onDownloadGlobalMix,
    onDownloadUserTrack,
    downloadLoadingGlobalMix,
    downloadLoadingUserId,
}: RecordingSessionPlayerProps) {
    const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})
    const [mutedUserIds, setMutedUserIds] = useState<string[]>([])
    const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const playableGroups = useMemo(
        () => userGroups.filter((group) => sourcesByUserId[group.userId]),
        [sourcesByUserId, userGroups],
    )
    const downloadEligibleGroups = useMemo(
        () => userGroups.filter((group) => !mutedUserIds.includes(group.userId)),
        [mutedUserIds, userGroups],
    )

    const primaryUserId = playableGroups[0]?.userId ?? null
    const hasPreparedSources = playableGroups.length > 0
    const timelineDurationSeconds = useMemo(
        () => Math.max(1, Math.round(getRecordingTimelineDurationMs(recording) / 1_000)),
        [recording],
    )
    const progressPercent = Math.min(100, (currentTimeSeconds / timelineDurationSeconds) * 100)
    const activeSpeakerIds = useMemo(
        () => getActiveSpeakerIds(recording, currentTimeSeconds * 1_000),
        [currentTimeSeconds, recording],
    )
    const userMetrics = useMemo(() => Object.fromEntries(userGroups.map((group) => {
        const speakingDurationSeconds = Math.max(1, Math.round(group.files.reduce((total, file) => total + getRecordingFileDurationMs(file), 0) / 1_000))
        const totalSizeBytes = group.files.reduce((total, file) => total + file.sizeBytes, 0)

        return [group.userId, {
            speakingDurationSeconds,
            totalSizeBytes,
            segmentsCount: group.files.length,
        }]
    })), [userGroups])

    useEffect(() => {
        setMutedUserIds([])
        setCurrentTimeSeconds(0)
        setIsPlaying(false)
    }, [recording.id])

    useEffect(() => {
        const primaryAudio = primaryUserId ? audioRefs.current[primaryUserId] : null
        if (!primaryAudio) {
            return
        }

        const handleTimeUpdate = () => {
            setCurrentTimeSeconds(primaryAudio.currentTime)

            for (const group of playableGroups) {
                if (group.userId === primaryUserId) {
                    continue
                }

                const audio = audioRefs.current[group.userId]
                if (!audio) {
                    continue
                }

                if (Math.abs(audio.currentTime - primaryAudio.currentTime) > 0.2) {
                    audio.currentTime = primaryAudio.currentTime
                }
            }
        }

        const handlePlay = () => {
            setIsPlaying(true)
        }

        const handlePause = () => {
            setIsPlaying(false)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTimeSeconds(0)

            for (const group of playableGroups) {
                const audio = audioRefs.current[group.userId]
                if (!audio) {
                    continue
                }

                audio.pause()
                audio.currentTime = 0
            }
        }

        primaryAudio.addEventListener('timeupdate', handleTimeUpdate)
        primaryAudio.addEventListener('play', handlePlay)
        primaryAudio.addEventListener('pause', handlePause)
        primaryAudio.addEventListener('ended', handleEnded)

        return () => {
            primaryAudio.removeEventListener('timeupdate', handleTimeUpdate)
            primaryAudio.removeEventListener('play', handlePlay)
            primaryAudio.removeEventListener('pause', handlePause)
            primaryAudio.removeEventListener('ended', handleEnded)
        }
    }, [playableGroups, primaryUserId])

    useEffect(() => {
        for (const group of playableGroups) {
            const audio = audioRefs.current[group.userId]
            if (!audio) {
                continue
            }

            audio.muted = mutedUserIds.includes(group.userId)
        }
    }, [mutedUserIds, playableGroups])

    const syncAllAudios = (nextTimeSeconds: number) => {
        for (const group of playableGroups) {
            const audio = audioRefs.current[group.userId]
            if (!audio) {
                continue
            }

            audio.currentTime = nextTimeSeconds
        }

        setCurrentTimeSeconds(nextTimeSeconds)
    }

    const playAll = async () => {
        for (const group of playableGroups) {
            const audio = audioRefs.current[group.userId]
            if (!audio) {
                continue
            }

            audio.currentTime = currentTimeSeconds
        }

        await Promise.all(playableGroups.map(async (group) => {
            const audio = audioRefs.current[group.userId]
            if (!audio) {
                return
            }

            await audio.play()
        }))
    }

    const pauseAll = () => {
        for (const group of playableGroups) {
            const audio = audioRefs.current[group.userId]
            audio?.pause()
        }
    }

    const togglePlayback = async () => {
        if (!hasPreparedSources) {
            onPrepare()
            return
        }

        if (isPlaying) {
            pauseAll()
            return
        }

        await playAll()
    }

    const seekTo = (nextTimeSeconds: number) => {
        const boundedTime = Math.max(0, Math.min(timelineDurationSeconds, nextTimeSeconds))
        syncAllAudios(boundedTime)
    }

    const toggleUserMute = (userId: string) => {
        setMutedUserIds((currentIds) => currentIds.includes(userId)
            ? currentIds.filter((currentId) => currentId !== userId)
            : [...currentIds, userId])
    }

    return (
        <section className="bg-base-100">
            <div className="px-6 py-5 lg:px-8">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-stretch xl:gap-6">
                    <div className="flex flex-col xl:min-h-full">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-base-content/45">Lecteur de session</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight">Pistes utilisateurs synchronisées</h2>
                        <p className="mt-4 hidden px-1 text-xs font-black uppercase tracking-[0.18em] text-base-content/45 xl:mt-auto xl:block">Participants</p>
                    </div>
                    <div>
                        <p className="mb-3 w-full text-sm text-base-content/65">Muter un participant masque sa voix de l'écoute. Le curseur avance sur la timeline et met en évidence les prises de parole en cours.</p>
                        <div
                            className="relative rounded-[1.2rem] border border-base-300 bg-base-100 px-4 py-4 shadow-sm"
                            role="slider"
                            tabIndex={0}
                            aria-label="Position de lecture"
                            aria-valuemin={0}
                            aria-valuemax={Math.round(timelineDurationSeconds)}
                            aria-valuenow={Math.round(currentTimeSeconds)}
                            onKeyDown={(event) => {
                                if (event.key === 'ArrowLeft') {
                                    event.preventDefault()
                                    seekTo(currentTimeSeconds - 5)
                                }

                                if (event.key === 'ArrowRight') {
                                    event.preventDefault()
                                    seekTo(currentTimeSeconds + 5)
                                }
                            }}
                        >
                            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-base-content/45">Piste globale</p>
                                    <SessionPlayerButton
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="btn-square border border-base-300"
                                        onClick={() => seekTo(currentTimeSeconds - 10)}
                                        disabled={!hasPreparedSources}
                                        aria-label="Reculer de 10 secondes"
                                        title="Reculer de 10 secondes"
                                    >
                                        <BackwardIcon className="h-4 w-4" />
                                    </SessionPlayerButton>
                                    <SessionPlayerButton
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        className="btn-square"
                                        onClick={() => { void togglePlayback() }}
                                        disabled={isPreparing}
                                        aria-label={hasPreparedSources ? (isPlaying ? 'Mettre en pause' : 'Lire la session') : 'Préparer les pistes'}
                                        title={hasPreparedSources ? (isPlaying ? 'Mettre en pause' : 'Lire la session') : 'Préparer les pistes'}
                                    >
                                        {isPreparing ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                                    </SessionPlayerButton>
                                    <SessionPlayerButton
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="btn-square border border-base-300"
                                        onClick={() => seekTo(currentTimeSeconds + 10)}
                                        disabled={!hasPreparedSources}
                                        aria-label="Avancer de 10 secondes"
                                        title="Avancer de 10 secondes"
                                    >
                                        <ForwardIcon className="h-4 w-4" />
                                    </SessionPlayerButton>
                                    <SessionPlayerButton
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="border border-base-300"
                                        onClick={() => onDownloadGlobalMix(mutedUserIds)}
                                        disabled={downloadLoadingGlobalMix || downloadEligibleGroups.length === 0}
                                        aria-label="Télécharger le mix global courant"
                                        title={downloadEligibleGroups.length === 0 ? 'Aucun participant audible à inclure dans le mix' : 'Télécharger le mix global courant'}
                                    >
                                        {downloadLoadingGlobalMix ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <ArrowDownTrayIcon className="h-4 w-4" />}
                                        Mix actuel
                                    </SessionPlayerButton>
                                </div>
                                <p className="text-sm font-black tabular-nums text-base-content/70">{formatPlaybackClock(currentTimeSeconds)} <span className="text-base-content/35">/ {formatPlaybackClock(timelineDurationSeconds)}</span></p>
                            </div>
                            <div
                                className="relative h-2 cursor-pointer rounded-full bg-base-300/80"
                                onClick={(event) => {
                                    const bounds = event.currentTarget.getBoundingClientRect()
                                    const relativeX = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left))
                                    const ratio = bounds.width > 0 ? relativeX / bounds.width : 0
                                    seekTo(ratio * timelineDurationSeconds)
                                }}
                            >
                                <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                                <div className="absolute bottom-1/2 w-px translate-y-1/2 bg-primary-content/70" style={{ left: `${progressPercent}%` }}>
                                    <div className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-primary/30 bg-primary shadow-[0_0_16px_rgba(0,0,0,0.18)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 lg:px-8">
                <div className="space-y-3">
                    <p className="px-1 text-xs font-black uppercase tracking-[0.18em] text-base-content/45 xl:hidden">Participants</p>
                    <div className="space-y-3">
                            {userGroups.map((group, index) => {
                                const isMuted = mutedUserIds.includes(group.userId)
                                const isActive = activeSpeakerIds.includes(group.userId)
                                const isReady = Boolean(sourcesByUserId[group.userId])
                                const isRequester = group.userId === recording.requesterId
                                const metrics = userMetrics[group.userId]

                                return (
                                    <div key={group.userId} className={`grid grid-cols-1 gap-4 rounded-[1.35rem] border bg-base-100 px-4 py-3 shadow-sm transition xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] ${isActive ? 'border-primary/25 bg-primary/[0.03]' : 'border-base-300'} ${!isReady ? 'opacity-60' : ''}`}>
                                        <article className={`${isActive ? 'text-base-content' : ''} p-1`}>
                                            <div className="flex items-start justify-between gap-3">
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
                                                    <p className="mt-1 text-xs text-base-content/50">ID Discord: {group.userId}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <SessionPlayerButton
                                                        type="button"
                                                        variant={isMuted ? 'danger' : 'ghost'}
                                                        size="sm"
                                                        className={`btn-square ${isMuted ? 'border-error bg-error text-error-content hover:bg-error/90' : 'border border-base-300'}`}
                                                        onClick={() => toggleUserMute(group.userId)}
                                                        disabled={!isReady}
                                                        aria-label={isMuted ? `Réactiver ${group.username}` : `Muter ${group.username}`}
                                                    >
                                                        <MicrophoneIcon className="h-4 w-4" />
                                                    </SessionPlayerButton>
                                                    <SessionPlayerButton
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="btn-square border border-base-300"
                                                        onClick={() => onDownloadUserTrack(group.userId)}
                                                        disabled={!isReady || downloadLoadingUserId === group.userId}
                                                        aria-label={`Télécharger la piste de ${group.username}`}
                                                    >
                                                        {downloadLoadingUserId === group.userId ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <ArrowDownTrayIcon className="h-4 w-4" />}
                                                    </SessionPlayerButton>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-base-content/55">
                                                <span>Temps de parole: <span className="font-semibold text-base-content/75">{formatPlaybackClock(metrics?.speakingDurationSeconds ?? 0)}</span></span>
                                                <span>Taille: <span className="font-semibold text-base-content/75">{formatSize(metrics?.totalSizeBytes ?? 0)}</span></span>
                                                <span>{metrics?.segmentsCount ?? 0} piste{(metrics?.segmentsCount ?? 0) > 1 ? 's' : ''}</span>
                                            </div>

                                        </article>

                                        <div className="py-1">
                                            <div className={`relative h-12 w-full overflow-hidden rounded-full border ${isActive ? 'border-primary/35 bg-primary/5' : 'border-base-300 bg-base-200/35'}`}>
                                                {group.files.map((file) => {
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
                                                                opacity: isMuted ? 0.30 : isActive ? 1 : 0.72,
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </div>

                                            <div className="mt-3 flex items-center justify-start text-xs font-semibold text-base-content/55">
                                                <span>{isMuted ? 'Muet' : isActive ? 'Parle actuellement' : 'En attente'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>

            {playableGroups.map((group) => (
                <audio
                    key={group.userId}
                    ref={(element) => {
                        audioRefs.current[group.userId] = element
                    }}
                    src={sourcesByUserId[group.userId]?.objectUrl}
                    preload="metadata"
                    className="hidden"
                />
            ))}
        </section>
    )
}