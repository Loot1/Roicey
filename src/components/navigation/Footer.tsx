import { Link } from 'react-router'
import logoSansFond from '../../assets/images/voicey-logo.png'

export function Footer() {
    return (
        <footer className="border-t border-base-300/70 bg-base-100">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                <div>
                    <img
                        src={logoSansFond}
                        alt="Logo Voicey"
                        className="mb-2 h-10 w-10 rounded-lg object-cover"
                    />
                    <p className="text-base font-black leading-tight">Voicey</p>
                    <p className="text-sm text-base-content/70">Gestion automatique de salons vocaux Discord</p>
                </div>

                <div className="flex items-center gap-2">
                    <a href="#" className="btn btn-ghost btn-circle btn-sm" title="Discord" aria-label="Discord">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.162-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 6.002 3.04a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.008-.12c.125-.093.25-.19.371-.287a.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .078.01c.12.098.246.195.371.288a.072.072 0 0 1-.006.119c-.598.35-1.225.645-1.873.893a.072.072 0 0 0-.037.099c.36.687.772 1.341 1.292 2.1a.077.077 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.04a.076.076 0 0 0 .032-.054c.5-4.506-.838-8.962-3.551-12.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.93-2.157 2.157-2.157c1.226 0 2.157.964 2.157 2.157c0 1.19-.931 2.155-2.157 2.155z"></path>
                        </svg>
                    </a>
                    <a href="#" className="btn btn-ghost btn-circle btn-sm" title="GitHub" aria-label="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                    </a>
                    <Link to="/legal" className="link link-hover ml-2 font-semibold text-base-content">
                        Mentions légales
                    </Link>
                    <span className="ml-2 text-xs text-base-content/60">© {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    )
}