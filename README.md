# Roicey - Web Dashboard

Complete web interface to manage and configure the Discord bot [Voicey](https://github.com/voicey). Roicey provides an intuitive user experience for managing Discord servers and voice channel management bot settings.

> Note: Voicey is unfortunately not open source.

## 🚀 Features

- **Intuitive Dashboard** - Modern interface to manage your Discord servers
- **Guild Management** - Full control over per-server configurations
- **Integrated Documentation** - FAQs, getting started guides, and command documentation
- **Discord OAuth Authentication** - Secure login via Discord
- **Responsive Design** - Interface adapted for all devices

## 📋 Prerequisites

- Node.js 18+
- npm or pnpm
- A running Voicey server
- Configured environment variables

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Roicey
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
mkdir .env
cp .env/.env.example .env/.env.dev
cp .env/.env.example .env/.env.prod
# Edit both files with your configuration
```

## ⚙️ Configuration

Environment variables currently used by the frontend:

- `VITE_API_URL` - Voicey API server URL (defaults to `http://localhost:3001` if not set)

Vite environment files used in this project:

- `.env/.env.dev` for local development
- `.env/.env.prod` for production builds, including GitHub Pages deployments
- `.env/.env.example` as the template

Vite is configured with `envDir: '.env'`, so it loads files from the `.env/` directory instead of the project root.

When you run `npm run dev`, Vite starts in `dev` mode and loads `.env/.env.dev`.

When you run `npm run build`, Vite builds in `prod` mode and loads `.env/.env.prod`.

`npm run deploy` now runs `npm run build` first, then publishes `dist/client/` to GitHub Pages. GitHub Pages does not choose the env file itself; the production values are already baked into the built files by Vite during `npm run build`.

For GitHub Pages, `.env/.env.prod` should point to the production API, for example `https://api.voicey.fr`.

## 🏃 Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Typecheck, bundle and prerender every route with the `prod` env file
- `npm run preview` - Preview the production build locally
- `npm run lint` - Check linting issues
- `npm run validate:i18n` - Check translation keys across locales
- `npm run deploy` - Build with `prod` env values and publish `dist/client/` to GitHub Pages

## 🔎 SEO and the build pipeline

GitHub Pages serves static files and has no SPA rewrite, so a client-rendered
app answers **404 on every URL except `/`**. The app therefore runs in React
Router's framework mode with `ssr: false` and a `prerender` list: `npm run
build` emits one real HTML file per route and language.

The result is a `dist/client/` where `/docs`, `/en/docs/faq` and every other
public URL is a genuine file that answers 200 and ships its own content,
`<title>`, description, canonical, hreflang alternates, Open Graph tags and
JSON-LD before any script runs.

Non-prerendered URLs fall back to `404.html`, which `scripts/postbuild.ts`
copies from React Router's `__spa-fallback.html`. It boots the router from
`window.location`, so no redirect dance is needed.

### One table drives everything

`src/config/seoRoutes.ts` is the single source of truth for public URLs. Four
consumers read it and cannot drift apart:

| Consumer | Role |
| --- | --- |
| `src/routes.ts` | mounts each route once per locale |
| `src/config/seoMeta.ts` | builds each page's `meta` export |
| `react-router.config.ts` | derives the list of paths to prerender |
| `scripts/postbuild.ts` | writes `sitemap.xml` |

Titles and descriptions live in `src/config/locales/<locale>/seo.json`, keyed by
route id. Adding a page means: one row in the table, one block in each locale
file, one entry in `src/routes.ts`, and `export const meta = seoMeta('<id>')` in
the route module.

### Languages

French is served unprefixed (`/docs`), English under `/en` (`/en/docs`). Public
routes are mounted once per locale from the same modules, which is why every
entry in `src/routes.ts` carries an explicit `id`.

The URL is the only source of truth for the language - no browser detection - so
a crawler always gets the language the `hreflang` tags promise. Private pages
(`/dashboard`) keep the visitor's stored preference instead.

### Images

Raster assets are committed and never rebuilt: no step of `npm run build`
touches them.

| File | Referenced by |
| --- | --- |
| `public/favicon.ico`, `favicon-32.png` | `links` export in `src/root.tsx` |
| `public/apple-touch-icon.png` | `links` export in `src/root.tsx` |
| `public/favicon-192.png`, `favicon-512.png` | `public/site.webmanifest` |
| `public/og-image-fr.jpg`, `og-image-en.jpg` | `OG_IMAGE_PATHS` in `src/config/seoRoutes.ts` |
| `src/assets/images/voicey-logo-96.webp` | `Header`, `Footer` |
| `src/assets/images/voicey-logo-640.webp` | `HomePage` hero |

All of them derive from `src/assets/images/voicey-logo.png`. Replacing the logo
means regenerating them by hand; the share cards are 1200x630 with the wordmark
and the `seo.ogTagline` string of each locale over the dark theme background.

## 📁 Project Structure

```
src/
├── root.tsx          # Document shell: <html>, head, theme bootstrap
├── routes.ts         # Route config, mounted once per locale
├── components/       # Reusable React components
│   ├── layouts/      # Layout routes (site chrome, Docs, Demo, Dashboard)
│   └── navigation/   # Header, Footer, navigation
├── routes/           # Page route modules (component + meta export)
│   ├── dashboard/    # Dashboard pages
│   └── docs/         # Documentation pages
├── config/
│   ├── seoRoutes.ts      # Public URL table: routes, locales, canonicals
│   ├── seoMeta.ts        # Builds each page's head from that table
│   ├── structuredData.ts # JSON-LD built from the locale files
│   └── locales/          # Translations, including seo.json per locale
├── contexts/         # React contexts (global state)
├── api/              # API calls and auth helpers
└── assets/           # Images, CSS, and static resources

react-router.config.ts   # ssr:false + prerender list + buildEnd hook
scripts/
└── postbuild.ts         # sitemap.xml and 404.html
```

## 🔌 Tech Stack

- **React 19** - UI library
- **TypeScript** - Static typing
- **Vite** - High-performance build tool
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **React Router (framework mode)** - Routing and static prerendering
- **Discord OAuth** - Authentication
- **Responsive Design** - Mobile-first approach

## 🤝 Support

For issues or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ for Voicey**
