import { Outlet } from 'react-router'
import english from '../../../config/locales/en'
import { registerLocaleResources } from '../../../config/i18n'

// Loading this route module is what puts English in the store, and the bundler
// keeps the strings in this module's chunk. See src/config/i18n.ts.
registerLocaleResources('en', english)

/** Pathless route: it carries a locale's strings, not a layout. */
export default function EnglishResources() {
    return <Outlet />
}
