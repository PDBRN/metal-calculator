import {
  DENSITIES,
  BEAM_KG_PER_M,
  STEEL_GRADE_DENSITY,
  CHANNEL_KG_PER_M,
  STAINLESS_DENSITIES,
  ALUMINUM_DENSITIES,
  COPPER_DENSITIES,
  BRASS_DENSITIES,
  BRONZE_DENSITIES,
  TITAN_DENSITIES,
  ELBOW_KG_PER_PIECE_EXEC1,
  ELBOW_KG_PER_PIECE_EXEC2,
  type Metal,
  type SteelGrade,
  type StainlessGrade,
  type AluminumGrade,
  type CopperGrade,
  type BrassGrade,
  type BronzeGrade,
  type TitanGrade,
  type ElbowExecution,
  type ElbowSize,
} from "./data";

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

  // Швеллер
  channelNumber?: string;

  // Отвод
  elbowExecution?: ElbowExecution;
  elbowSize?: ElbowSize;
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

// Type Guards
function hasOwn(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isSteelGrade(x: string): x is SteelGrade {
  return hasOwn(STEEL_GRADE_DENSITY, x);
}

function isStainlessGrade(x: string): x is StainlessGrade {
  return hasOwn(STAINLESS_DENSITIES, x);
}

function isAluminumGrade(x: string): x is AluminumGrade {
  return hasOwn(ALUMINUM_DENSITIES, x);
}

function isCopperGrade(x: string): x is CopperGrade {
  return hasOwn(COPPER_DENSITIES, x);
}

function isBrassGrade(x: string): x is BrassGrade {
  return hasOwn(BRASS_DENSITIES, x);
}

function isBronzeGrade(x: string): x is BronzeGrade {
  return hasOwn(BRONZE_DENSITIES, x);
}

function isTitanGrade(x: string): x is TitanGrade {
  return hasOwn(TITAN_DENSITIES, x);
}

// Helper to safely get density
function getDensity(metal: Metal, steelMark?: string) {
  const base = DENSITIES[metal];

  if (metal === "Чёрный" && steelMark && isSteelGrade(steelMark)) {
    return STEEL_GRADE_DENSITY[steelMark];
  }

  if (metal === "Нержавейка" && steelMark && isStainlessGrade(steelMark)) {
    return STAINLESS_DENSITIES[steelMark];
  }

  if (metal === "Алюминий" && steelMark && isAluminumGrade(steelMark)) {
    return ALUMINUM_DENSITIES[steelMark];
  }

  if (metal === "Медь" && steelMark && isCopperGrade(steelMark)) {
    return COPPER_DENSITIES[steelMark];
  }

  if (metal === "Латунь" && steelMark && isBrassGrade(steelMark)) {
    return BRASS_DENSITIES[steelMark];
  }

  if (metal === "Бронза" && steelMark && isBronzeGrade(steelMark)) {
    return BRONZE_DENSITIES[steelMark];
  }

  if (metal === "Титан" && steelMark && isTitanGrade(steelMark)) {
    return TITAN_DENSITIES[steelMark];
  }

  return base;
}

export function calculateResult(
  mode: CalcMode,
  metal: Metal,
  assortment: string,
  inputs: CalcInputs
): number {
  if (metal === "Нержавейка" && assortment === "Отвод") {
    const rawQty = inputs.qty;
    const qty = Number.isFinite(rawQty) ? Math.max(0, rawQty) : 1;
    if (qty === 0) return 0;

    if (mode === "weight" && inputs.elbowSize) {
      const table = inputs.elbowExecution === "Исполнение 2"
        ? ELBOW_KG_PER_PIECE_EXEC2
        : ELBOW_KG_PER_PIECE_EXEC1;

      // @ts-ignore - size might not exist in table if types mismatch, 
      // but we'll ensure they match in UI
      const kg = table[inputs.elbowSize] || 0;
      return kg * qty;
    }
    return 0; // Length mode not supported for Elbows
  }

  const density = getDensity(metal, inputs.steelMark);

  // Нормализуем входы (без NaN)
  // Если qty невалидно (NaN, null, пустая строка в UI -> converted to 0 or NaN) -> считаем как 1 шт.
  // Если явно 0 — возвращаем 0.
  const rawQty = inputs.qty;
  const qty = Number.isFinite(rawQty) ? Math.max(0, rawQty) : 1;

  if (qty === 0) return 0;

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

  else if (assortment === "Швеллер") {
    const kgPerM = CHANNEL_KG_PER_M[inputs.channelNumber ?? ""];
    if (!kgPerM) return 0;

    if (mode === "weight") {
      return kgPerM * len * qty;
    }

    return weight / (kgPerM * qty);
  }

  // Шестигранник: a — размер между гранями (мм в UI -> м в calc)
  else if (assortment === "Шестигранник") {
    if (isFinitePos(a)) {
      area_m2 = (Math.sqrt(3) / 2) * a * a;
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
