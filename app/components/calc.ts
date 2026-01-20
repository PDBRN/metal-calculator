import { DENSITIES, BEAM_KG_PER_M, STEEL_GRADE_DENSITY } from "./data";

export type CalcMode = "weight" | "length";

/**
 * Входные данные:
 * - Все размеры в МЕТРАХ (d/a/b/t уже делятся на 1000 в Calculator.tsx)
 * - len в метрах
 * - weight в кг
 */
export type CalcInputs = {
  qty: number;      // количество (шт)
  len: number;      // длина L (м)
  weight: number;   // общий вес (кг) — когда mode === "length"
  d: number;        // диаметр (м)
  a: number;        // сторона/ширина/высота (м)
  b: number;        // ширина/высота/длина листа (м)
  t: number;        // толщина/стенка (м)

  steelMark?: string;

  // Балка / двутавр (табличный расчет)
  beamType?: string;
  beamNumber?: string;
};

function isFinitePos(n: number) {
  return Number.isFinite(n) && n > 0;
}

function clampNonNegative(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/**
 * Площадь круга по диаметру (м)
 */
function areaCircleByDiameter(d: number) {
  if (!isFinitePos(d)) return 0;
  const r = d / 2;
  return Math.PI * r * r;
}

/**
 * Площадь кольца (труба круглая): наружный диаметр d, толщина стенки t
 */
function areaRoundTube(d: number, t: number) {
  if (!isFinitePos(d) || !isFinitePos(t)) return 0;
  const rOut = d / 2;
  const rIn = rOut - t;
  if (rIn <= 0) return 0;
  return Math.PI * (rOut * rOut - rIn * rIn);
}

/**
 * Площадь прямоугольной трубы: A x B с толщиной t
 * Вход: a и b в метрах. Иногда b может быть пустым — тогда берём b=a.
 */
function areaRectTube(a: number, b: number, t: number) {
  if (!isFinitePos(a) || !isFinitePos(t)) return 0;
  const H = isFinitePos(b) ? b : a;

  const areaOut = a * H;
  const aIn = a - 2 * t;
  const hIn = H - 2 * t;
  if (aIn <= 0 || hIn <= 0) return 0;

  const areaIn = aIn * hIn;
  return areaOut - areaIn;
}

/**
 * Площадь ленты: ширина a * толщина t
 */
function areaStrip(a: number, t: number) {
  if (!isFinitePos(a) || !isFinitePos(t)) return 0;
  return a * t;
}

/**
 * Масса листа/плиты: толщина t * ширина a * длина b * плотность * qty
 * ВНИМАНИЕ: здесь len не участвует.
 */
function weightPlate(t: number, a: number, b: number, density: number, qty: number) {
  if (!isFinitePos(t) || !isFinitePos(a) || !isFinitePos(b) || !isFinitePos(density) || !isFinitePos(qty)) return 0;
  const vol = t * a * b; // м3
  return vol * density * qty; // кг
}

/**
 * Балка/двутавр: поиск кг/м по типу и номеру
 */
function beamKgPerM(beamType?: string, beamNumber?: string) {
  if (!beamType || !beamNumber) return 0;
  const v = BEAM_KG_PER_M?.[beamType]?.[beamNumber];
  return Number.isFinite(v) ? (v as number) : 0;
}

export function calculateResult(
  mode: CalcMode,
  metal: string,
  assortment: string,
  inputs: CalcInputs
): number {
  const baseDensity = DENSITIES[metal] || 7850;

// Плотность по марке стали — только для "Чёрный"
  const density =
    metal === "Чёрный" && inputs.steelMark
      ? (STEEL_GRADE_DENSITY[inputs.steelMark] || baseDensity)
      : baseDensity;

  // Нормализуем входы (без NaN)
  const qty = isFinitePos(inputs.qty) ? inputs.qty : 1;

  const len = clampNonNegative(inputs.len);
  const weight = clampNonNegative(inputs.weight);

  const d = clampNonNegative(inputs.d);
  const a = clampNonNegative(inputs.a);
  const b = clampNonNegative(inputs.b);
  const t = clampNonNegative(inputs.t);

  // ----------------------------
  // 1) Балка/двутавр — ТАБЛИЧНЫЙ РАСЧЕТ
  // ----------------------------
  if (assortment === "Балка/двутавр") {
  const kgPerM = beamKgPerM(inputs.beamType, inputs.beamNumber);
  if (!kgPerM) return 0;

  if (mode === "weight") return kgPerM * len * qty;
  return weight / (kgPerM * qty);

}

  // ----------------------------
  // 2) Лист/плита — ОБЪЕМНЫЙ РАСЧЕТ
  // ----------------------------
  if (assortment === "Лист/плита") {
  // Вес листа = t * a * b * density * qty
  // (всё в метрах, density в кг/м3)
  return weightPlate(t, a, b, density, qty);
  }



  // ----------------------------
  // 3) Остальные сортаменты — через площадь сечения
  // ----------------------------
  let area_m2 = 0;

  // Круглое сплошное
  if (assortment === "Арматура" || assortment === "Круг/пруток" || assortment === "Проволока") {
    area_m2 = areaCircleByDiameter(d);
  }

  // Квадрат
  else if (assortment === "Квадрат") {
    if (isFinitePos(a)) area_m2 = a * a;
  }

  // Лента
  else if (assortment === "Лента") {
    area_m2 = areaStrip(a, t);
  }

  // Труба круглая
  else if (assortment === "Труба круглая") {
    area_m2 = areaRoundTube(d, t);
  }

  // Труба профильная
  else if (assortment === "Труба профильная") {
    area_m2 = areaRectTube(a, b, t);
  }

  // Уголок
else if (assortment === "Уголок") {
  if (isFinitePos(a) && isFinitePos(b) && isFinitePos(t)) {
    area_m2 = t * (a + b - t);
  }
}


  // Если сортамент пока не реализован — 0
  else {
    area_m2 = 0;
  }

  // ----------------------------
  // 4) Финал: вес/длина
  // ----------------------------
  if (!isFinitePos(area_m2) || !isFinitePos(density)) return 0;

  if (mode === "weight") {
    if (!isFinitePos(len)) return 0;
    // Вес = площадь * длина * плотность * количество
    return area_m2 * len * density * qty;
  } else {
    if (!isFinitePos(weight)) return 0;
    // Длина = вес / (площадь * плотность * количество)
    return weight / (area_m2 * density * qty);
  }
}

export function calcPlateArea(a: number, b: number, qty: number) {
  const A = clampNonNegative(a);
  const B = clampNonNegative(b);
  const Q = isFinitePos(qty) ? qty : 1;
  if (!isFinitePos(A) || !isFinitePos(B)) return 0;
  return A * B * Q; // м2
}
