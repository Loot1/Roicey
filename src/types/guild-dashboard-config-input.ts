export interface GuildDashboardConfigInput {
    categoryId: string
    createChannelId: string
    modChannelId: string
    defaultMaxMembers: number
    defaultRecordingDurationSeconds: number
    adminRolesIds: string[]
}
