import { BLACK_METAL_DATA } from "./black";
import { STAINLESS_METAL_DATA } from "./stainless";
import { ALUMINUM_DATA } from "./aluminum";
import { COPPER_DATA } from "./copper";
import { BRASS_DATA } from "./brass";
import { BRONZE_DATA } from "./bronze";
import { TITAN_DATA } from "./titan";

// Updated list of metals (removed "Color", added specific non-ferrous metals)
export const METALS = [
  "Чёрный",
  "Нержавейка",
  "Алюминий",
  "Медь",
  "Латунь",
  "Бронза",
  "Титан",
] as const;

export type Metal = typeof METALS[number];

export const DENSITIES: Record<Metal, number> = {
  "Чёрный": 7850,
  "Нержавейка": 7900, // Base density, typically overriden by grade
  "Алюминий": 2700,
  "Медь": 8960,
  "Латунь": 8730,
  "Бронза": 8800,
  "Титан": 4500,
};

export const METAL_DATA: Record<Metal, string[]> = {
  "Чёрный": BLACK_METAL_DATA,
  "Нержавейка": STAINLESS_METAL_DATA,
  "Алюминий": ALUMINUM_DATA,
  "Медь": COPPER_DATA,
  "Латунь": BRASS_DATA,
  "Бронза": BRONZE_DATA,
  "Титан": TITAN_DATA,
};
