export const headerNavigation = [
    { label: 'Accueil', href: '/', exact: true },
    { label: 'À propos', href: '/about', exact: true },
    { label: 'Documentation', href: '/docs', exact: false },
    { label: 'Démo', href: '/demo', exact: true },
    { label: 'Charte', href: '/guidelines', exact: true },
] as const

export type HeaderNavigationItem = (typeof headerNavigation)[number]