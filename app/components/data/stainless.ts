export const STAINLESS_GRADES = [
  "08Х17Т",
  "20Х13",
  "30Х13",
  "40Х13",
  "08Х18Н10",
  "12Х18Н10Т",
  "10Х17Н13М2Т",
  "06ХН28МДТ",
  "20Х23Н18",
  "AISI 304",
  "AISI 316L",
  "AISI 316Ti",
  "AISI 321",
  "AISI 409",
  "AISI 430",
  "AISI 904L",
  "Прочее",
] as const;

export type StainlessGrade = (typeof STAINLESS_GRADES)[number];

// Default densities for stainless grades (approx 7.9 g/cm3 for most)
// Can be refined later
export const STAINLESS_DENSITIES: Record<StainlessGrade, number> = {
  "08Х17Т": 7720,
  "20Х13": 7670,
  "30Х13": 7670,
  "40Х13": 7670,
  "08Х18Н10": 7900,
  "12Х18Н10Т": 7900,
  "10Х17Н13М2Т": 7950,
  "06ХН28МДТ": 7960,
  "20Х23Н18": 7900,
  "AISI 304": 7900,
  "AISI 316L": 7980,
  "AISI 316Ti": 7980,
  "AISI 321": 7900,
  "AISI 409": 7700,
  "AISI 430": 7700,
  "AISI 904L": 8000,
  "Прочее": 7900,
};

export const STAINLESS_METAL_DATA: string[] = [
  "Квадрат",
  "Круг/пруток",
  "Лента",
  "Лист/плита",
  "Отвод",
  "Труба круглая",
  "Труба профильная",
  "Уголок",
  "Фланец плоский",
  "Швеллер",
  "Шестигранник",
];
