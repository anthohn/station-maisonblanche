'use client';

import { Check, Lock } from 'lucide-react';
import type { DoorView } from '@/lib/advent-shared';
import DoorIcon from './DoorIcon';

interface AdventDoorProps {
    view: DoorView;
    opened: boolean;
    shake: boolean;
    onSelect: (day: number) => void;
}

/**
 * Une porte du calendrier.
 *
 * États visuels (pilotés en CSS par les attributs `data-*`) :
 *  - verrouillée   : teinte éteinte, cadenas, date d'ouverture (jour à venir) ;
 *  - du jour       : halo qui pulse, battant qui « fait signe » ;
 *  - ouverte       : battant ouvert à 106°, on voit l'icône du contenu ;
 *  - passée        : teinte éteinte, définitivement fermée (jour écoulé) ;
 *                    une coche dorée si le visiteur l'avait ouverte ce jour-là.
 */
export default function AdventDoor({ view, opened, shake, onSelect }: AdventDoorProps) {
    const locked = view.state === 'locked';
    const past = view.state === 'past';
    const isToday = view.state === 'today';
    const icon = view.state === 'today' ? view.content.icon : null;
    // Seule la porte du jour peut être « ouverte » : une porte passée reste fermée.
    const isOpen = isToday && opened;

    const label = locked
        ? `Porte ${view.day}, verrouillée jusqu’au ${view.dateLabel.toLowerCase()}`
        : past
          ? `Porte ${view.day}, ${opened ? 'ouverte le jour même, ' : ''}plus disponible`
          : isOpen
            ? `Porte ${view.day}, ouverte. Revoir la surprise`
            : `Porte ${view.day}, la porte du jour. Ouvrir`;

    return (
        <div
            className="adv-door"
            data-tone={view.tone}
            data-state={view.state}
            data-opened={isOpen}
            data-done={past && opened}
            data-today={isToday}
            data-shake={shake}
        >
            <button type="button" className="adv-door__btn" onClick={() => onSelect(view.day)} aria-label={label}>
                {/* Intérieur lumineux */}
                <span className="adv-door__inside" aria-hidden="true">
                    {isOpen && icon && (
                        <span className="adv-door__medal">
                            <DoorIcon name={icon} size="58%" strokeWidth={1.7} />
                        </span>
                    )}
                </span>

                {/* Battant */}
                <span className="adv-door__leaf" aria-hidden="true">
                    <span className="adv-door__face adv-door__front">
                        <span className="adv-door__frame" />
                        <span className="adv-door__orn">✦</span>
                        <span className="adv-door__num adv-serif">{view.day}</span>
                        <span className="adv-door__knob" />

                        {locked && <Lock className="adv-door__lock" strokeWidth={2.2} />}
                        {past && opened && <Check className="adv-door__lock text-amber-300" strokeWidth={3} />}

                        {(locked || past) && <span className="adv-door__foot">{view.shortDate}</span>}
                        {isToday && !opened && <span className="adv-door__foot">Aujourd’hui</span>}
                    </span>
                    <span className="adv-door__face adv-door__back" />
                </span>
            </button>
        </div>
    );
}
