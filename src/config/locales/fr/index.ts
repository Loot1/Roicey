import common from './common.json'
import docs from './docs.json'
import dashboard from './dashboard.json'
import seo from './seo.json'

/**
 * Every string this locale needs, in a single module.
 *
 * Importing it from one place lets the bundler put the whole locale in its own
 * chunk, so an unprefixed page downloads these strings and not the others.
 */
export default { ...common, ...docs, ...dashboard, ...seo }
