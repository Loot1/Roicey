export interface DashboardRecordRestriction {
    id: number
    userId: string
    userName: string | null
    userAvatarUrl: string | null
    executorId: string
    executorName: string | null
    reason: string | null
    createdAt: string
}