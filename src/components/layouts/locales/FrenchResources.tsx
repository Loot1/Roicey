import { Outlet } from 'react-router'
import french from '../../../config/locales/fr'
import { registerLocaleResources } from '../../../config/i18n'

// Loading this route module is what puts French in the store, and the bundler
// keeps the strings in this module's chunk. See src/config/i18n.ts.
registerLocaleResources('fr', french)

/** Pathless route: it carries a locale's strings, not a layout. */
export default function FrenchResources() {
    return <Outlet />
}
