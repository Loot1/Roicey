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
    logChannelId: string | null
    defaultMaxMembers: number
    defaultRecordingDurationSeconds: number
    adminRolesIds: string[]
}

interface GuildOptionsResponse {
    options: GuildDashboardOptions
}

interface PublicStatsResponse {
    servers: FeaturedServer[]
    stats: {
        createdVoiceRoomsToday: number
        totalVoiceRooms?: number
        totalActiveServers?: number
        nonFeaturedActiveServers: number
    }
}

export interface PublicHomeStats {
    servers: FeaturedServer[]
    stats: {
        createdVoiceRoomsToday: number
        totalVoiceRooms: number
        totalActiveServers: number
        nonFeaturedActiveServers: number
    }
}

let publicHomeStatsCache: PublicHomeStats | null = null
let publicHomeStatsInflight: Promise<PublicHomeStats> | null = null

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

/**
 * The API client is `fetch`, not a library.
 *
 * `<Header>` probes the session on every page, so whatever this module imports
 * is downloaded on the home page, the docs and the legal pages alike. The four
 * things axios was doing here -- a base URL, cookies, JSON, throwing on a
 * non-2xx -- are a dozen lines, against ~16 kB gzipped on every visit.
 */
export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    /** Serialised as a JSON body. */
    body?: unknown
    params?: Record<string, string>
}

async function request(path: string, { method = 'GET', body, params }: RequestOptions = {}): Promise<Response> {
    const url = new URL(`${apiBaseUrl}${path}`)

    for (const [key, value] of Object.entries(params ?? {})) {
        url.searchParams.set(key, value)
    }

    const response = await fetch(url, {
        method,
        // The Discord session lives in a cookie set by the API.
        credentials: 'include',
        headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (!response.ok) {
        throw new ApiError(response.status, `${method} ${path} answered ${response.status}`)
    }

    return response
}

async function requestJson<T>(path: string, options?: RequestOptions): Promise<T> {
    return await (await request(path, options)).json() as T
}

async function requestBlob(path: string, options?: RequestOptions): Promise<Blob> {
    return await (await request(path, options)).blob()
}

export async function startDiscordLogin(returnTo?: string): Promise<void> {
    const data = await requestJson<{ url: string }>('/auth/discord/url', {
        params: returnTo ? { returnTo } : undefined,
    })
    window.location.assign(data.url)
}

export async function getDiscordSession(): Promise<DiscordUser | null> {
    try {
        const data = await requestJson<MeResponse>('/auth/me')
        return data.user
    } catch (error) {
        // Signed out is an answer, not a failure.
        if (error instanceof ApiError && error.status === 401) {
            return null
        }

        throw error
    }
}

export async function getDiscordGuilds(): Promise<DiscordGuild[]> {
    const data = await requestJson<GuildsResponse>('/auth/guilds')
    return data.guilds
}

export async function getDashboardGuilds(): Promise<DiscordGuild[]> {
    const data = await requestJson<GuildsResponse>('/dashboard/guilds')
    return data.guilds
}

export async function getGuildDashboardConfig(guildId: string): Promise<GuildDashboardConfig> {
    const data = await requestJson<GuildConfigResponse>(`/dashboard/guilds/${guildId}/config`)
    return data.config
}

export async function saveGuildDashboardConfig(
    guildId: string,
    config: GuildDashboardConfigInput,
): Promise<GuildDashboardConfig> {
    const data = await requestJson<GuildConfigResponse>(`/dashboard/guilds/${guildId}/config`, { method: 'PUT', body: config })
    return data.config
}

export async function getGuildDashboardOptions(guildId: string): Promise<GuildDashboardOptions> {
    const data = await requestJson<GuildOptionsResponse>(`/dashboard/guilds/${guildId}/options`)
    return data.options
}

export async function getGuildDashboardRecordRestrictions(guildId: string): Promise<DashboardRecordRestriction[]> {
    const data = await requestJson<GuildRecordRestrictionsResponse>(`/dashboard/guilds/${guildId}/record-restrictions`)
    return data.restrictions
}

export async function deleteGuildDashboardRecordRestriction(guildId: string, restrictionId: number): Promise<DashboardRecordRestriction> {
    const data = await requestJson<GuildRecordRestrictionResponse>(`/dashboard/guilds/${guildId}/record-restrictions/${restrictionId}`, { method: 'DELETE' })
    return data.restriction
}

export async function resolveDashboardRecordingSource(source: string): Promise<DashboardRecording> {
    const data = await requestJson<ResolveRecordingResponse>('/dashboard/recordings/resolve', { method: 'POST', body: { source } })
    return data.recording
}

export async function downloadRecordingSourceUserMix(source: string, userId: string): Promise<Blob> {
    return await requestBlob(`/dashboard/recordings/users/${userId}/mix`, {
        method: 'POST',
        body: { source },
    })
}

export async function downloadRecordingSourceMix(source: string, excludedUserIds: string[] = []): Promise<Blob> {
    return await requestBlob('/dashboard/recordings/mix', {
        method: 'POST',
        body: { source, excludedUserIds },
    })
}

export async function getPublicStats(): Promise<PublicHomeStats> {
    if (publicHomeStatsCache) {
        return publicHomeStatsCache
    }

    if (!publicHomeStatsInflight) {
        publicHomeStatsInflight = requestJson<PublicStatsResponse>('/public/stats')
            .then((data) => {
                const normalizedData: PublicHomeStats = {
                    servers: data.servers,
                    stats: {
                        createdVoiceRoomsToday: data.stats.createdVoiceRoomsToday,
                        totalVoiceRooms: data.stats.totalVoiceRooms ?? data.stats.createdVoiceRoomsToday,
                        totalActiveServers: data.stats.totalActiveServers ?? data.servers.length + data.stats.nonFeaturedActiveServers,
                        nonFeaturedActiveServers: data.stats.nonFeaturedActiveServers,
                    },
                }

                publicHomeStatsCache = normalizedData
                return normalizedData
            })
            .finally(() => {
                publicHomeStatsInflight = null
            })
    }

    return publicHomeStatsInflight
}

export async function logoutDiscord(): Promise<void> {
    await request('/auth/logout', { method: 'POST' })
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function onAuthChanged(listener: () => void): () => void {
    window.addEventListener(AUTH_CHANGED_EVENT, listener)
    return () => {
        window.removeEventListener(AUTH_CHANGED_EVENT, listener)
    }
}
