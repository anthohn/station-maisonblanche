'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock, Heart, Sun } from 'lucide-react';
import BarcodeSvg from '@/app/components/BarcodeSvg';
import { ADVENT, type DoorCta, type PublicCouponDoor, type RevealContent } from '@/lib/advent-shared';

/**
 * Contenu de la fenêtre de révélation, un composant par type de porte.
 * Tout est volontairement sobre : la fête est dans la plaque colorée au-dessus,
 * ici on privilégie la lisibilité (et le scan du code-barres en caisse).
 */

const body = 'text-[15.5px] leading-relaxed text-slate-600';

/* ─────────────────────────── Bon de réduction ─────────────────────────── */

function CouponBody({ door, dateLabel }: { door: PublicCouponDoor; dateLabel: string }) {
    return (
        <div>
            <p className={body}>{door.summary}</p>

            {door.barcode ? (
                <>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <BarcodeSvg code={door.barcode} type={door.barcodeType} width={260} height={115} />
                    </div>

                    {ADVENT.sampleContent && (
                        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-[11.5px] font-semibold uppercase tracking-wider text-amber-800">
                            Code d’exemple · non valable en caisse
                        </p>
                    )}

                    <p className="mt-3 text-center text-[13px] font-medium text-slate-700">
                        À présenter en caisse · valable uniquement aujourd’hui
                    </p>
                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                        <Sun size={13} aria-hidden="true" />
                        Augmentez la luminosité de l’écran pour faciliter le scan
                    </p>
                </>
            ) : (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500">
                        <Clock size={16} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Cette offre est terminée</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
                            Elle n’était valable que le {dateLabel.toLowerCase()}. Revenez chaque jour : une nouvelle
                            surprise vous attend derrière la prochaine porte.
                        </p>
                    </div>
                </div>
            )}

            <p className="mt-4 text-[11.5px] leading-relaxed text-slate-400">{door.conditions}</p>
        </div>
    );
}

/* ─────────────────────────── Conseil ─────────────────────────── */

function Cta({ cta }: { cta: DoorCta }) {
    const className =
        'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800';
    if (cta.external) {
        return (
            <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
                {cta.label}
                <ArrowUpRight size={16} aria-hidden="true" />
            </a>
        );
    }
    return (
        <Link href={cta.href} className={className}>
            {cta.label}
            <ArrowRight size={16} aria-hidden="true" />
        </Link>
    );
}

function TipBody({ door }: { door: Extract<RevealContent, { kind: 'tip' }> }) {
    return (
        <div>
            <div className="space-y-3">
                {door.body.map((p) => (
                    <p key={p} className={body}>
                        {p}
                    </p>
                ))}
            </div>

            {door.remember && (
                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                    <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-wider text-amber-800">
                        {door.rememberTitle ?? 'À retenir'}
                    </p>
                    <ul className="space-y-2">
                        {door.remember.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-slate-700">
                                <Check size={16} className="mt-0.5 shrink-0 text-amber-600" strokeWidth={2.6} aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {door.cta && <Cta cta={door.cta} />}
        </div>
    );
}

/* ─────────────────────────── Devinette ─────────────────────────── */

function RiddleBody({ door }: { door: Extract<RevealContent, { kind: 'riddle' }> }) {
    const [shown, setShown] = useState(false);
    return (
        <div>
            <p className="adv-serif text-[1.35rem] leading-snug text-slate-800">{door.question}</p>

            {shown ? (
                <div className="adv-reveal mt-5">
                    <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-4 ring-1 ring-amber-200">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Réponse</p>
                        <p className="adv-serif mt-1 text-xl leading-snug text-amber-950">{door.answer}</p>
                    </div>
                    {door.aside && <p className={`${body} mt-4`}>{door.aside}</p>}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShown(true)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800"
                >
                    Voir la réponse
                </button>
            )}
        </div>
    );
}

/* ─────────────────────────── Recette ─────────────────────────── */

function RecipeBody({ door }: { door: Extract<RevealContent, { kind: 'recipe' }> }) {
    return (
        <div>
            <p className={body}>{door.intro}</p>

            <p className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Ingrédients</p>
            <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                {door.ingredients.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-snug text-slate-700">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>

            <p className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Préparation</p>
            <ol className="space-y-3">
                {door.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                        <span className="adv-serif grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-[13px] text-white">
                            {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                    </li>
                ))}
            </ol>

            {door.note && (
                <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
                    {door.note}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────── Check-list ─────────────────────────── */

function ChecklistBody({ door }: { door: Extract<RevealContent, { kind: 'checklist' }> }) {
    const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());
    const total = door.items.length;
    const done = checked.size;

    const toggle = (index: number) =>
        setChecked((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });

    return (
        <div>
            <p className={body}>{door.intro}</p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-500"
                    style={{ width: `${(done / total) * 100}%` }}
                />
            </div>
            <p className="mt-1.5 text-right text-xs font-medium text-slate-400" aria-live="polite">
                {done} / {total}
            </p>

            <ul className="mt-2 space-y-2">
                {door.items.map((item, index) => (
                    <li key={item}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors has-[:checked]:border-emerald-200 has-[:checked]:bg-emerald-50/70 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={checked.has(index)}
                                onChange={() => toggle(index)}
                            />
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-slate-300 text-transparent transition-colors peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-white">
                                <Check size={13} strokeWidth={3.2} aria-hidden="true" />
                            </span>
                            <span className="text-sm leading-snug text-slate-700 peer-checked:text-slate-400 peer-checked:line-through">
                                {item}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>

            {done === total && (
                <p className="adv-reveal adv-serif mt-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-4 text-center text-lg text-emerald-900">
                    {door.outro}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────── Message ─────────────────────────── */

function MessageBody({ door }: { door: Extract<RevealContent, { kind: 'message' }> }) {
    return (
        <div className="space-y-3.5">
            {door.body.map((p) => (
                <p key={p} className="text-[16px] leading-relaxed text-slate-700">
                    {p}
                </p>
            ))}
            {door.signature && (
                <p className="flex items-center gap-2 pt-1 text-sm font-semibold text-slate-800">
                    <Heart size={15} className="fill-rose-500 text-rose-500" aria-hidden="true" />
                    {door.signature}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────── Le saviez-vous ─────────────────────────── */

function FactBody({ door }: { door: Extract<RevealContent, { kind: 'fact' }> }) {
    return (
        <div>
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-center">
                <p className="adv-serif bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-[2rem] leading-none text-transparent">
                    {door.stat}
                </p>
                <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">{door.statLabel}</p>
            </div>
            <div className="space-y-3">
                {door.body.map((p) => (
                    <p key={p} className={body}>
                        {p}
                    </p>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────── Aiguillage ─────────────────────────── */

export default function RevealBody({ content, dateLabel }: { content: RevealContent; dateLabel: string }) {
    switch (content.kind) {
        case 'coupon':
            return <CouponBody door={content} dateLabel={dateLabel} />;
        case 'tip':
            return <TipBody door={content} />;
        case 'riddle':
            return <RiddleBody door={content} />;
        case 'recipe':
            return <RecipeBody door={content} />;
        case 'checklist':
            return <ChecklistBody door={content} />;
        case 'message':
            return <MessageBody door={content} />;
        case 'fact':
            return <FactBody door={content} />;
    }
}
