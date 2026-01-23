export const COPPER_GRADES = [
    "М1",
    "М2",
    "М3",
    "Прочее",
] as const;

export type CopperGrade = (typeof COPPER_GRADES)[number];

export const COPPER_DENSITIES: Record<CopperGrade, number> = {
    "М1": 8960,
    "М2": 8960,
    "М3": 8960,
    "Прочее": 8960,
};

export const COPPER_DATA = [
    "Круг/пруток",
    "Лента",
    "Лист/плита",
    "Труба круглая",
];
