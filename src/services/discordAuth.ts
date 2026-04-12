import axios from 'axios'

const AUTH_CHANGED_EVENT = 'voicey-auth-changed'

export interface DiscordUser {
    id: string
    username: string
    global_name: string | null
    avatar: string | null
    discriminator: string
    avatarUrl: string
}

export interface DiscordGuild {
    id: string
    name: string
    icon: string | null
    owner: boolean
    permissions: string
    botInGuild: boolean
    iconUrl: string | null
}

export interface GuildDashboardConfig {
    guildId: string
    categoryId: string | null
    createChannelId: string | null
    logChannelId: string | null
    defaultMaxMembers: number
    adminRolesIds: string[]
}

export interface GuildDashboardConfigInput {
    categoryId: string
    createChannelId: string
    logChannelId: string
    defaultMaxMembers: number
    adminRolesIds: string[]
}

export interface GuildChannelOption {
    id: string
    name: string
}

export interface GuildRoleOption {
    id: string
    name: string
}

export interface GuildDashboardOptions {
    categories: GuildChannelOption[]
    voiceChannels: GuildChannelOption[]
    logChannels: GuildChannelOption[]
    roles: GuildRoleOption[]
}

interface MeResponse {
    user: DiscordUser
    expiresAt: number
}

interface GuildsResponse {
    guilds: DiscordGuild[]
}

interface GuildConfigResponse {
    config: GuildDashboardConfig
}

interface GuildOptionsResponse {
    options: GuildDashboardOptions
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const discordApi = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
})

export async function startDiscordLogin(returnTo?: string): Promise<void> {
    const { data } = await discordApi.get<{ url: string }>('/api/auth/discord/url', {
        params: returnTo ? { returnTo } : undefined,
    })
    window.location.assign(data.url)
}

export async function getDiscordSession(): Promise<DiscordUser | null> {
    try {
        const { data } = await discordApi.get<MeResponse>('/api/auth/me')
        return data.user
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null
        }

        throw error
    }
}

export async function getDiscordGuilds(): Promise<DiscordGuild[]> {
    const { data } = await discordApi.get<GuildsResponse>('/api/auth/guilds')
    return data.guilds
}

export async function getDashboardGuilds(): Promise<DiscordGuild[]> {
    const { data } = await discordApi.get<GuildsResponse>('/api/dashboard/guilds')
    return data.guilds
}

export async function getGuildDashboardConfig(guildId: string): Promise<GuildDashboardConfig> {
    const { data } = await discordApi.get<GuildConfigResponse>(`/api/dashboard/guilds/${guildId}/config`)
    return data.config
}

export async function saveGuildDashboardConfig(
    guildId: string,
    config: GuildDashboardConfigInput,
): Promise<GuildDashboardConfig> {
    const { data } = await discordApi.put<GuildConfigResponse>(`/api/dashboard/guilds/${guildId}/config`, config)
    return data.config
}

export async function getGuildDashboardOptions(guildId: string): Promise<GuildDashboardOptions> {
    const { data } = await discordApi.get<GuildOptionsResponse>(`/api/dashboard/guilds/${guildId}/options`)
    return data.options
}

export async function logoutDiscord(): Promise<void> {
    await discordApi.post('/api/auth/logout')
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function onAuthChanged(listener: () => void): () => void {
    window.addEventListener(AUTH_CHANGED_EVENT, listener)
    return () => {
        window.removeEventListener(AUTH_CHANGED_EVENT, listener)
    }
}
