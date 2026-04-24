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
  flange: "Фланец плоский",
  
  // Размеры и ГОСТы (привязываем к базовым)
  "rebar-10": "Арматура", "rebar-12": "Арматура", "rebar-14": "Арматура", "rebar-16": "Арматура", "rebar-20": "Арматура", "rebar-gost-5781": "Арматура",
  "beam-10": "Балка/двутавр", "beam-12": "Балка/двутавр", "beam-14": "Балка/двутавр", "beam-16": "Балка/двутавр", "beam-20": "Балка/двутавр", "beam-gost-8239": "Балка/двутавр", "beam-gost-26020": "Балка/двутавр",
  "channel-10p": "Швеллер", "channel-14p": "Швеллер", "channel-16p": "Швеллер", "channel-20p": "Швеллер", "channel-gost-8240": "Швеллер",
  "pipe-profile-20x20": "Труба профильная", "pipe-profile-40x20": "Труба профильная", "pipe-profile-40x40": "Труба профильная", "pipe-profile-50x50": "Труба профильная", "pipe-profile-60x40": "Труба профильная", "pipe-profile-60x60": "Труба профильная", "pipe-profile-80x80": "Труба профильная", "pipe-profile-100x100": "Труба профильная", "pipe-profile-gost-8645": "Труба профильная", "pipe-profile-gost-8639": "Труба профильная",
  "pipe-round-57": "Труба круглая", "pipe-round-76": "Труба круглая", "pipe-round-89": "Труба круглая", "pipe-round-108": "Труба круглая", "pipe-round-gost-10704": "Труба круглая", "pipe-round-gost-3262": "Труба круглая",
  "angle-25x25": "Уголок", "angle-40x40": "Уголок", "angle-50x50": "Уголок", "angle-gost-8509": "Уголок",
  "sheet-2": "Лист/плита", "sheet-3": "Лист/плита", "sheet-4": "Лист/плита", "sheet-5": "Лист/плита", "sheet-gost-19903": "Лист/плита"
};

// Маппинг доступных сортаментов для каждого металла (на основе реальных файлов данных)
export const METAL_TO_ASSORTMENTS: Record<string, string[]> = {
  black: [
    "rebar", "beam", "square", "circle", "strip", "sheet", "pipe-round", "pipe-profile", "angle", "channel", "hex",
    // Новые страницы: Арматура
    "rebar-10", "rebar-12", "rebar-14", "rebar-16", "rebar-20", "rebar-gost-5781",
    // Балка
    "beam-10", "beam-12", "beam-14", "beam-16", "beam-20", "beam-gost-8239", "beam-gost-26020",
    // Швеллер
    "channel-10p", "channel-14p", "channel-16p", "channel-20p", "channel-gost-8240",
    // Профильная труба
    "pipe-profile-20x20", "pipe-profile-40x20", "pipe-profile-40x40", "pipe-profile-50x50", "pipe-profile-60x40", "pipe-profile-60x60", "pipe-profile-80x80", "pipe-profile-100x100", "pipe-profile-gost-8645", "pipe-profile-gost-8639",
    // Круглая труба
    "pipe-round-57", "pipe-round-76", "pipe-round-89", "pipe-round-108", "pipe-round-gost-10704", "pipe-round-gost-3262",
    // Уголок
    "angle-25x25", "angle-40x40", "angle-50x50", "angle-gost-8509",
    // Лист
    "sheet-2", "sheet-3", "sheet-4", "sheet-5", "sheet-gost-19903"
  ],
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
  flange: { name: "фланца", gender: "m" },

  // Арматура ГОСТ и размеры
  "rebar-10": { name: "арматуры 10 мм", gender: "f", skipAdjective: true },
  "rebar-12": { name: "арматуры 12 мм", gender: "f", skipAdjective: true },
  "rebar-14": { name: "арматуры 14 мм", gender: "f", skipAdjective: true },
  "rebar-16": { name: "арматуры 16 мм", gender: "f", skipAdjective: true },
  "rebar-20": { name: "арматуры 20 мм", gender: "f", skipAdjective: true },
  "rebar-gost-5781": { name: "арматуры ГОСТ 5781-82", gender: "f", skipAdjective: true },

  // Балка ГОСТ и размеры
  "beam-10": { name: "балки 10", gender: "f", skipAdjective: true },
  "beam-12": { name: "балки 12", gender: "f", skipAdjective: true },
  "beam-14": { name: "балки 14", gender: "f", skipAdjective: true },
  "beam-16": { name: "балки 16", gender: "f", skipAdjective: true },
  "beam-20": { name: "балки 20", gender: "f", skipAdjective: true },
  "beam-gost-8239": { name: "балки ГОСТ 8239-89", gender: "f", skipAdjective: true },
  "beam-gost-26020": { name: "балки ГОСТ 26020-83", gender: "f", skipAdjective: true },

  // Швеллер
  "channel-10p": { name: "швеллера 10П", gender: "m" },
  "channel-14p": { name: "швеллера 14П", gender: "m" },
  "channel-16p": { name: "швеллера 16П", gender: "m" },
  "channel-20p": { name: "швеллера 20П", gender: "m" },
  "channel-gost-8240": { name: "швеллера ГОСТ 8240-97", gender: "m" },

  // Профильная труба
  "pipe-profile-20x20": { name: "профильной трубы 20х20", gender: "f" },
  "pipe-profile-40x20": { name: "профильной трубы 40х20", gender: "f" },
  "pipe-profile-40x40": { name: "профильной трубы 40х40", gender: "f" },
  "pipe-profile-50x50": { name: "профильной трубы 50х50", gender: "f" },
  "pipe-profile-60x40": { name: "профильной трубы 60х40", gender: "f" },
  "pipe-profile-60x60": { name: "профильной трубы 60х60", gender: "f" },
  "pipe-profile-80x80": { name: "профильной трубы 80х80", gender: "f" },
  "pipe-profile-100x100": { name: "профильной трубы 100х100", gender: "f" },
  "pipe-profile-gost-8645": { name: "профильной трубы ГОСТ 8645-68", gender: "f" },
  "pipe-profile-gost-8639": { name: "профильной трубы ГОСТ 8639-82", gender: "f" },

  // Круглая труба
  "pipe-round-57": { name: "трубы 57 мм", gender: "f" },
  "pipe-round-76": { name: "трубы 76 мм", gender: "f" },
  "pipe-round-89": { name: "трубы 89 мм", gender: "f" },
  "pipe-round-108": { name: "трубы 108 мм", gender: "f" },
  "pipe-round-gost-10704": { name: "электросварной трубы ГОСТ 10704-91", gender: "f" },
  "pipe-round-gost-3262": { name: "трубы ВГП ГОСТ 3262-75", gender: "f" },

  // Уголок
  "angle-25x25": { name: "уголка 25х25", gender: "m" },
  "angle-40x40": { name: "уголка 40х40", gender: "m" },
  "angle-50x50": { name: "уголка 50х50", gender: "m" },
  "angle-gost-8509": { name: "уголка ГОСТ 8509-93", gender: "m" },

  // Лист
  "sheet-2": { name: "листа 2 мм", gender: "m" },
  "sheet-3": { name: "листа 3 мм", gender: "m" },
  "sheet-4": { name: "листа 4 мм", gender: "m" },
  "sheet-5": { name: "листа 5 мм", gender: "m" },
  "sheet-gost-19903": { name: "листа ГОСТ 19903-74", gender: "m" }
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
};

