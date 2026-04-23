import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type ThemeName = 'voicey' | 'voicey-dark'

type ThemeContextValue = {
    theme: ThemeName
    isDark: boolean
    setTheme: (nextTheme: ThemeName) => void
    toggleTheme: () => void
}

const STORAGE_KEY = 'voicey-theme'
export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): ThemeName {
    if (typeof window === 'undefined') {
        return 'voicey'
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (storedTheme === 'voicey' || storedTheme === 'voicey-dark') {
        return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'voicey-dark' : 'voicey'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeName>(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.style.colorScheme = theme === 'voicey-dark' ? 'dark' : 'light'
        window.localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        isDark: theme === 'voicey-dark',
        setTheme,
        toggleTheme: () => {
            setTheme((currentTheme) => currentTheme === 'voicey-dark' ? 'voicey' : 'voicey-dark')
        },
    }), [theme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
