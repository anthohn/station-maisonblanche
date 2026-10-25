'use client';

import React from 'react';
import BarcodeSvg from './BarcodeSvg';

interface Ean13BarcodeSvgProps {
    code: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function Ean13BarcodeSvg(props: Ean13BarcodeSvgProps) {
    return <BarcodeSvg {...props} type="ean13" />;
}
