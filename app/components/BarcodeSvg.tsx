'use client';

import React from 'react';

interface BarcodeSvgProps {
    code: string;
    type?: 'code128' | 'ean13';
    width?: number;
    height?: number;
    className?: string;
    showText?: boolean;
}

// Table des motifs Code 128 (Largeur de chaque barre et espace)
// Indice 0-106 (105 = Start C, 106 = Stop)
const CODE128_PATTERNS = [
    '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
    '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
    '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
    '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
    '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
    '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
    '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
    '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
    '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
    '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
    '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

// Tables EAN-13
const PARITY_PATTERNS_EAN13: { [key: number]: string } = {
    0: 'LLLLLL', 1: 'LLGLGG', 2: 'LLGGLG', 3: 'LLGGGL', 4: 'LGLLGG',
    5: 'LGGLLG', 6: 'LGGGLL', 7: 'LGLGLG', 8: 'LGLGGL', 9: 'LGGLGL',
};

const ENCODINGS_EAN13: { [key: string]: { [key: number]: string } } = {
    L: {
        0: '0001101', 1: '0011001', 2: '0010011', 3: '0111101', 4: '0100011',
        5: '0110001', 6: '0101111', 7: '0111011', 8: '0110111', 9: '0001011',
    },
    G: {
        0: '0100111', 1: '0110011', 2: '0011011', 3: '0100001', 4: '0011101',
        5: '0111001', 6: '0000101', 7: '0010001', 8: '0001001', 9: '0010111',
    },
    R: {
        0: '1110010', 1: '1100110', 2: '1101100', 3: '1000010', 4: '1011100',
        5: '1001110', 6: '1010000', 7: '1000100', 8: '1001000', 9: '1110100',
    },
};

function calculateEan13Checksum(first12Digits: string): number {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(first12Digits[i], 10);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const rem = sum % 10;
    return rem === 0 ? 0 : 10 - rem;
}

/**
 * Encode une séquence de chiffres en Code 128 (Subset C : compact et haute densité pour caisses enregistreuses)
 */
function getCode128Binary(rawCode: string): { fullCode: string; binaryString: string } {
    let cleaned = rawCode.replace(/\D/g, '');
    // Pour le sous-ensemble C, il faut un nombre pair de chiffres
    if (cleaned.length % 2 !== 0) {
        cleaned = '0' + cleaned;
    }

    const pairs: number[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
        pairs.push(parseInt(cleaned.slice(i, i + 2), 10));
    }

    const startC = 105;
    const stop = 106;

    let checksum = startC;
    for (let i = 0; i < pairs.length; i++) {
        checksum += (i + 1) * pairs[i];
    }
    checksum = checksum % 103;

    const symbols = [startC, ...pairs, checksum, stop];

    let binary = '';
    for (const sym of symbols) {
        const pattern = CODE128_PATTERNS[sym];
        for (let i = 0; i < pattern.length; i++) {
            const width = parseInt(pattern[i], 10);
            const isBar = i % 2 === 0;
            binary += (isBar ? '1' : '0').repeat(width);
        }
    }

    return { fullCode: cleaned, binaryString: binary };
}

/**
 * Encode en EAN-13 classique
 */
function getEan13Binary(rawCode: string): { fullCode: string; binaryString: string } {
    const cleaned = rawCode.replace(/\D/g, '');
    let fullCode = cleaned;

    if (cleaned.length === 12) {
        const checksum = calculateEan13Checksum(cleaned);
        fullCode = cleaned + checksum;
    } else if (cleaned.length < 12) {
        const padded = cleaned.padStart(12, '0');
        const checksum = calculateEan13Checksum(padded);
        fullCode = padded + checksum;
    } else {
        fullCode = cleaned.slice(0, 13);
    }

    const firstDigit = parseInt(fullCode[0], 10);
    const parityPattern = PARITY_PATTERNS_EAN13[firstDigit] || 'LLLLLL';

    let binary = '101'; // Guard début

    // 6 chiffres de gauche
    for (let i = 0; i < 6; i++) {
        const digit = parseInt(fullCode[i + 1], 10);
        const type = parityPattern[i];
        binary += ENCODINGS_EAN13[type][digit];
    }

    binary += '01010'; // Guard centre

    // 6 chiffres de droite
    for (let i = 0; i < 6; i++) {
        const digit = parseInt(fullCode[i + 7], 10);
        binary += ENCODINGS_EAN13['R'][digit];
    }

    binary += '101'; // Guard fin

    return { fullCode, binaryString: binary };
}

export default function BarcodeSvg({
    code,
    type,
    width = 300,
    height = 125,
    className = '',
    showText = true,
}: BarcodeSvgProps) {
    // Détermination automatique du type :
    // Si explicitement défini comme code128 OU si longueur <= 11 chiffres (comme 8 chiffres) -> Code 128
    const isEan13 = type === 'ean13' || (!type && code.replace(/\D/g, '').length >= 12);

    const { fullCode, binaryString } = isEan13
        ? getEan13Binary(code)
        : getCode128Binary(code);

    // Marges de sécurité (Quiet Zones) pour assurer une lecture optique instantanée
    const quietZoneModules = isEan13 ? 10 : 12;
    const totalModules = binaryString.length + quietZoneModules * 2;
    const moduleWidth = width / totalModules;
    const barHeight = showText ? height - 32 : height - 16;
    const startX = (width - binaryString.length * moduleWidth) / 2;

    // Regrouper les barres contiguës pour un tracé vectoriel parfait sans interstice d'arrondi
    const rects: { x: number; w: number }[] = [];
    let currentBarStart: number | null = null;

    for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] === '1') {
            if (currentBarStart === null) {
                currentBarStart = i;
            }
        } else {
            if (currentBarStart !== null) {
                rects.push({
                    x: startX + currentBarStart * moduleWidth,
                    w: (i - currentBarStart) * moduleWidth,
                });
                currentBarStart = null;
            }
        }
    }
    if (currentBarStart !== null) {
        rects.push({
            x: startX + currentBarStart * moduleWidth,
            w: (binaryString.length - currentBarStart) * moduleWidth,
        });
    }

    // Format du texte lisible
    const displayText = isEan13
        ? `${fullCode[0]} ${fullCode.slice(1, 7)} ${fullCode.slice(7, 13)}`
        : fullCode;

    return (
        <div className={`flex flex-col items-center select-none ${className}`}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Fond blanc pur haute réflectance pour douchette laser/optique */}
                <rect width={width} height={height} fill="#ffffff" rx={8} />

                {/* Tracé des barres */}
                <g transform="translate(0, 8)">
                    {rects.map((r, index) => (
                        <rect
                            key={index}
                            x={r.x}
                            y={0}
                            width={r.w + 0.15}
                            height={barHeight}
                            fill="#0f172a"
                        />
                    ))}
                </g>

                {/* Texte chiffré sous le code-barres */}
                {showText && (
                    <text
                        x={width / 2}
                        y={height - 6}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontFamily="'Courier New', Courier, monospace"
                        fontSize="15"
                        fontWeight="700"
                        letterSpacing={isEan13 ? '2.5' : '3.5'}
                    >
                        {displayText}
                    </text>
                )}
            </svg>
        </div>
    );
}
