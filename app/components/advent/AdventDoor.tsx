'use client';

import { Lock } from 'lucide-react';
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
 *  - verrouillée   : teinte éteinte, cadenas, date d'ouverture ;
 *  - du jour       : halo qui pulse, battant qui « fait signe » ;
 *  - à ouvrir      : disponible mais pas encore ouverte (pastille dorée) ;
 *  - ouverte       : battant ouvert à 106°, on voit l'icône du contenu.
 */
export default function AdventDoor({ view, opened, shake, onSelect }: AdventDoorProps) {
    const locked = view.state === 'locked';
    const isToday = view.state === 'unlocked' && view.isToday;
    const icon = view.state === 'unlocked' ? view.content.icon : null;

    const label = locked
        ? `Porte ${view.day}, verrouillée jusqu’au ${view.dateLabel.toLowerCase()}`
        : opened
          ? `Porte ${view.day}, ouverte. Revoir la surprise`
          : isToday
            ? `Porte ${view.day}, la porte du jour. Ouvrir`
            : `Porte ${view.day}, disponible. Ouvrir`;

    return (
        <div
            className="adv-door"
            data-tone={view.tone}
            data-state={view.state}
            data-opened={opened}
            data-today={isToday}
            data-shake={shake}
        >
            <button type="button" className="adv-door__btn" onClick={() => onSelect(view.day)} aria-label={label}>
                {/* Intérieur lumineux */}
                <span className="adv-door__inside" aria-hidden="true">
                    {opened && icon && (
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
                        {!locked && !opened && !isToday && <span className="adv-door__dot" />}

                        {locked && <span className="adv-door__foot">{view.shortDate}</span>}
                        {isToday && !opened && <span className="adv-door__foot">Aujourd’hui</span>}
                    </span>
                    <span className="adv-door__face adv-door__back" />
                </span>
            </button>
        </div>
    );
}
