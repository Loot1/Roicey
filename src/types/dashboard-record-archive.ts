export interface RecordingArchiveSegment {
    index: number;
    userId: string;
    fileName: string;
    path: string;
    contentType: 'audio/ogg';
    sizeBytes: number;
    startOffsetMs: number;
    durationMs: number;
}

export interface RecordingArchiveParticipant {
    userId: string;
    username: string;
    avatarUrl?: string | null;
}

export interface RecordingArchiveMetadata {
    version: 1;
    requestId: number;
    guildId: string;
    guildName: string | null;
    channelId: string;
    channelName: string | null;
    requesterId: string;
    requesterName: string | null;
    voiceRoomId: string | null;
    voiceRoomName: string | null;
    reason: string;
    durationSeconds: number;
    requestedAt: string;
    startedAt: string;
    finishedAt: string;
    stoppedEarly: boolean;
    participants: RecordingArchiveParticipant[];
    segments: RecordingArchiveSegment[];
}