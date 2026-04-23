export interface GuildDashboardConfigInput {
    categoryId: string
    createChannelId: string
    logChannelId: string
    defaultMaxMembers: number
    defaultRecordingDurationSeconds: number
    adminRolesIds: string[]
}
