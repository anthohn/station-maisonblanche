import { ImageResponse } from 'next/og';
import { ADVENT } from '@/lib/advent-shared';

/**
 * Image affichée quand le lien est partagé (WhatsApp, Facebook, iMessage…).
 * Générée à la volée : une grille de portes sous un ciel de nuit.
 */

export const alt = `Calendrier de l’Avent ${ADVENT.year} · Station-Service Maison-Blanche`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Mêmes teintes que les portes de la page (voir toneFor dans lib/advent.ts).
const TONES = [
    ['#1f8a60', '#0a3a29'], // pine
    ['#cf3a42', '#6f1020'], // crimson
    ['#4767b8', '#15235a'], // midnight
    ['#e0952a', '#86420a'], // ochre
    ['#9a48a6', '#3b1248'], // plum
];

const DOORS = Array.from({ length: 24 }, (_, i) => {
    const day = i + 1;
    return day === 24
        ? { day, a: '#fde9a2', b: '#d98a12', ink: '#4a2504' }
        : { day, a: TONES[(day * 2) % 5][0], b: TONES[(day * 2) % 5][1], ink: '#fff4d6' };
});

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 72px',
                    color: '#f8fafc',
                    backgroundColor: '#0c1530',
                    backgroundImage:
                        'radial-gradient(ellipse at 50% -10%, rgba(251,191,36,0.28), rgba(251,191,36,0) 60%), radial-gradient(circle at 92% 70%, rgba(99,102,241,0.25), rgba(99,102,241,0) 55%), linear-gradient(180deg, #0c1530, #0a1020)',
                }}
            >
                {/* Texte */}
                <div style={{ display: 'flex', flexDirection: 'column', width: 600 }}>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 26,
                            letterSpacing: 6,
                            fontWeight: 700,
                            color: '#fcd34d',
                            textTransform: 'uppercase',
                        }}
                    >
                        Calendrier de l’Avent {ADVENT.year}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 26,
                            fontSize: 76,
                            lineHeight: 1.05,
                            fontWeight: 800,
                            letterSpacing: -2,
                        }}
                    >
                        <span style={{ display: 'flex' }}>Chaque matin,</span>
                        <span style={{ display: 'flex', color: '#fcd34d' }}>une porte s’ouvre</span>
                        <span style={{ display: 'flex' }}>à la station.</span>
                    </div>
                    <div style={{ display: 'flex', marginTop: 34, fontSize: 28, color: '#cbd5e1' }}>
                        Station-Service Maison-Blanche · Chancy
                    </div>
                </div>

                {/* Grille de portes */}
                <div style={{ display: 'flex', flexWrap: 'wrap', width: 392, justifyContent: 'space-between', rowGap: 12 }}>
                    {DOORS.map((door) => (
                        <div
                            key={door.day}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 86,
                                height: 78,
                                borderRadius: 12,
                                fontSize: 38,
                                fontWeight: 800,
                                color: door.ink,
                                backgroundImage: `linear-gradient(158deg, ${door.a}, ${door.b})`,
                                boxShadow: '0 8px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
                            }}
                        >
                            {door.day}
                        </div>
                    ))}
                </div>
            </div>
        ),
        { ...size },
    );
}
