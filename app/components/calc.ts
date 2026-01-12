import { DENSITIES } from "./data";

export type CalcInputs = {
  qty: number;
  len: number;
  weight: number;
  d: number; // диаметр (м)
  a: number; // сторона/высота (м)
  b: number; // ширина/длина листа (м)
  t: number; // толщина (м)
};

export function calculateResult(
  mode: "weight" | "length",
  metal: string,
  assortment: string,
  inputs: CalcInputs
): number {
  
  // 1. Берем плотность (или по умолчанию сталь)
  const density = DENSITIES[metal] || 7850; 
  
  const { qty, len, weight, d, a, b, t } = inputs;

  let area_m2 = 0;

  // 2. Считаем площадь сечения (геометрия)
  if (assortment === "Арматура" || assortment === "Круг/пруток" || assortment === "Проволока") {
     area_m2 = Math.PI * Math.pow(d / 2, 2);
  } 
  else if (assortment === "Квадрат") {
     area_m2 = a * a;
  }
  else if (assortment === "Лист/плита") {
     // Для листа логика: Вес = (Толщина * Ширина * Длина) * Плотность
     const vol = t * a * b;
     if (mode === "weight") return vol * density * qty;
     else return 0;
  }
  else if (assortment === "Лента") {
     area_m2 = a * t;
  }
  else if (assortment === "Труба круглая") {
     const r_out = d / 2;
     const r_in = r_out - t;
     area_m2 = Math.PI * (Math.pow(r_out, 2) - Math.pow(r_in, 2));
  }
  else if (assortment === "Труба профильная") {
     const h = b > 0 ? b : a;
     const areaOut = a * h;
     const areaIn = (a - 2*t) * (h - 2*t);
     area_m2 = areaOut - (areaIn > 0 ? areaIn : 0);
  }
  else if (assortment === "Балка/двутавр") {
     if (t > 0) area_m2 = (2 * b * t) + ((a - 2*t) * t);
     else area_m2 = a * b * 0.5; // Грубая заглушка
  }

  // 3. Финальный расчет
  if (mode === "weight") {
     return area_m2 * len * density * qty;
  } else {
     if (area_m2 > 0) return weight / (area_m2 * density * qty);
     return 0;
  }
}