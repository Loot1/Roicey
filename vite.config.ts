import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  envDir: '.env',
  plugins: [
    reactRouter(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/',
  define: {
    // The footer's copyright year. Taken at build time, not in the browser: the
    // prerendered HTML holds the build year, and a different year on the client
    // would fail hydration once the calendar turns.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  server: {
    port: 5173,
    open: true
  }
})
