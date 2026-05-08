import { ArrowDownTrayIcon, ArrowPathIcon, BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RecordingSessionParticipantCard } from './RecordingSessionParticipantCard'
import type { DashboardRecording } from '../../types'
import { formatPlaybackClock, getActiveSpeakerIds, getRecordingFileDurationMs, getRecordingTimelineDurationMs, type PreparedAudioSource, type UserRecordingGroup } from '../../utils'

const AUDIO_SYNC_THRESHOLD_SECONDS = 0.2

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

type RecordingSessionTracksPlayerProps = {
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

export function RecordingSessionTracksPlayer({
    ...props
}: RecordingSessionTracksPlayerProps) {
    return <RecordingSessionTracksPlayerContent key={props.recording.id} {...props} />
}

function RecordingSessionTracksPlayerContent({
    recording,
    userGroups,
    sourcesByUserId,
    isPreparing,
    onPrepare,
    onDownloadGlobalMix,
    onDownloadUserTrack,
    downloadLoadingGlobalMix,
    downloadLoadingUserId,
}: RecordingSessionTracksPlayerProps) {
    const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})
    const { t } = useTranslation()
    const [mutedUserIds, setMutedUserIds] = useState<string[]>([])
    const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const shouldAutoPlayAfterPrepare = useRef(false)

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

                if (Math.abs(audio.currentTime - primaryAudio.currentTime) > AUDIO_SYNC_THRESHOLD_SECONDS) {
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

    useEffect(() => {
        if (!shouldAutoPlayAfterPrepare.current || !hasPreparedSources || isPreparing || isPlaying) {
            return
        }

        shouldAutoPlayAfterPrepare.current = false

        const autoPlay = async () => {
            for (const group of playableGroups) {
                const audio = audioRefs.current[group.userId]
                if (audio) {
                    audio.currentTime = currentTimeSeconds
                }
            }
            await Promise.all(playableGroups.map(async (group) => {
                const audio = audioRefs.current[group.userId]
                if (audio) {
                    await audio.play()
                }
            }))
        }

        void autoPlay()
    }, [hasPreparedSources, isPlaying, isPreparing, playableGroups, currentTimeSeconds])

    const pauseAll = () => {
        for (const group of playableGroups) {
            const audio = audioRefs.current[group.userId]
            audio?.pause()
        }
    }

    const togglePlayback = async () => {
        if (!hasPreparedSources) {
            shouldAutoPlayAfterPrepare.current = true
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
        <section className="bg-base-100 pb-6 lg:pb-8">
            <div className="px-6 py-5 lg:px-8">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-stretch xl:gap-6">
                    <div className="flex flex-col xl:min-h-full">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-base-content/45">{t('recordingPlayer.sessionLabel')}</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight">{t('recordingPlayer.tracksTitle')}</h2>
                        <p className="mt-4 hidden px-1 text-xs font-black uppercase tracking-[0.18em] text-base-content/45 xl:mt-auto xl:block">{t('recordingPlayer.participantsLabel')}</p>
                    </div>
                    <div>
                        <p className="mb-3 w-full text-sm text-base-content/65">{t('recordingPlayer.muteDesc')}</p>
                        <div
                            className="relative rounded-[1.2rem] border border-base-300 bg-base-100 px-4 py-4 shadow-sm"
                            role="slider"
                            tabIndex={0}
                            aria-label={t('recordingPlayer.seekAria')}
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
                                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-base-content/45">{t('recordingPlayer.globalTrack')}</p>
                                    <SessionPlayerButton
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="btn-square border border-base-300"
                                        onClick={() => seekTo(currentTimeSeconds - 10)}
                                        disabled={!hasPreparedSources}
                                        aria-label={t('recordingPlayer.backward10Aria')}
                                        title={t('recordingPlayer.backward10Title')}
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
                                        aria-label={hasPreparedSources ? (isPlaying ? t('recordingPlayer.pauseAria') : t('recordingPlayer.playAria')) : t('recordingPlayer.prepareAria')}
                                        title={hasPreparedSources ? (isPlaying ? t('recordingPlayer.pauseTitle') : t('recordingPlayer.playTitle')) : t('recordingPlayer.prepareTitle')}
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
                                        aria-label={t('recordingPlayer.forward10Aria')}
                                        title={t('recordingPlayer.forward10Title')}
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
                                        aria-label={t('recordingPlayer.currentMixAria')}
                                        title={downloadEligibleGroups.length === 0 ? t('recordingPlayer.currentMixEmptyTitle') : t('recordingPlayer.currentMixTitle')}
                                    >
                                        {downloadLoadingGlobalMix ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <ArrowDownTrayIcon className="h-4 w-4" />}
                                        {t('recordingPlayer.currentMix')}
                                    </SessionPlayerButton>
                                </div>
                                <p className="text-sm font-black tabular-nums text-base-content/70">{formatPlaybackClock(currentTimeSeconds)} <span className="text-base-content/35">/ {formatPlaybackClock(timelineDurationSeconds)}</span></p>
                            </div>
                            <input
                                type="range"
                                className="range range-primary range-xs w-full cursor-pointer h-3.25"
                                aria-hidden="true"
                                min={0}
                                max={timelineDurationSeconds}
                                step={0.1}
                                value={currentTimeSeconds}
                                onChange={(event) => seekTo(Number(event.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 lg:px-8">
                <div className="space-y-3">
                    <p className="px-1 text-xs font-black uppercase tracking-[0.18em] text-base-content/45 xl:hidden">{t('recordingPlayer.participantsLabel')}</p>
                    <div className="space-y-3">
                            {userGroups.map((group, index) => {
                                const isMuted = mutedUserIds.includes(group.userId)
                                const isActive = activeSpeakerIds.includes(group.userId)
                                const isReady = Boolean(sourcesByUserId[group.userId])

                                return (
                                    <RecordingSessionParticipantCard
                                        key={group.userId}
                                        group={group}
                                        index={index}
                                        recording={recording}
                                        isMuted={isMuted}
                                        isActive={isActive}
                                        isReady={isReady}
                                        isRequester={group.userId === recording.requesterId}
                                        metrics={userMetrics[group.userId]}
                                        timelineDurationSeconds={timelineDurationSeconds}
                                        sourceUrl={sourcesByUserId[group.userId]?.objectUrl}
                                        currentTimeSeconds={currentTimeSeconds}
                                        downloadLoadingUserId={downloadLoadingUserId}
                                        onToggleUserMute={toggleUserMute}
                                        onDownloadUserTrack={onDownloadUserTrack}
                                    />
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
                    aria-hidden="true"
                />
            ))}
        </section>
    )
}