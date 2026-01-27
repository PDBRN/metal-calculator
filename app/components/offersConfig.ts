import type { Metal } from "./data";

export interface Offer {
    name: string;
    logo: string;
    priceFrom: number;
    unit: string; // e.g., "₽/т", "₽/м", "₽/шт"
    link: string;
    phone: string;
}

export type METAL_KEY =
    | "black"
    | "stainless"
    | "aluminum"
    | "copper"
    | "brass"
    | "bronze"
    | "titan";

export type ASSORTMENT_KEY =
    | "beam"
    | "rebar"
    | "square"
    | "circle"
    | "strip"
    | "sheet"
    | "pipe_profile"
    | "pipe_round"
    | "angle"
    | "elbow"
    | "channel"
    | "hexagon";

export const METAL_MAP: Record<string, METAL_KEY> = {
    "Чёрный": "black",
    "Нержавейка": "stainless",
    "Алюминий": "aluminum",
    "Медь": "copper",
    "Латунь": "brass",
    "Бронза": "bronze",
    "Титан": "titan",
};

export const ASSORTMENT_MAP: Record<string, ASSORTMENT_KEY> = {
    "Балка/двутавр": "beam",
    "Арматура": "rebar",
    "Квадрат": "square",
    "Круг/пруток": "circle",
    "Лента": "strip",
    "Лист/плита": "sheet",
    "Труба профильная": "pipe_profile",
    "Труба круглая": "pipe_round",
    "Уголок": "angle",
    "Отвод": "elbow",
    "Швеллер": "channel",
    "Шестигранник": "hexagon",
};

// Main Config Data
export const OFFERS_DATA: Partial<Record<METAL_KEY, Partial<Record<ASSORTMENT_KEY, Offer[]>>>> = {
    black: {
        square: [
            {
                name: "ЦентрСтройГрупп",
                logo: "/logos/csg.png", // Путь к будущему логотипу
                priceFrom: 45000,
                unit: "₽/т",
                link: "https://example.com/black/square",
                phone: "+7 (495) 000-00-01",
            },
            {
                name: "Промышленные Стали и Сплавы",
                logo: "/logos/pss.png",
                priceFrom: 150,
                unit: "₽/м",
                link: "https://example.com/black/square/promo",
                phone: "+7 (800) 000-00-02",
            },
            {
                name: "Цветная металлургия",
                logo: "/logos/color_met.png",
                priceFrom: 44500,
                unit: "₽/т",
                link: "https://example.com/shop",
                phone: "+7 (999) 000-00-03",
            },
        ],
    }
};

export function getOffers(metal: string, assortment: string): Offer[] {
    const mKey = METAL_MAP[metal];
    const aKey = ASSORTMENT_MAP[assortment];

    const specificOffers = mKey && aKey ? OFFERS_DATA[mKey]?.[aKey] : undefined;

    if (specificOffers && specificOffers.length > 0) {
        return specificOffers;
    }

    // Fallback to default offers (e.g., from black square) to show everywhere
    return OFFERS_DATA.black?.square || [];
}
