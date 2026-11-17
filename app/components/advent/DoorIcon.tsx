import {
    Coffee,
    Croissant,
    Cookie,
    Candy,
    Gift,
    Flower2,
    Wine,
    Soup,
    Droplets,
    Gauge,
    BatteryCharging,
    Moon,
    Snowflake,
    Fuel,
    Puzzle,
    Heart,
    Compass,
    ClipboardCheck,
    PartyPopper,
    type LucideProps,
} from 'lucide-react';
import type { DoorIcon as DoorIconName } from '@/lib/advent-shared';

const ICONS: Record<DoorIconName, React.ComponentType<LucideProps>> = {
    coffee: Coffee,
    croissant: Croissant,
    cookie: Cookie,
    candy: Candy,
    gift: Gift,
    flower: Flower2,
    wine: Wine,
    soup: Soup,
    droplets: Droplets,
    gauge: Gauge,
    battery: BatteryCharging,
    moon: Moon,
    snowflake: Snowflake,
    fuel: Fuel,
    puzzle: Puzzle,
    heart: Heart,
    compass: Compass,
    checklist: ClipboardCheck,
    partyPopper: PartyPopper,
};

export default function DoorIcon({ name, ...props }: { name: DoorIconName } & LucideProps) {
    const Icon = ICONS[name];
    return <Icon aria-hidden="true" {...props} />;
}
