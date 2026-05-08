export const HEADER_NAVIGATION = [
    { label: 'nav.home', href: '/', exact: true },
    { label: 'nav.about', href: '/about', exact: true },
    { label: 'nav.docs', href: '/docs', exact: false },
    { label: 'nav.demo', href: '/demo', exact: true },
    { label: 'nav.guidelines', href: '/guidelines', exact: true },
] as const

export type HeaderNavigationItem = (typeof HEADER_NAVIGATION)[number]