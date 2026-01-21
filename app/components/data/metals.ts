export const METALS = ["Чёрный", "Нержавейка", "Цветной"] as const;

export const DENSITIES: Record<string, number> = {
  "Чёрный": 7850,
  "Нержавейка": 7900,
  "Цветной": 2700,
};

export const METAL_DATA: Record<string, string[]> = {
  "Чёрный": [],
  "Нержавейка": [],
  "Цветной": [],
};
