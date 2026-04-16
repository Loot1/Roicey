import { useState } from 'react'
import { deleteGuildRecording } from '../api/discordAuth'
import type { DashboardRecording } from '../types'
import { canDeleteRecording } from '../utils'

type DeleteRecordingResult = {
    success: boolean
    cancelled?: boolean
    errorMessage?: string
}

export function useRecordingDeletion(selectedGuildId: string | null) {
    const [deletingRecordingId, setDeletingRecordingId] = useState<number | null>(null)

    const deleteRecording = async (recording: DashboardRecording): Promise<DeleteRecordingResult> => {
        if (!selectedGuildId || !canDeleteRecording(recording)) {
            return { success: false }
        }

        const confirmed = window.confirm(`Supprimer définitivement la demande #${recording.id} et toutes ses pistes audio ?`)
        if (!confirmed) {
            return { success: false, cancelled: true }
        }

        try {
            setDeletingRecordingId(recording.id)
            await deleteGuildRecording(selectedGuildId, recording.id)
            return { success: true }
        } catch {
            return {
                success: false,
                errorMessage: "La suppression de l'enregistrement a échoué.",
            }
        } finally {
            setDeletingRecordingId((currentId) => (currentId === recording.id ? null : currentId))
        }
    }

    return {
        deleteRecording,
        deletingRecordingId,
    }
}