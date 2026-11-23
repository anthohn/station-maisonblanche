'use client';

import { HOURS, PRESETS } from '@/lib/weather';
import { setPreview, useWeatherStore, type Preview } from './weather-store';

/**
 * Barre de démonstration, visible uniquement avec `?meteo=…` ou `?heure=…` dans l'adresse (jamais pour
 * un visiteur normal) : elle permet de passer d'une ambiance à l'autre sans attendre le bon temps.
 * `?meteo=live` (ou « Quitter ») la ferme. Voir weather-store.ts pour les façons de l'ouvrir.
 */
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                active
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-orange-400 hover:text-orange-600'
            }`}
        >
            {children}
        </button>
    );
}

export default function WeatherPreviewBar() {
    const { preview } = useWeatherStore();
    if (!preview) return null;

    const choose = (patch: Partial<Preview>) => {
        setPreview({ ...preview, ...patch });
    };

    return (
        <aside
            aria-label="Aperçu météo"
            className="fixed bottom-3 left-3 z-[70] w-[min(36rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-300 bg-white p-3 shadow-xl shadow-slate-900/15"
        >
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-orange-500">Aperçu météo</p>
                <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
                >
                    Quitter l’aperçu
                </button>
            </div>
            <div className="space-y-2">
                <div role="group" aria-label="Temps" className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                    <span aria-hidden="true" className="w-11 shrink-0 text-[11px] font-semibold text-slate-400">Temps</span>
                    <Chip active={!preview.meteo} onClick={() => choose({ meteo: null })}>
                        En direct
                    </Chip>
                    {Object.entries(PRESETS).map(([key, preset]) => (
                        <Chip key={key} active={preview.meteo === key} onClick={() => choose({ meteo: key })}>
                            {preset.label}
                        </Chip>
                    ))}
                </div>
                <div role="group" aria-label="Heure" className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                    <span aria-hidden="true" className="w-11 shrink-0 text-[11px] font-semibold text-slate-400">Heure</span>
                    <Chip active={!preview.heure} onClick={() => choose({ heure: null })}>
                        {preview.meteo ? 'Selon le temps' : 'Réelle'}
                    </Chip>
                    {Object.entries(HOURS).map(([key, hour]) => (
                        <Chip key={key} active={preview.heure === key} onClick={() => choose({ heure: key })}>
                            {hour.label}
                        </Chip>
                    ))}
                </div>
            </div>
        </aside>
    );
}
