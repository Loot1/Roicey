export type RecordingStopReason = 'completed' | 'manual' | 'size_limit' | 'disconnected'

export interface DashboardRecordingFile {
    index: number;
    userId: string;
    fileName: string;
    sizeBytes: number;
    startOffsetMs: number | null;
    durationSeconds: number | null;
    streamPath: string;
}

export interface DashboardRecordingParticipant {
    userId: string;
    username: string;
    avatarUrl: string | null;
}

export interface DashboardRecording {
    id: number;
    guildId: string | null;
    guildName: string | null;
    channelId: string;
    channelName: string | null;
    requesterId: string;
    requesterName: string | null;
    voiceRoomId: string | null;
    reason: string;
    durationSeconds: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    stopReason: RecordingStopReason | null;
    errorMessage: string | null;
    requestedAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    participants?: DashboardRecordingParticipant[];
    outputFiles: DashboardRecordingFile[];
    source?: string;
    sourceArchiveUrl?: string;
    sourceMessageUrl?: string;
    archiveFileName?: string;
}