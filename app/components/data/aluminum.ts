export const ALUMINUM_GRADES = [
    "А5",
    "АД",
    "АД1",
    "АК4",
    "АК6",
    "АМг",
    "АМц",
    "В95",
    "Д1",
    "Д16",
    "Прочее",
] as const;

export type AluminumGrade = (typeof ALUMINUM_GRADES)[number];

export const ALUMINUM_DENSITIES: Record<AluminumGrade, number> = {
    "А5": 2700,
    "АД": 2780,
    "АД1": 2780,
    "АК4": 2710,
    "АК6": 2700,
    "АМг": 2680,
    "АМц": 2690,
    "В95": 2810,
    "Д1": 2780,
    "Д16": 2770,
    "Прочее": 2700,
};

export const ALUMINUM_DATA = [
    "Квадрат",
    "Круг/пруток",
    "Лента",
    "Лист/плита",
    "Труба круглая",
    "Труба профильная",
    "Уголок",
    "Шестигранник",
];
