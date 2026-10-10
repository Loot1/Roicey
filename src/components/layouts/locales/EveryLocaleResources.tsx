import { Outlet } from 'react-router'
import english from '../../../config/locales/en'
import french from '../../../config/locales/fr'
import { registerLocaleResources } from '../../../config/i18n'

// The dashboard and the catch-all live at a single URL each, so the language
// comes from the visitor's stored preference rather than from the path: both
// locales have to be available. They are private or unindexed pages, which is
// why they can afford to carry the two.
registerLocaleResources('fr', french)
registerLocaleResources('en', english)

/** Pathless route: it carries the locales' strings, not a layout. */
export default function EveryLocaleResources() {
    return <Outlet />
}
