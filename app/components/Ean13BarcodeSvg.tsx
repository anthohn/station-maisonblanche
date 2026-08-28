'use client';

import React from 'react';

interface Ean13BarcodeSvgProps {
    code: string;
    width?: number;
    height?: number;
    className?: string;
}

// Table des parités pour la partie gauche selon le 1er chiffre
const PARITY_PATTERNS: { [key: number]: string } = {
    0: 'LLLLLL',
    1: 'LLGLGG',
    2: 'LLGGLG',
    3: 'LLGGGL',
    4: 'LGLLGG',
    5: 'LGGLLG',
    6: 'LGGGLL',
    7: 'LGLGLG',
    8: 'LGLGGL',
    9: 'LGGLGL',
};

// Encodage des chiffres
const ENCODINGS: { [key: string]: { [key: number]: string } } = {
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

/**
 * Calcule la clé de contrôle EAN-13 pour 12 chiffres
 */
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
 * Génère la chaîne binaire EAN-13 complète à partir de 12 ou 13 chiffres
 */
export function getEan13FullCode(rawCode: string): { fullCode: string; binaryString: string } {
    // Nettoyer les caractères non numériques
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
    const parityPattern = PARITY_PATTERNS[firstDigit] || 'LLLLLL';

    let binary = '101'; // Guard début

    // 6 chiffres de gauche
    for (let i = 0; i < 6; i++) {
        const digit = parseInt(fullCode[i + 1], 10);
        const type = parityPattern[i];
        binary += ENCODINGS[type][digit];
    }

    binary += '01010'; // Guard centre

    // 6 chiffres de droite
    for (let i = 0; i < 6; i++) {
        const digit = parseInt(fullCode[i + 7], 10);
        binary += ENCODINGS['R'][digit];
    }

    binary += '101'; // Guard fin

    return { fullCode, binaryString: binary };
}

export default function Ean13BarcodeSvg({
    code,
    width = 300,
    height = 130,
    className = '',
}: Ean13BarcodeSvgProps) {
    const { fullCode, binaryString } = getEan13FullCode(code);

    const moduleWidth = width / (binaryString.length + 16); // Marges latérales
    const barHeight = height - 32;

    // Formater le texte du code EAN13 pour l'affichage lisible sous les barres
    const formattedText = `${fullCode[0]} ${fullCode.slice(1, 7)} ${fullCode.slice(7, 13)}`;

    return (
        <div className={`flex flex-col items-center select-none ${className}`}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect width={width} height={height} fill="#ffffff" rx={8} />

                <g transform={`translate(${(width - binaryString.length * moduleWidth) / 2}, 10)`}>
                    {binaryString.split('').map((bit, index) => {
                        if (bit === '0') return null;

                        return (
                            <rect
                                key={index}
                                x={index * moduleWidth}
                                y={0}
                                width={moduleWidth + 0.15} // Sur-largeur pour un tracé vectoriel parfait
                                height={barHeight}
                                fill="#0f172a"
                            />
                        );
                    })}
                </g>

                {/* Texte chiffré sous le code-barres */}
                <text
                    x={width / 2}
                    y={height - 6}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontFamily="monospace, sans-serif"
                    fontSize="15"
                    fontWeight="700"
                    letterSpacing="2.5"
                >
                    {formattedText}
                </text>
            </svg>
        </div>
    );
}