export const IS_SUBPAGE: Record<string, string> = {
  "rebar-10": "Арматура 10 мм", "rebar-12": "Арматура 12 мм", "rebar-14": "Арматура 14 мм", "rebar-16": "Арматура 16 мм", "rebar-20": "Арматура 20 мм", "rebar-gost-5781": "Арматура ГОСТ 5781-82",
  "beam-10": "Балка 10", "beam-12": "Балка 12", "beam-14": "Балка 14", "beam-16": "Балка 16", "beam-20": "Балка 20", "beam-gost-8239": "Балка ГОСТ 8239-89", "beam-gost-26020": "Балка ГОСТ 26020-83",
  "channel-10p": "Швеллер 10П", "channel-14p": "Швеллер 14П", "channel-16p": "Швеллер 16П", "channel-20p": "Швеллер 20П", "channel-gost-8240": "Швеллер ГОСТ 8240-97",
  "pipe-profile-20x20": "Труба профильная 20х20", "pipe-profile-40x20": "Труба профильная 40х20", "pipe-profile-40x40": "Труба профильная 40х40", "pipe-profile-50x50": "Труба профильная 50х50", "pipe-profile-60x40": "Труба профильная 60х40", "pipe-profile-60x60": "Труба профильная 60х60", "pipe-profile-80x80": "Труба профильная 80х80", "pipe-profile-100x100": "Труба профильная 100х100", "pipe-profile-gost-8645": "Труба профильная ГОСТ 8645-68", "pipe-profile-gost-8639": "Труба профильная ГОСТ 8639-82",
  "pipe-round-57": "Труба круглая 57 мм", "pipe-round-76": "Труба круглая 76 мм", "pipe-round-89": "Труба круглая 89 мм", "pipe-round-108": "Труба круглая 108 мм", "pipe-round-gost-10704": "Труба электросварная ГОСТ 10704-91", "pipe-round-gost-3262": "Труба ВГП ГОСТ 3262-75",
  "angle-25x25": "Уголок 25х25", "angle-40x40": "Уголок 40х40", "angle-50x50": "Уголок 50х50", "angle-gost-8509": "Уголок ГОСТ 8509-93",
  "sheet-2": "Лист 2 мм", "sheet-3": "Лист 3 мм", "sheet-4": "Лист 4 мм", "sheet-5": "Лист 5 мм", "sheet-gost-19903": "Лист ГОСТ 19903-74"
};

export function getSeoData(metalSlug: string, assortmentSlug: string) {
  const metalName = METAL_SLUG_TO_NAME[metalSlug] || "Металл";
  const assortmentName = ASSORTMENT_SLUG_TO_NAME[assortmentSlug] || "Изделие";
  
  // Ищем базовый слаг, если это саб-страница (например "rebar-10" -> "rebar"), чтобы взять общие инструкции
  const baseSlugForInstructions = Object.keys(ASSORTMENT_SLUG_TO_NAME).find(
    key => ASSORTMENT_SLUG_TO_NAME[key] === assortmentName && !IS_SUBPAGE[key]
  ) || assortmentSlug;
  const instructionParams = ASSORTMENT_INSTRUCTIONS[assortmentSlug] || ASSORTMENT_INSTRUCTIONS[baseSlugForInstructions] || "геометрические параметры (ширину, длину, диаметр)";

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
