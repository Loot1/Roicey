import frCommon from './locales/fr/common.json'
import frDocs from './locales/fr/docs.json'
import frSeo from './locales/fr/seo.json'
import enCommon from './locales/en/common.json'
import enDocs from './locales/en/docs.json'
import enSeo from './locales/en/seo.json'
import {
    OG_IMAGE_PATHS,
    ROICEY_GITHUB_URL,
    SITE_NAME,
    SITE_URL,
    VOICEY_HELP_DISCORD_URL,
    canonicalUrl,
    type Locale,
    type SeoRoute,
} from './seoRoutes'

/**
 * JSON-LD built from the locale files rather than from literals, so the markup
 * can never describe something the page does not actually show -- which is what
 * Google checks when it validates structured data.
 */

const MESSAGES = {
    fr: { common: frCommon, docs: frDocs, seo: frSeo.seo },
    en: { common: enCommon, docs: enDocs, seo: enSeo.seo },
}

/** Route id -> the `docs.<key>` block holding that page's own title. */
const DOCS_TITLE_KEYS: Record<string, keyof typeof enDocs.docs> = {
    docs: 'gettingStarted',
    docsCommands: 'commands',
    docsRecording: 'recording',
    docsSettings: 'settings',
    docsModeration: 'moderation',
    docsFaq: 'faq',
}

type JsonLd = Record<string, unknown>

function softwareApplication(locale: Locale): JsonLd {
    const { seo } = MESSAGES[locale]

    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        url: canonicalUrl('/', locale),
        description: seo.home.description,
        applicationCategory: 'CommunicationApplication',
        operatingSystem: 'Discord',
        inLanguage: locale,
        image: `${SITE_URL}${OG_IMAGE_PATHS[locale]}`,
        author: { '@type': 'Person', name: 'Loot1' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        sameAs: [ROICEY_GITHUB_URL, VOICEY_HELP_DISCORD_URL],
    }
}

function faqEntries(locale: Locale, routeId: string) {
    const { common, docs } = MESSAGES[locale]

    if (routeId === 'home') {
        const faq = common.home.setup.faq as Record<string, string>
        return [1, 2, 3].map((n) => ({ question: faq[`q${n}`], answer: faq[`a${n}`] }))
    }

    const faq = docs.docs.faq as Record<string, string>
    const entries: { question: string; answer: string }[] = []

    for (let n = 0; faq[`q${n}Title`]; n += 1) {
        // Two answers are split around an inline <code> command in the page.
        const answer = faq[`q${n}Text`]
            ?? [faq[`q${n}TextPre`], faq[`q${n}Command`], faq[`q${n}TextPost`]].filter(Boolean).join(' ')

        entries.push({ question: faq[`q${n}Title`], answer })
    }

    return entries
}

function faqPage(locale: Locale, routeId: string): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: locale,
        mainEntity: faqEntries(locale, routeId).map(({ question, answer }) => ({
            '@type': 'Question',
            // The page renders the emoji prefix too; the markup must match it.
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
    }
}

function breadcrumb(locale: Locale, route: SeoRoute): JsonLd {
    const { docs, seo } = MESSAGES[locale]

    const trail = [
        { name: seo.breadcrumbHome, item: canonicalUrl('/', locale) },
        { name: seo.breadcrumbDocs, item: canonicalUrl('/docs', locale) },
    ]

    if (route.id !== 'docs') {
        trail.push({
            name: (docs.docs[DOCS_TITLE_KEYS[route.id]] as { title: string }).title,
            item: canonicalUrl(route.path, locale),
        })
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((entry, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: entry.name,
            item: entry.item,
        })),
    }
}

/** Returns the JSON-LD objects a given route declares in the route table. */
export function structuredDataFor(route: SeoRoute, locale: Locale): JsonLd[] {
    return (route.structuredData ?? []).map((kind) => {
        switch (kind) {
            case 'softwareApplication':
                return softwareApplication(locale)
            case 'faq':
                return faqPage(locale, route.id)
            case 'breadcrumb':
                return breadcrumb(locale, route)
        }
    })
}
