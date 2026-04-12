import type { DiscordGuild } from './discord-guild'
import type { DiscordUser } from './discord-user'

export interface DashboardLayoutContextValue {
    selectedGuild: DiscordGuild | null
    selectedGuildId: string | null
    user: DiscordUser
}
