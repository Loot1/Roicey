import { useContext } from 'react'
import { DashboardContext } from '../contexts/DashboardContext'

export function useDashboardGuildSelection() {
    const context = useContext(DashboardContext)
    if (!context) {
        throw new Error('useDashboardGuildSelection must be used within a DashboardProvider')
    }

    return context
}