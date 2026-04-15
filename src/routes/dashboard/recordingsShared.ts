import type { DashboardRecording, DashboardRecordingFile } from '../../types'

export type PreparedAudioSource = {
    label: string
    objectUrl: string
}

export type UserRecordingGroup = {
    userId: string
    username: string
    files: DashboardRecordingFile[]
}

export function formatDateTime(value: string | null): string {
    if (!value) {
        return 'Pas encore disponible'
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

export function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (remainingSeconds === 0) {
        return `${minutes} min`
    }

    return `${minutes} min ${remainingSeconds}s`
}

export function formatSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} o`
    }

    const units = ['Ko', 'Mo', 'Go']
    let value = bytes / 1024
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex += 1
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

export function getRecordingTiming(recording: DashboardRecording): string {
    if (recording.startedAt && recording.finishedAt) {
        const elapsedSeconds = Math.max(1, Math.round((new Date(recording.finishedAt).getTime() - new Date(recording.startedAt).getTime()) / 1_000))
        return `${formatDuration(elapsedSeconds)} capturées`
    }

    return `Cible: ${formatDuration(recording.durationSeconds)}`
}

export function getActualRecordingDurationSeconds(recording: DashboardRecording): number | null {
    if (recording.startedAt && recording.finishedAt) {
        return Math.max(1, Math.round((new Date(recording.finishedAt).getTime() - new Date(recording.startedAt).getTime()) / 1_000))
    }

    const timelineDurationMs = getRecordingTimelineDurationMs(recording)

    if (timelineDurationMs <= 0) {
        return null
    }

    return Math.max(1, Math.round(timelineDurationMs / 1_000))
}

export function getRecordingStatusLabel(status: DashboardRecording['status']): string {
    switch (status) {
    case 'COMPLETED':
        return 'Disponible'
    case 'PROCESSING':
        return 'En cours'
    case 'PENDING':
        return 'En attente'
    case 'FAILED':
        return 'Échoué'
    }
}

export function canDeleteRecording(recording: DashboardRecording): boolean {
    return recording.status === 'COMPLETED' || recording.status === 'FAILED'
}

export function getPreparedSourceKey(scope: 'room' | 'user', recordingId: number, userId?: string): string {
    return scope === 'room' ? `room:${recordingId}` : `user:${recordingId}:${userId ?? 'unknown'}`
}

export function getFileCacheKey(recordingId: number, fileIndex: number): string {
    return `${recordingId}:${fileIndex}`
}

export function getApproximateFileOffsetMs(recording: DashboardRecording, file: DashboardRecordingFile): number {
    if (typeof file.startOffsetMs === 'number') {
        return Math.max(0, file.startOffsetMs)
    }

    const prefix = Number.parseInt(file.fileName.split('-')[0] ?? '', 10)
    if (Number.isFinite(prefix) && recording.startedAt) {
        return Math.max(0, prefix - new Date(recording.startedAt).getTime())
    }

    return 0
}

export function formatOffsetLabel(offsetMs: number): string {
    return `+${formatDuration(Math.max(0, Math.round(offsetMs / 1_000)))}`
}

export function formatPlaybackClock(totalSeconds: number): string {
    const normalizedSeconds = Math.max(0, Math.floor(totalSeconds))
    const minutes = Math.floor(normalizedSeconds / 60)
    const seconds = normalizedSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function getRecordingFileDurationMs(file: DashboardRecordingFile): number {
    return Math.max(250, (file.durationSeconds ?? 0) * 1_000)
}

export function isRecordingFileActiveAt(recording: DashboardRecording, file: DashboardRecordingFile, currentTimeMs: number): boolean {
    const offsetMs = getApproximateFileOffsetMs(recording, file)
    const endTimeMs = offsetMs + getRecordingFileDurationMs(file)

    return currentTimeMs >= offsetMs && currentTimeMs <= endTimeMs
}

export function getActiveSpeakerIds(recording: DashboardRecording, currentTimeMs: number): string[] {
    const activeSpeakerIds = new Set<string>()

    for (const file of recording.outputFiles) {
        if (isRecordingFileActiveAt(recording, file, currentTimeMs)) {
            activeSpeakerIds.add(file.userId)
        }
    }

    return Array.from(activeSpeakerIds)
}

export function sortFilesByTimeline(recording: DashboardRecording, files: DashboardRecordingFile[]): DashboardRecordingFile[] {
    return [...files].sort((left, right) => {
        const offsetDifference = getApproximateFileOffsetMs(recording, left) - getApproximateFileOffsetMs(recording, right)
        if (offsetDifference !== 0) {
            return offsetDifference
        }

        return left.fileName.localeCompare(right.fileName)
    })
}

export function groupFilesByUser(recording: DashboardRecording): UserRecordingGroup[] {
    const groups = new Map<string, UserRecordingGroup>()

    for (const file of sortFilesByTimeline(recording, recording.outputFiles)) {
        const existing = groups.get(file.userId)

        if (existing) {
            existing.files.push(file)
            continue
        }

        groups.set(file.userId, {
            userId: file.userId,
            username: file.username,
            files: [file],
        })
    }

    return Array.from(groups.values())
}

function getAudioContextConstructor(): typeof AudioContext {
    const constructor = window.AudioContext
        ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!constructor) {
        throw new Error('Le navigateur ne supporte pas le mixage audio.')
    }

    return constructor
}

function encodeWavFromAudioBuffer(buffer: AudioBuffer): Blob {
    const numberOfChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const bitsPerSample = 16
    const bytesPerSample = bitsPerSample / 8
    const dataLength = buffer.length * numberOfChannels * bytesPerSample
    const result = new ArrayBuffer(44 + dataLength)
    const view = new DataView(result)
    const channelData = Array.from({ length: numberOfChannels }, (_, index) => buffer.getChannelData(index))

    let offset = 0
    const writeString = (value: string) => {
        for (let index = 0; index < value.length; index += 1) {
            view.setUint8(offset, value.charCodeAt(index))
            offset += 1
        }
    }

    writeString('RIFF')
    view.setUint32(offset, 36 + dataLength, true)
    offset += 4
    writeString('WAVE')
    writeString('fmt ')
    view.setUint32(offset, 16, true)
    offset += 4
    view.setUint16(offset, 1, true)
    offset += 2
    view.setUint16(offset, numberOfChannels, true)
    offset += 2
    view.setUint32(offset, sampleRate, true)
    offset += 4
    view.setUint32(offset, sampleRate * numberOfChannels * bytesPerSample, true)
    offset += 4
    view.setUint16(offset, numberOfChannels * bytesPerSample, true)
    offset += 2
    view.setUint16(offset, bitsPerSample, true)
    offset += 2
    writeString('data')
    view.setUint32(offset, dataLength, true)
    offset += 4

    for (let sampleIndex = 0; sampleIndex < buffer.length; sampleIndex += 1) {
        for (let channelIndex = 0; channelIndex < numberOfChannels; channelIndex += 1) {
            const sample = Math.max(-1, Math.min(1, channelData[channelIndex][sampleIndex] ?? 0))
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
            offset += 2
        }
    }

    return new Blob([result], { type: 'audio/wav' })
}

export async function buildMixedAudioBlob(inputs: Array<{ blob: Blob; offsetMs: number }>): Promise<Blob> {
    if (inputs.length === 0) {
        throw new Error('Aucun flux audio disponible pour ce mix.')
    }

    const AudioContextConstructor = getAudioContextConstructor()
    const previewContext = new AudioContextConstructor()

    try {
        const decodedInputs = await Promise.all(inputs.map(async ({ blob, offsetMs }) => {
            const sourceBuffer = await blob.arrayBuffer()
            const decodedBuffer = await previewContext.decodeAudioData(sourceBuffer.slice(0))

            return {
                offsetMs,
                audioBuffer: decodedBuffer,
            }
        }))

        const sampleRate = previewContext.sampleRate
        const totalDurationSeconds = Math.max(
            ...decodedInputs.map(({ offsetMs, audioBuffer }) => (offsetMs / 1_000) + audioBuffer.duration),
            0.25,
        )
        const totalFrames = Math.ceil(totalDurationSeconds * sampleRate)
        const numberOfChannels = Math.max(2, ...decodedInputs.map(({ audioBuffer }) => audioBuffer.numberOfChannels))
        const offlineContext = new OfflineAudioContext(numberOfChannels, totalFrames, sampleRate)

        for (const { offsetMs, audioBuffer } of decodedInputs) {
            const source = offlineContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(offlineContext.destination)
            source.start(offsetMs / 1_000)
        }

        const renderedBuffer = await offlineContext.startRendering()
        return encodeWavFromAudioBuffer(renderedBuffer)
    } finally {
        await previewContext.close()
    }
}

export function getRecordingTimelineDurationMs(recording: DashboardRecording): number {
    const fromSession = recording.startedAt && recording.finishedAt
        ? Math.max(1_000, new Date(recording.finishedAt).getTime() - new Date(recording.startedAt).getTime())
        : recording.durationSeconds * 1_000
    const fromSegments = recording.outputFiles.reduce((currentMax, file) => {
        const offset = getApproximateFileOffsetMs(recording, file)
        const durationMs = (file.durationSeconds ?? 0) * 1_000
        return Math.max(currentMax, offset + durationMs)
    }, 0)

    return Math.max(fromSession, fromSegments, 1_000)
}