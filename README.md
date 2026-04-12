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
cp .env.example .env.local
# Edit .env.local with your configuration
```

## ⚙️ Configuration

Environment variables currently used by the frontend:

- `VITE_API_URL` - Voicey API server URL (defaults to `http://localhost:3001` if not set)

## 🏃 Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Check and fix linting issues

## 📁 Project Structure

```
src/
├── components/       # Reusable React components
│   ├── layouts/      # Main layouts (Dashboard, Docs, etc.)
│   └── navigation/   # Header, Footer, navigation
├── routes/           # Pages and routing
│   ├── dashboard/    # Dashboard pages
│   └── docs/         # Documentation pages
├── contexts/         # React contexts (global state)
├── api/              # API calls and auth helpers
└── assets/           # Images, CSS, and static resources
```

## 🔌 Tech Stack

- **React 19** - UI library
- **TypeScript** - Static typing
- **Vite** - High-performance build tool
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **Discord OAuth** - Authentication
- **Responsive Design** - Mobile-first approach

## 🤝 Support

For issues or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ for Voicey**
