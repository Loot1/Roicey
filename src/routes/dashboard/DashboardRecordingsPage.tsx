import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ButtonOne, DashboardAlert, DashboardPageHeader, DashboardStateCard } from '../../components'

export function DashboardRecordingsPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [source, setSource] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const prefilledSource = searchParams.get('source')
        if (prefilledSource) {
            setSource(prefilledSource)
        }
    }, [searchParams])

    const handleSearch = () => {
        const normalizedSource = source.trim()
        if (!normalizedSource) {
            setError('Colle un lien Discord de message ou une URL de pièce jointe ZIP.')
            return
        }

        setError(null)
        navigate(`/dashboard/recordings/detail?source=${encodeURIComponent(normalizedSource)}`)
    }

    return (
        <section className="space-y-0 bg-base-100">
            <DashboardPageHeader
                title="Recherche d'enregistrement"
                description="Colle un lien de message Discord ou l'URL de la pièce jointe ZIP pour ouvrir la relecture détaillée."
            />

            {error ? <DashboardAlert tone="warning" className="mx-6 mt-6 lg:mx-8">{error}</DashboardAlert> : null}

            <div className="px-6 py-4 lg:px-8">
                <DashboardStateCard className="space-y-6 p-6">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-base-content/45">Source</p>
                        <label className="flex items-center gap-3 rounded-[1.4rem] border border-base-300 bg-base-100 px-4 py-4 shadow-sm">
                            <MagnifyingGlassIcon className="h-5 w-5 text-base-content/45" />
                            <input
                                type="url"
                                value={source}
                                onChange={(event) => setSource(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        handleSearch()
                                    }
                                }}
                                className="w-full bg-transparent text-sm outline-none"
                                placeholder="https://discord.com/channels/... ou https://cdn.discordapp.com/attachments/.../recording-123.zip"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <ButtonOne label="Ouvrir le détail" Icon={ArrowTopRightOnSquareIcon} onClick={handleSearch} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-[1.25rem] border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
                            <p className="font-black uppercase tracking-[0.18em] text-base-content/45">Lien accepté</p>
                            <p className="mt-2">Le dashboard accepte un lien direct vers le message Discord contenant l'archive, ou bien l'URL de la pièce jointe ZIP elle-même.</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
                            <p className="font-black uppercase tracking-[0.18em] text-base-content/45">Astuce</p>
                            <p className="mt-2">Le bouton "Ouvrir dans le dashboard" ajouté par le bot sur le message final ouvre directement cette page avec la bonne source.</p>
                        </div>
                    </div>
                </DashboardStateCard>
            </div>
        </section>
    )
}