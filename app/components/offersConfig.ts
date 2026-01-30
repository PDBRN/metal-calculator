// No unused imports here

export interface Offer {
    name: string;
    logo: string;
    priceFrom: number | string;
    unit: string;
    link: string;
    phone: string;
    companyKey: "pss" | "metalstore" | "csg";
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

// Default static data in case Google Sheets fails or is not configured
export const DEFAULT_COMPANIES = {
    pss: {
        name: "Промышленные Стали и Сплавы",
        logo: "/logos/pss.png",
        phone: "+7 (958) 400-89-47",
        link: "https://industrialsteel.ru",
    },
    metalstore: {
        name: "Металл стор",
        logo: "/logos/color_met.png",
        phone: "+7 (958) 758-38-15",
        link: "https://metalstore24.ru",
    },
    csg: {
        name: "ЦентрСтройГрупп",
        logo: "/logos/csg.png",
        phone: "+7 (958) 497-09-00",
        link: "https://cstg.ru",
    },
};

// Google Sheet Configuration
// Replace with the actual spreadsheet ID after publishing
const SPREADSHEET_ID = '1-I26u-2Y_9I5BwG_E_G3Z0-O9CjS-v4_P4m6S_V4_8'; // Placeholder
const SHEET_GIDS: Record<METAL_KEY, string> = {
    black: '0',
    stainless: '12345',
    aluminum: '67890',
    copper: '11111',
    brass: '22222',
    bronze: '33333',
    titan: '44444',
};

// Cache for fetched data
const offersCache: Record<string, Offer[]> = {};

export async function getOffers(metal: string, assortment: string): Promise<Offer[]> {
    const mKey = METAL_MAP[metal];
    const aKey = ASSORTMENT_MAP[assortment];

    if (!mKey || !aKey) return getDefaultOffers();

    const cacheKey = `${mKey}_${aKey}`;
    if (offersCache[cacheKey]) return offersCache[cacheKey];

    try {
        // Try fetching from Google Sheets if SPREADSHEET_ID is valid (placeholder for now)
        if (SPREADSHEET_ID.includes('PLACEHOLDER')) return getDefaultOffers();

        const gid = SHEET_GIDS[mKey];
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');

        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));

        // Row structure expected: Assortment, CompanyKey, Price, Link, Phone
        // Skip header
        const filteredOffers: Offer[] = [];

        for (let i = 1; i < rows.length; i++) {
            const [rowAssortment, companyKey, price, link, phone] = rows[i];
            if (rowAssortment?.trim() === assortment && companyKey) {
                const cleanKey = companyKey.trim().toLowerCase() as keyof typeof DEFAULT_COMPANIES;
                const companyBase = DEFAULT_COMPANIES[cleanKey];

                if (companyBase) {
                    filteredOffers.push({
                        name: companyBase.name,
                        logo: companyBase.logo,
                        priceFrom: price?.trim() || "по запросу",
                        unit: "₽/т",
                        link: link?.trim() || companyBase.link,
                        phone: phone?.trim() || companyBase.phone,
                        companyKey: cleanKey
                    });
                }
            }
        }

        if (filteredOffers.length > 0) {
            offersCache[cacheKey] = filteredOffers;
            return filteredOffers;
        }
    } catch (error) {
        console.warn('Falling back to default offers:', error);
    }

    return getDefaultOffers();
}

function getDefaultOffers(): Offer[] {
    return [
        {
            name: DEFAULT_COMPANIES.csg.name,
            logo: DEFAULT_COMPANIES.csg.logo,
            priceFrom: "по запросу",
            unit: "₽/т",
            link: DEFAULT_COMPANIES.csg.link,
            phone: DEFAULT_COMPANIES.csg.phone,
            companyKey: "csg"
        },
        {
            name: DEFAULT_COMPANIES.pss.name,
            logo: DEFAULT_COMPANIES.pss.logo,
            priceFrom: "по запросу",
            unit: "₽/т",
            link: DEFAULT_COMPANIES.pss.link,
            phone: DEFAULT_COMPANIES.pss.phone,
            companyKey: "pss"
        },
        {
            name: DEFAULT_COMPANIES.metalstore.name,
            logo: DEFAULT_COMPANIES.metalstore.logo,
            priceFrom: "по запросу",
            unit: "₽/т",
            link: DEFAULT_COMPANIES.metalstore.link,
            phone: DEFAULT_COMPANIES.metalstore.phone,
            companyKey: "metalstore"
        }
    ];
}
