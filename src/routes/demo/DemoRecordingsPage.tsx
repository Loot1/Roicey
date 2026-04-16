import { ArrowDownTrayIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import { DashboardPageHeader, DashboardStateCard } from '../../components'

export function DemoRecordingsPage() {
    const timeline = [
        'Une session est capturée selon la fenêtre définie par l\'administrateur.',
        'Les pistes utiles sont préparées pour lecture ou export depuis le dashboard.',
        'Un modérateur peut rejouer, télécharger ou vérifier le contexte d\'une session.',
    ]

    return (
        <>
            <DashboardPageHeader
                title="Démo"
                description="Aperçu du parcours de consultation d'un enregistrement : capture, préparation des pistes et restitution côté dashboard."
            />

            <section className="grid gap-6 bg-base-100 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <DashboardStateCard className="border border-base-300 bg-base-100 shadow-sm">
                    <SpeakerWaveIcon className="mb-4 h-8 w-8 text-accent" />
                    <h2 className="text-lg font-bold">Lecture centralisée</h2>
                    <p className="mt-2 text-sm leading-6 text-base-content/72">
                        Le dashboard rassemble les données d'une session pour une relecture plus claire côté modération.
                    </p>
                    <button className="btn btn-outline btn-sm mt-5 w-fit">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Export de démonstration
                    </button>
                </DashboardStateCard>

                <div className="rounded-box border border-base-300 bg-base-200/35 p-6">
                    <h2 className="text-2xl font-black">Parcours type</h2>
                    <div className="mt-6 space-y-4">
                        {timeline.map((item, index) => (
                            <div key={item} className="flex gap-4 rounded-xl border border-base-300/70 bg-base-100 p-4">
                                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent/15 font-black text-accent">
                                    {index + 1}
                                </div>
                                <p className="text-sm leading-6 text-base-content/75">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}