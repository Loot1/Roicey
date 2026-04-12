import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface DashboardContextType {
    selectedGuildId: string | null
    setSelectedGuildId: (guildId: string | null) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const STORAGE_KEY = 'dashboard-selected-guild'

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [selectedGuildId, setSelectedGuildId] = useState<string | null>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    useEffect(() => {
        if (selectedGuildId) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedGuildId))
            } catch {
                // Ignore localStorage errors
            }
        }
    }, [selectedGuildId])

    return (
        <DashboardContext.Provider value={{ selectedGuildId, setSelectedGuildId }}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboardGuildSelection() {
    const context = useContext(DashboardContext)
    if (!context) {
        throw new Error('useDashboardGuildSelection must be used within a DashboardProvider')
    }
    return context
}
