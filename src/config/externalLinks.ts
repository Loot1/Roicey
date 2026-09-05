const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID

export const VOICEY_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&scope=bot%20applications.commands&permissions=70371178040336`
export { VOICEY_HELP_DISCORD_URL, ROICEY_GITHUB_URL } from './seoRoutes'