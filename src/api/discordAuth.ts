import axios from 'axios'
import type { DashboardRecordRestriction, DashboardRecording, DiscordGuild, DiscordUser, FeaturedServer, GuildDashboardConfigInput, GuildDashboardOptions } from '../types'

const AUTH_CHANGED_EVENT = 'voicey-auth-changed'

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

interface GuildDashboardConfig {
    guildId: string
    categoryId: string | null
    createChannelId: string | null
    modChannelId: string | null
    defaultMaxMembers: number
    defaultRecordingDurationSeconds: number
    adminRolesIds: string[]
}

interface GuildOptionsResponse {
    options: GuildDashboardOptions
}

interface FeaturedServersResponse {
    servers: FeaturedServer[]
}

interface ResolveRecordingResponse {
    recording: DashboardRecording
}

interface GuildRecordRestrictionsResponse {
    restrictions: DashboardRecordRestriction[]
}

interface GuildRecordRestrictionResponse {
    restriction: DashboardRecordRestriction
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

export async function getGuildDashboardRecordRestrictions(guildId: string): Promise<DashboardRecordRestriction[]> {
    const { data } = await discordApi.get<GuildRecordRestrictionsResponse>(`/api/dashboard/guilds/${guildId}/record-restrictions`)
    return data.restrictions
}

export async function deleteGuildDashboardRecordRestriction(guildId: string, restrictionId: number): Promise<DashboardRecordRestriction> {
    const { data } = await discordApi.delete<GuildRecordRestrictionResponse>(`/api/dashboard/guilds/${guildId}/record-restrictions/${restrictionId}`)
    return data.restriction
}

export async function resolveDashboardRecordingSource(source: string): Promise<DashboardRecording> {
    const { data } = await discordApi.post<ResolveRecordingResponse>('/api/dashboard/recordings/resolve', { source })
    return data.recording
}

export async function downloadRecordingSourceUserMix(source: string, userId: string): Promise<Blob> {
    const { data } = await discordApi.post(`/api/dashboard/recordings/users/${userId}/mix`, {
        source,
    }, {
        responseType: 'blob',
    })

    return data
}

export async function downloadRecordingSourceMix(source: string, excludedUserIds: string[] = []): Promise<Blob> {
    const { data } = await discordApi.post('/api/dashboard/recordings/mix', {
        source,
        excludedUserIds,
    }, {
        responseType: 'blob',
    })

    return data
}
export async function getFeaturedServers(): Promise<FeaturedServer[]> {
    const { data } = await discordApi.get<FeaturedServersResponse>('/api/public/featured-servers')
    return data.servers
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
