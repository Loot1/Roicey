interface GuildChannelOption {
    id: string
    name: string
}

interface GuildRoleOption {
    id: string
    name: string
    color: string
}

export interface GuildDashboardOptions {
    categories: GuildChannelOption[]
    voiceChannels: GuildChannelOption[]
    logChannels: GuildChannelOption[]
    roles: GuildRoleOption[]
}