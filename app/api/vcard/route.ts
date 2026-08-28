import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Read logo image to encode in Base64 for vCard PHOTO field
        const logoPath = path.join(process.cwd(), 'public', 'logo-station.png');
        let photoBase64 = '';

        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            photoBase64 = logoBuffer.toString('base64');
        }

        // Construct RFC 2426 / RFC 6350 compliant vCard string
        const vcardLines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'N:Maison-Blanche;Station Service;;S.A.;',
            'FN:Station Service Maison-Blanche S.A.',
            'ORG:Station Service Maison-Blanche S.A.',
            'TITLE:Station-Service, Épicerie Shop & Lavage',
            'TEL;TYPE=WORK,VOICE;TYPE=PREF:+41227561522',
            'EMAIL;TYPE=WORK,INTERNET:contact@station-maisonblanche.ch',
            'URL:https://station-maisonblanche.ch',
            'ADR;TYPE=WORK,POSTAL,PARCEL:;;Route de Chancy 500;Chancy;GE;1284;Suisse',
            'LABEL;TYPE=WORK,POSTAL,PARCEL:Route de Chancy 500\\n1284 Chancy\\nSuisse',
            'GEO:46.1566898;5.9874275',
            'NOTE:Station-Service Maison-Blanche S.A.\\nShop: 7j/7 06h00 - 21h00 (du 1er mai au 31 août)\\nCarburant & Lavage: 24h/24',
        ];

        if (photoBase64) {
            vcardLines.push(`PHOTO;TYPE=PNG;ENCODING=b:${photoBase64}`);
        }

        vcardLines.push('END:VCARD');

        const vcardString = vcardLines.join('\r\n');

        return new NextResponse(vcardString, {
            headers: {
                'Content-Type': 'text/vcard; charset=utf-8',
                'Content-Disposition': 'attachment; filename="station-maisonblanche.vcf"',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error generating vCard:', error);
        return new NextResponse('Error generating vCard', { status: 500 });
    }
}
