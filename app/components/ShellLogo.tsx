import Image from 'next/image';

/**
 * Logo Shell (fichier officiel fourni par la cliente : public/shell-logo.png, fond transparent).
 * Il contient déjà son liseré blanc, donc il reste lisible sur fond clair comme sur fond sombre.
 * La taille se règle avec les classes (ex. `h-6 w-auto`) ; `decorative` le masque aux lecteurs
 * d'écran quand le texte à côté dit déjà « Shell ».
 */
export default function ShellLogo({
    className = '',
    sizes,
    priority = false,
    decorative = false,
}: {
    className?: string;
    sizes?: string;
    priority?: boolean;
    decorative?: boolean;
}) {
    return (
        <Image
            src="/shell-logo.png"
            alt={decorative ? '' : 'Logo Shell'}
            aria-hidden={decorative || undefined}
            width={650}
            height={604}
            sizes={sizes}
            priority={priority}
            className={className}
        />
    );
}
