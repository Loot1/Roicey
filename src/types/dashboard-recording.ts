export interface DashboardRecordingFile {
    index: number
    userId: string
    username: string
    fileName: string
    sizeBytes: number
    startOffsetMs: number | null
    durationSeconds: number | null
    streamPath: string
}

export interface DashboardRecording {
    id: number
    channelId: string
    channelName: string | null
    requesterId: string
    requesterName: string | null
    durationSeconds: number
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    errorMessage: string | null
    requestedAt: string
    startedAt: string | null
    finishedAt: string | null
    outputFiles: DashboardRecordingFile[]
}