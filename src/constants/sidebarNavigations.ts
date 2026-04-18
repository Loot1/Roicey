import { Cog6ToothIcon, CommandLineIcon, QuestionMarkCircleIcon, ShieldCheckIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'

type SidebarNavigationItem = {
    id: string
    title: string
    href: string
    end?: boolean
}

type SidebarDocumentationNavigationItem = SidebarNavigationItem & {
    icon: typeof CommandLineIcon
}

type SidebarDemoNavigationItem = SidebarNavigationItem & {
    icon: typeof CommandLineIcon
}

export const dashboardSidebarNavigation = [
    {
        id: 'overview',
        title: "Vue d'ensemble",
        href: '/dashboard',
        end: true,
    },
    {
        id: 'settings',
        title: 'Configuration',
        href: '/dashboard/settings',
    },
    {
        id: 'logs',
        title: 'Logs',
        href: '/dashboard/logs',
    },
    {
        id: 'recordings',
        title: 'Enregistrements',
        href: '/dashboard/recordings',
    },
    {
        id: 'record-restrictions',
        title: 'Bannissement des enregistrements',
        href: '/dashboard/record-restrictions',
    },
] satisfies SidebarNavigationItem[]

export const docsSidebarNavigation = [
    {
        id: 'getting-started',
        title: 'Démarrage rapide',
        href: '/docs',
        icon: CommandLineIcon,
    },
    {
        id: 'commands',
        title: 'Commandes',
        href: '/docs/commands',
        icon: CommandLineIcon,
    },
    {
        id: 'settings',
        title: 'Configuration',
        href: '/docs/settings',
        icon: Cog6ToothIcon,
    },
    {
        id: 'moderation',
        title: 'Modération',
        href: '/docs/moderation',
        icon: ShieldCheckIcon,
    },
    {
        id: 'faq',
        title: 'FAQ',
        href: '/docs/faq',
        icon: QuestionMarkCircleIcon,
    },
] satisfies SidebarDocumentationNavigationItem[]

export const demoSidebarNavigation = [
    {
        id: 'recordings',
        title: 'Enregistrements',
        href: '/demo',
        icon: SpeakerWaveIcon,
        end: true,
    },
] satisfies SidebarDemoNavigationItem[]

export type DashboardSidebarNavigationItem = (typeof dashboardSidebarNavigation)[number]
export type DocsSidebarNavigationItem = (typeof docsSidebarNavigation)[number]
export type DemoSidebarNavigationItem = (typeof demoSidebarNavigation)[number]