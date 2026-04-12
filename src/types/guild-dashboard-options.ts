interface GuildChannelOption {
    id: string
    name: string
}

interface GuildRoleOption {
    id: string
    name: string
}

export interface GuildDashboardOptions {
    categories: GuildChannelOption[]
    voiceChannels: GuildChannelOption[]
    logChannels: GuildChannelOption[]
    roles: GuildRoleOption[]
}
