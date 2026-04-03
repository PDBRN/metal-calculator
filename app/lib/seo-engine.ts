import { Metal } from "../components/data";

// 1. Маппинг URL слагов в русские названия для самого калькулятора
export const METAL_SLUG_TO_NAME: Record<string, Metal> = {
  black: "Чёрный",
  stainless: "Нержавейка",
  aluminum: "Алюминий",
  copper: "Медь",
  brass: "Латунь",
  bronze: "Бронза",
  titanium: "Титан"
};

export const ASSORTMENT_SLUG_TO_NAME: Record<string, string> = {
  "pipe-round": "Труба круглая",
  "pipe-profile": "Труба профильная",
  sheet: "Лист/плита",
  angle: "Уголок",
  rebar: "Арматура",
  beam: "Балка/двутавр",
  channel: "Швеллер",
  hex: "Шестигранник",
  circle: "Круг/пруток",
  strip: "Лента",
  elbow: "Отвод",
  square: "Квадрат",
  flange: "Фланец плоский"
};

// Маппинг доступных сортаментов для каждого металла (на основе реальных файлов данных)
export const METAL_TO_ASSORTMENTS: Record<string, string[]> = {
  black: ["rebar", "beam", "square", "circle", "strip", "sheet", "pipe-round", "pipe-profile", "angle", "channel", "hex"],
  stainless: ["square", "circle", "strip", "sheet", "elbow", "pipe-round", "pipe-profile", "angle", "flange", "channel", "hex"],
  aluminum: ["square", "circle", "strip", "sheet", "pipe-round", "pipe-profile", "angle", "hex"],
  copper: ["circle", "strip", "sheet", "pipe-round"],
  brass: ["circle", "strip", "sheet", "pipe-round", "hex"],
  bronze: ["circle", "strip", "sheet", "pipe-round", "hex"],
  titanium: ["circle", "sheet", "pipe-round", "hex"]
};

// 2. SEO-словари (склонения)
// Прилагательные в Родительном падеже (какого?)
const METAL_ADJECTIVES: Record<string, { f: string, m: string, n: string }> = {
  copper: { f: "медной", m: "медного", n: "медного" },
  aluminum: { f: "алюминиевой", m: "алюминиевого", n: "алюминиевого" },
  black: { f: "стальной", m: "стального", n: "стального" },
  stainless: { f: "нержавеющей", m: "нержавеющего", n: "нержавеющего" },
  brass: { f: "латунной", m: "латунного", n: "латунного" },
  bronze: { f: "бронзовой", m: "бронзового", n: "бронзового" },
  titanium: { f: "титановой", m: "титанового", n: "титанового" }
};

// Существительные в Родительном падеже (чего?) и их род (f-женский, m-мужской)
const ASSORTMENT_GENITIVE: Record<string, { name: string, gender: "f" | "m" | "n", skipAdjective?: boolean }> = {
  "pipe-round": { name: "трубы", gender: "f" },
  "pipe-profile": { name: "профильной трубы", gender: "f" },
  sheet: { name: "листа", gender: "m" },
  angle: { name: "уголка", gender: "m" },
  rebar: { name: "арматуры", gender: "f", skipAdjective: true },
  beam: { name: "балки двутавровой (двутавра)", gender: "f", skipAdjective: true },
  channel: { name: "швеллера", gender: "m" },
  hex: { name: "шестигранника", gender: "m" },
  circle: { name: "круга", gender: "m" }, // По умолчанию "круг", для меди/латуни/титана будет "пруток"
  strip: { name: "ленты", gender: "f" },
  elbow: { name: "отвода", gender: "m" },
  square: { name: "квадрата", gender: "m" },
  flange: { name: "фланца", gender: "m" }
};

const ASSORTMENT_INSTRUCTIONS: Record<string, string> = {
  "pipe-round": "наружный диаметр (D), толщину стенки (t) и длину (L)",
  "pipe-profile": "ширину (A), высоту (B), толщину стенки (t) и длину (L)",
  sheet: "ширину (A), длину (B) и толщину листа (t)",
  angle: "ширину полки (h), толщину полки (t) и длину (L)",
  rebar: "номинальный диаметр (D) и длину (L)",
  beam: "высоту (h), ширину полки (b), толщину стенки (s), толщину полки (t) и длину (L)",
  channel: "высоту (h), ширину полки (b), толщину стенки (s), толщину полки (t) и длину (L)",
  hex: "размер под ключ (S) и длину (L)",
  circle: "диаметр (D) и длину (L)",
  strip: "ширину (A), толщину (t) и длину (L)",
  elbow: "наружный диаметр (D) и толщину стенки (t)",
  square: "сторону квадрата (A) и длину (L)",
  flange: "наружный диаметр фланца, диаметры отверстий и толщину"
};

export function getSeoData(metalSlug: string, assortmentSlug: string) {
  const metalName = METAL_SLUG_TO_NAME[metalSlug] || "Металл";
  const assortmentName = ASSORTMENT_SLUG_TO_NAME[assortmentSlug] || "Изделие";
  const instructionParams = ASSORTMENT_INSTRUCTIONS[assortmentSlug] || "геометрические параметры (ширину, длину, диаметр)";

  const adjObj = METAL_ADJECTIVES[metalSlug];
  const nounObj = ASSORTMENT_GENITIVE[assortmentSlug];

  let h1 = `Калькулятор веса: ${metalName} — ${assortmentName}`;
  let h1_suffix = `${metalName} — ${assortmentName}`;
  let title = `Калькулятор веса ${metalName} ${assortmentName} онлайн`;
  let description = `Удобный онлайн калькулятор для расчета веса и длины. Выбранный металл: ${metalName}, изделие: ${assortmentName}. Узнайте точный вес металлопроката за пару секунд!`;

  if (adjObj && nounObj) {
    let adjective = adjObj[nounObj.gender];
    let nounName = nounObj.name;

    // Исключение 1: Пропускаем прилагательное для арматуры и балки (как у конкурентов)
    if (nounObj.skipAdjective && metalSlug === "black") {
      adjective = "";
    }

    // Исключение 2: "Пруток" вместо "Круга" для цветных металлов и титана
    if (assortmentSlug === "circle" && ["copper", "brass", "titanium", "bronze"].includes(metalSlug)) {
      nounName = "прутка";
    }

    // Исключение 3: Для черного металла "профильная труба" идет часто без "стальной"
    if (assortmentSlug === "pipe-profile" && metalSlug === "black") {
      h1 = `Калькулятор веса профильной трубы`;
      h1_suffix = `профильной трубы`;
    } else {
      h1 = `Калькулятор веса ${adjective} ${nounName}`.replace(/\s+/g, ' ').trim();
      h1_suffix = `${adjective} ${nounName}`.replace(/\s+/g, ' ').trim();
    }
    
    title = `Калькулятор веса ${adjective} ${nounName} онлайн | Размеры и масса`.replace(/\s+/g, ' ').trim();
    description = `Точный онлайн калькулятор для расчета веса ${adjective} ${nounName}. Введите размеры (диаметр, толщину, длину) и мгновенно получите результат. Без формул и таблиц.`.replace(/\s+/g, ' ').trim();
  }

  return { h1, title, description, metalName, assortmentName, h1_suffix, instructionParams };
}
