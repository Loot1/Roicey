export function LegalPage() {
    return (
        <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
            <h1 className="mb-8 text-4xl font-bold">Mentions légales</h1>
            
            <div className="prose prose-sm max-w-none space-y-8">
                {/* Éditeur */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Éditeur</h2>
                    <p className="text-base-content/80">
                        Voicey est un service de gestion de salons vocaux Discord développé par une équipe 
                        indépendante de développeurs. Le service est fourni tel quel, sans garantie d'absence 
                        de bugs ou d'interruptions de service.
                    </p>
                </section>

                {/* Conditions d'utilisation */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Conditions d'utilisation</h2>
                    <p className="mb-3 text-base-content/80">
                        En utilisant Voicey, vous acceptez les conditions suivantes :
                    </p>
                    <ul className="list-inside space-y-2 text-base-content/80">
                        <li>✓ L'utilisation doit être conforme aux Conditions d'utilisation de Discord</li>
                        <li>✓ Pas d'activités illicites, frauduleuses ou malveillantes</li>
                        <li>✓ Respect des droits d'auteur et de la propriété intellectuelle</li>
                        <li>✓ Pas de spam, harcèlement ou contenu offensant</li>
                        <li>✓ Pas de tentative de contourner les limitations du service</li>
                    </ul>
                </section>

                {/* Politique de confidentialité */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Politique de confidentialité</h2>
                    <p className="mb-3 text-base-content/80">
                        Voicey respecte votre vie privée :
                    </p>
                    <ul className="list-inside space-y-2 text-base-content/80">
                        <li>• Les données collectées sont stockées de manière sécurisée</li>
                        <li>• Vos données ne sont jamais vendues à des tiers</li>
                        <li>• Les logs de modération sont conservés conformément à la RGPD</li>
                        <li>• Vous pouvez demander la suppression de vos données à tout moment</li>
                        <li>• Seules les données nécessaires au fonctionnement sont collectées</li>
                    </ul>
                </section>

                {/* Responsabilité */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Limitation de responsabilité</h2>
                    <p className="text-base-content/80">
                        Voicey est fourni "en l'état". Nous ne pouvons pas garantir :
                    </p>
                    <ul className="list-inside space-y-2 text-base-content/80">
                        <li>• L'absence complète de bugs ou d'erreurs</li>
                        <li>• Une disponibilité à 100% du service</li>
                        <li>• L'absence d'interruptions de service</li>
                        <li>• L'absence de perte de données</li>
                    </ul>
                    <p className="mt-3 text-base-content/80">
                        Nous ne sommes pas responsables des dommages directs, indirects, incident, spéciaux ou 
                        consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser Voicey.
                    </p>
                </section>

                {/* Suspension de service */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Suspension et résiliation</h2>
                    <p className="text-base-content/80">
                        Nous nous réservons le droit de :
                    </p>
                    <ul className="list-inside space-y-2 text-base-content/80">
                        <li>• Refuser l'accès au service sans préavis</li>
                        <li>• Suspendre le service pour maintenance ou raisons de sécurité</li>
                        <li>• Résilier l'accès en cas de non-respect des conditions</li>
                        <li>• Modifier les fonctionnalités du service</li>
                    </ul>
                </section>

                {/* Affiliation Discord */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Affiliation et marques</h2>
                    <p className="text-base-content/80">
                        Voicey est un service tiers <strong>non affilié</strong> à Discord, Inc. Discord est une 
                        marque déposée de Discord, Inc. L'utilisation de Voicey est soumise à la fois à ces 
                        conditions et aux Conditions d'utilisation et Politique de confidentialité de Discord.
                    </p>
                </section>

                {/* Modifications */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Modifications des conditions</h2>
                    <p className="text-base-content/80">
                        Ces conditions peuvent être modifiées à tout moment. Les modifications deviendront 
                        effectives lors de leur publication sur ce site. L'utilisation continue du service 
                        après les modifications constitue l'acceptation des nouvelles conditions.
                    </p>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">Contact</h2>
                    <p className="text-base-content/80">
                        Pour toute question concernant ces mentions légales, veuillez nous contacter via :
                    </p>
                    <ul className="list-inside space-y-1 text-base-content/80">
                        <li>• Discord Server de support</li>
                        <li>• GitHub Issues</li>
                        <li>• Email : support@voicey.app</li>
                    </ul>
                </section>

                {/* Dernière mise à jour */}
                <div className="rounded-lg border border-base-300 bg-base-200/30 p-4">
                    <p className="text-sm text-base-content/70">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>
        </main>
    )
}
