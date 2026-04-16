import { Cog6ToothIcon, CommandLineIcon, QuestionMarkCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

type SidebarNavigationItem = {
    id: string
    title: string
    href: string
    end?: boolean
}

type SidebarDocumentationNavigationItem = SidebarNavigationItem & {
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
        id: 'configuration',
        title: 'Configuration',
        href: '/docs/configuration',
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

export type DashboardSidebarNavigationItem = (typeof dashboardSidebarNavigation)[number]
export type DocsSidebarNavigationItem = (typeof docsSidebarNavigation)[number]