import axios from 'axios'
import type { DashboardRecording, DiscordGuild, DiscordUser, FeaturedServer, GuildDashboardConfigInput, GuildDashboardOptions } from '../types'

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
    logChannelId: string | null
    defaultMaxMembers: number
    adminRolesIds: string[]
}

interface GuildOptionsResponse {
    options: GuildDashboardOptions
}

interface FeaturedServersResponse {
    servers: FeaturedServer[]
}

interface GuildRecordingsResponse {
    recordings: DashboardRecording[]
}

interface GuildRecordingResponse {
    recording: DashboardRecording
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

export async function getGuildDashboardRecordings(guildId: string): Promise<DashboardRecording[]> {
    const { data } = await discordApi.get<GuildRecordingsResponse>(`/api/dashboard/guilds/${guildId}/recordings`)
    return data.recordings
}

export async function getGuildDashboardRecording(guildId: string, recordingId: number): Promise<DashboardRecording> {
    const { data } = await discordApi.get<GuildRecordingResponse>(`/api/dashboard/guilds/${guildId}/recordings/${recordingId}`)
    return data.recording
}

export async function downloadGuildRecordingFile(guildId: string, recordingId: number, fileIndex: number): Promise<Blob> {
    const { data } = await discordApi.get(`/api/dashboard/guilds/${guildId}/recordings/${recordingId}/files/${fileIndex}`, {
        responseType: 'blob',
    })

    return data
}

export async function downloadGuildRecordingUserMix(guildId: string, recordingId: number, userId: string): Promise<Blob> {
    const { data } = await discordApi.get(`/api/dashboard/guilds/${guildId}/recordings/${recordingId}/users/${userId}/mix`, {
        responseType: 'blob',
    })

    return data
}

export async function downloadGuildRecordingMix(guildId: string, recordingId: number, excludedUserIds: string[] = []): Promise<Blob> {
    const { data } = await discordApi.get(`/api/dashboard/guilds/${guildId}/recordings/${recordingId}/mix`, {
        params: excludedUserIds.length > 0 ? { excludedUserIds: excludedUserIds.join(',') } : undefined,
        responseType: 'blob',
    })

    return data
}

export async function deleteGuildRecording(guildId: string, recordingId: number): Promise<void> {
    await discordApi.delete(`/api/dashboard/guilds/${guildId}/recordings/${recordingId}`)
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
