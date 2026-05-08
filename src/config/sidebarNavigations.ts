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

export const DASHBOARD_SIDEBAR_NAVIGATION = [
    {
        id: 'overview',
        title: 'dashboard.layout.nav.overview',
        href: '/dashboard',
        end: true,
    },
    {
        id: 'settings',
        title: 'dashboard.layout.nav.settings',
        href: '/dashboard/settings',
    },
    {
        id: 'logs',
        title: 'dashboard.layout.nav.logs',
        href: '/dashboard/logs',
    },
    {
        id: 'recordings',
        title: 'dashboard.layout.nav.recordings',
        href: '/dashboard/recordings',
    },
    {
        id: 'record-restrictions',
        title: 'dashboard.layout.nav.recordRestrictions',
        href: '/dashboard/record-restrictions',
    },
] satisfies SidebarNavigationItem[]

export const DOCS_SIDEBAR_NAVIGATION = [
    {
        id: 'getting-started',
        title: 'docs.layout.nav.gettingStarted',
        href: '/docs',
        icon: CommandLineIcon,
    },
    {
        id: 'commands',
        title: 'docs.layout.nav.commands',
        href: '/docs/commands',
        icon: CommandLineIcon,
    },
    {
        id: 'settings',
        title: 'docs.layout.nav.settings',
        href: '/docs/settings',
        icon: Cog6ToothIcon,
    },
    {
        id: 'moderation',
        title: 'docs.layout.nav.moderation',
        href: '/docs/moderation',
        icon: ShieldCheckIcon,
    },
    {
        id: 'recording',
        title: 'docs.layout.nav.recording',
        href: '/docs/recording',
        icon: SpeakerWaveIcon,
    },
    {
        id: 'faq',
        title: 'docs.layout.nav.faq',
        href: '/docs/faq',
        icon: QuestionMarkCircleIcon,
    },
] satisfies SidebarDocumentationNavigationItem[]

export const DEMO_SIDEBAR_NAVIGATION = [
    {
        id: 'recordings',
        title: 'dashboard.layout.nav.recordings',
        href: '/demo',
        icon: SpeakerWaveIcon,
        end: true,
    },
] satisfies SidebarDemoNavigationItem[]

export type DashboardSidebarNavigationItem = (typeof DASHBOARD_SIDEBAR_NAVIGATION)[number]
export type DocsSidebarNavigationItem = (typeof DOCS_SIDEBAR_NAVIGATION)[number]
export type DemoSidebarNavigationItem = (typeof DEMO_SIDEBAR_NAVIGATION)[number]