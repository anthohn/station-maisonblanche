import { ADVENT } from '@/lib/advent-shared';

/**
 * Rappel quotidien pour l'agenda du téléphone (fichier .ics).
 *
 * Un seul événement qui se répète chaque matin à 07h30 du 1er au 24 décembre :
 * « Ouvrir la porte du jour », avec le lien du calendrier. Fonctionne avec
 * Apple Calendrier, Google Agenda, Outlook, etc.
 */

const SITE = 'https://station-maisonblanche.ch';

/** Échappe le texte selon la RFC 5545 (virgules, points-virgules, retours à la ligne). */
const escapeText = (text: string) =>
    text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Les lignes d'un .ics ne dépassent pas 75 octets : on replie sur la ligne suivante. */
function fold(line: string): string {
    const parts: string[] = [];
    let current = '';
    let bytes = 0;
    for (const char of line) {
        const size = Buffer.byteLength(char, 'utf8');
        if (bytes + size > 73) {
            parts.push(current);
            current = ' ' + char; // la continuation commence par une espace
            bytes = 1 + size;
        } else {
            current += char;
            bytes += size;
        }
    }
    parts.push(current);
    return parts.join('\r\n');
}

const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function GET() {
    const year = ADVENT.year;
    const url = `${SITE}${ADVENT.path}`;

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Station-Service Maison-Blanche//Calendrier de l’Avent//FR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${escapeText(`Calendrier de l’Avent ${year}`)}`,
        'X-WR-TIMEZONE:Europe/Zurich',
        // Fuseau horaire de Genève (heure d'hiver / heure d'été)
        'BEGIN:VTIMEZONE',
        'TZID:Europe/Zurich',
        'BEGIN:STANDARD',
        'DTSTART:19701025T030000',
        'TZOFFSETFROM:+0200',
        'TZOFFSETTO:+0100',
        'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
        'TZNAME:CET',
        'END:STANDARD',
        'BEGIN:DAYLIGHT',
        'DTSTART:19700329T020000',
        'TZOFFSETFROM:+0100',
        'TZOFFSETTO:+0200',
        'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
        'TZNAME:CEST',
        'END:DAYLIGHT',
        'END:VTIMEZONE',
        'BEGIN:VEVENT',
        `UID:avent-${year}@station-maisonblanche.ch`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART;TZID=Europe/Zurich:${year}1201T073000`,
        `DTEND;TZID=Europe/Zurich:${year}1201T074500`,
        `RRULE:FREQ=DAILY;COUNT=${ADVENT.lastDay}`,
        `SUMMARY:${escapeText('🎁 Ouvrir la porte du jour')}`,
        `DESCRIPTION:${escapeText(
            `Une nouvelle porte du calendrier de l’Avent de la Station Maison-Blanche vous attend.\n${url}`,
        )}`,
        `URL:${url}`,
        'TRANSP:TRANSPARENT',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'TRIGGER:PT0S',
        `DESCRIPTION:${escapeText('Ouvrir la porte du jour')}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ];

    return new Response(lines.map(fold).join('\r\n') + '\r\n', {
        headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'inline; filename="calendrier-avent-maison-blanche.ics"',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
