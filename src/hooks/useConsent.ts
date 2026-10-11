import { useContext } from 'react'
import { ConsentContext } from '../contexts/ConsentContext'

export function useConsent() {
    const value = useContext(ConsentContext)
    if (!value) {
        throw new Error('useConsent must be used within ConsentProvider')
    }

    return value
}
