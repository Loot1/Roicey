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
    avatarUrl?: string | null;
}

export interface DashboardRecording {
    id: number;
    guildId?: string;
    guildName?: string | null;
    channelId: string;
    channelName: string | null;
    requesterId: string;
    requesterName: string | null;
    voiceRoomId: string | null;
    reason: string;
    durationSeconds: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    errorMessage: string | null;
    requestedAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    participants?: DashboardRecordingParticipant[];
    outputFiles: DashboardRecordingFile[];
    source?: string;
    sourceArchiveUrl?: string | null;
    sourceMessageUrl?: string | null;
    archiveFileName?: string;
}