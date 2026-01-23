export const BRASS_GRADES = [
    "Л63",
    "Л68",
    "ЛЖМц59-1-1",
    "ЛМц58-2",
    "ЛС58-2",
    "ЛС59-1",
    "ЛС63-3",
    "Прочее",
] as const;

export type BrassGrade = (typeof BRASS_GRADES)[number];

export const BRASS_DENSITIES: Record<BrassGrade, number> = {
    "Л63": 8440,
    "Л68": 8600,
    "ЛЖМц59-1-1": 8400,
    "ЛМц58-2": 8400,
    "ЛС58-2": 8500,
    "ЛС59-1": 8500,
    "ЛС63-3": 8500,
    "Прочее": 8500,
};

export const BRASS_DATA = [
    "Круг/пруток",
    "Лента",
    "Лист/плита",
    "Труба круглая",
    "Шестигранник",
];
