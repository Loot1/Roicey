import { Link } from 'react-router'

export function NotFoundPage() {
    return (
        <section className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,90,90,0.12),_transparent_45%),linear-gradient(180deg,_rgba(18,22,32,0.02),_transparent)] px-6 py-16 lg:px-10">
            <div className="max-w-2xl rounded-[2rem] border border-base-300 bg-base-100/95 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-base-content/45">Erreur 404</p>
                <h1 className="mt-3 text-5xl font-black tracking-tight">Ce coin du site s'est volatilisé.</h1>
                <p className="mt-4 text-base leading-7 text-base-content/70">
                    On a cherché partout, même derrière le bouton mute, mais cette page a visiblement quitté le vocal sans prévenir.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
                    <Link to="/dashboard" className="btn btn-ghost border border-base-300">Ouvrir le dashboard</Link>
                </div>
            </div>
        </section>
    )
}