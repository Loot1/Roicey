export interface DiscordUser {
    id: string
    username: string
    global_name: string | null
    avatar: string | null
    discriminator: string
    avatarUrl: string
}
