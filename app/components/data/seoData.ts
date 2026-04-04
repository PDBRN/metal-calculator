export interface NavLink {
  name: string;
  href: string;
}

export interface QuickPreset {
  label: string;
  field: string;
  value: string;
  beamType?: string;   // Для балки: автоматически установить тип балки
}

export interface SeoMetadata {
  presetTitle: string;
  presetHint: string;
  presets: QuickPreset[];
  seoDescription: string;
}

export const SEO_DATA: Record<string, SeoMetadata> = {

  // ─── АРМАТУРА ───
  "Арматура": {
    presetTitle: "Популярные диаметры",
    presetHint: "Нажмите, чтобы подставить диаметр в расчёт",
    presets: [
      { label: "⌀10", field: "d", value: "10" },
      { label: "⌀12", field: "d", value: "12" },
      { label: "⌀14", field: "d", value: "14" },
      { label: "⌀16", field: "d", value: "16" },
      { label: "⌀20", field: "d", value: "20" },
      { label: "⌀25", field: "d", value: "25" },
      { label: "⌀32", field: "d", value: "32" },
      { label: "⌀36", field: "d", value: "36" },
    ],
    seoDescription: "Расчёт подходит для горячекатаной арматуры классов А500С, А400 (Ат400С), А240 по ГОСТ 5781-82.\nПопулярные марки стали: 25Г2С, 35ГС, Ст3кп, Ст3сп."
  },

  // ─── БАЛКА/ДВУТАВР (пресеты устанавливают beamType + beamNumber) ───
  "Балка/двутавр": {
    presetTitle: "Популярные типоразмеры",
    presetHint: "Нажмите, чтобы подставить номер балки в расчёт",
    presets: [
      { label: "10 (ГОСТ)", field: "beamNumber", value: "10", beamType: "GOST_8239_89" },
      { label: "20 (ГОСТ)", field: "beamNumber", value: "20", beamType: "GOST_8239_89" },
      { label: "30 (ГОСТ)", field: "beamNumber", value: "30", beamType: "GOST_8239_89" },
      { label: "20Б1", field: "beamNumber", value: "20Б1", beamType: "B" },
      { label: "30Ш1", field: "beamNumber", value: "30Ш1", beamType: "SH" },
      { label: "35К1", field: "beamNumber", value: "35К1", beamType: "K" },
    ],
    seoDescription: "Калькулятор поддерживает двутавры: нормальные (Б), широкополочные (Ш), колонные (К) по ГОСТ 26020-83, ГОСТ 8239-89 и СТО АСЧМ 20-93.\nСталь: Ст3сп, 09Г2С."
  },

  // ─── ШВЕЛЛЕР ───
  "Швеллер": {
    presetTitle: "Популярные номера",
    presetHint: "Нажмите, чтобы подставить номер швеллера в расчёт",
    presets: [
      { label: "8П", field: "channelNumber", value: "8П" },
      { label: "10П", field: "channelNumber", value: "10П" },
      { label: "14П", field: "channelNumber", value: "14П" },
      { label: "16П", field: "channelNumber", value: "16П" },
      { label: "20П", field: "channelNumber", value: "20П" },
      { label: "24У", field: "channelNumber", value: "24У" },
      { label: "27П", field: "channelNumber", value: "27П" },
      { label: "30П", field: "channelNumber", value: "30П" },
    ],
    seoDescription: "Расчёт по ГОСТ 8240-97 (горячекатаный швеллер серии П и У) и ГОСТ 8278-83 (гнутый).\nМарки стали: Ст3сп, Ст3пс, 09Г2С."
  },

  // ─── ОТВОД ───
  "Отвод": {
    presetTitle: "Популярные размеры",
    presetHint: "Нажмите, чтобы подставить размер отвода в расчёт",
    presets: [
      { label: "57×3.5", field: "elbowSize", value: "57×3.5" },
      { label: "76×3.5", field: "elbowSize", value: "76×3.5" },
      { label: "89×4", field: "elbowSize", value: "89×4" },
      { label: "108×4", field: "elbowSize", value: "108×4" },
      { label: "159×4.5", field: "elbowSize", value: "159×4.5" },
      { label: "219×6", field: "elbowSize", value: "219×6" },
    ],
    seoDescription: "Расчёт стальных отводов крутоизогнутых по ГОСТ 17375-2001, сварных по ОСТ 36-21-77. Исполнение 1 и 2.\nМарки: Ст20, 09Г2С, 12Х18Н10Т."
  },

  // ─── СОРТАМЕНТЫ С ПОЛЕМ МАРКИ ───

  "Труба круглая": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "10", field: "steelMark", value: "10" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "09Г2С", field: "steelMark", value: "09Г2С" },
      { label: "17Г1С", field: "steelMark", value: "17Г1С" },
    ],
    seoDescription: "Расчёт электросварных труб по ГОСТ 10704-91, бесшовных по ГОСТ 8732-78, ВГП по ГОСТ 3262-75.\nМарки: Ст3сп, Ст10, Ст20, 09Г2С, 17Г1С."
  },

  "Труба профильная": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "10", field: "steelMark", value: "10" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "09Г2С", field: "steelMark", value: "09Г2С" },
    ],
    seoDescription: "Калькулятор для прямоугольных и квадратных профильных труб по ГОСТ 8645-68 и ГОСТ 8639-82.\nСталь: Ст3сп, Ст20, 09Г2С."
  },

  "Квадрат": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "45", field: "steelMark", value: "45" },
      { label: "40Х", field: "steelMark", value: "40Х" },
    ],
    seoDescription: "Расчёт горячекатаного квадрата по ГОСТ 2591-2006 и кованого по ГОСТ 1133-71.\nМарки: Ст3, Ст20, Ст45, 40Х, 65Г."
  },

  "Круг/пруток": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "45", field: "steelMark", value: "45" },
      { label: "09Г2С", field: "steelMark", value: "09Г2С" },
      { label: "40Х", field: "steelMark", value: "40Х" },
    ],
    seoDescription: "Расчёт горячекатаного круга по ГОСТ 2590-2006, калиброванного по ГОСТ 7417-75.\nМарки: Ст3сп, Ст20, Ст45, 09Г2С, 40Х."
  },

  "Лист/плита": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "09Г2С", field: "steelMark", value: "09Г2С" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "45", field: "steelMark", value: "45" },
    ],
    seoDescription: "Расчёт горячекатаного листа по ГОСТ 19903-74, холоднокатаного по ГОСТ 19904-90.\nМарки: Ст3сп, 09Г2С, 08кп, Ст20, Ст45."
  },

  "Уголок": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "09Г2С", field: "steelMark", value: "09Г2С" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "45", field: "steelMark", value: "45" },
    ],
    seoDescription: "Расчёт равнополочного уголка по ГОСТ 8509-93, неравнополочного по ГОСТ 8510-86.\nСталь: Ст3сп, Ст3кп, 09Г2С."
  },

  "Шестигранник": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "20", field: "steelMark", value: "20" },
      { label: "45", field: "steelMark", value: "45" },
      { label: "40Х", field: "steelMark", value: "40Х" },
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
    ],
    seoDescription: "Расчёт горячекатаного шестигранника по ГОСТ 2879-2006, калиброванного по ГОСТ 8560-78.\nМарки: Ст20, Ст35, Ст45, 40Х."
  },

  "Лента": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "Ст3", field: "steelMark", value: "Ст 3" },
      { label: "10", field: "steelMark", value: "10" },
      { label: "20", field: "steelMark", value: "20" },
      { label: "65Г", field: "steelMark", value: "65Г" },
    ],
    seoDescription: "Расчёт стальной ленты по ГОСТ 3560-73 и ГОСТ 6009-74.\nМарки: Ст3сп, Ст10, Ст20, 08кп."
  },

  // ─── НЕРЖАВЕЙКА ───
  "Нержавейка": {
    presetTitle: "Популярные марки",
    presetHint: "Нажмите, чтобы подставить марку в расчёт",
    presets: [
      { label: "AISI 304", field: "steelMark", value: "AISI 304" },
      { label: "AISI 316", field: "steelMark", value: "AISI 316" },
      { label: "AISI 430", field: "steelMark", value: "AISI 430" },
      { label: "12Х18Н10Т", field: "steelMark", value: "12Х18Н10Т" },
    ],
    seoDescription: "Расчёт нержавеющего проката по ГОСТ 5632-72. Аустенитные марки: AISI 304 (08Х18Н10), AISI 316 (10Х17Н13М2Т).\nФерритные: AISI 430 (12Х17)."
  },
};

export const DEFAULT_SEO: SeoMetadata = {
  presetTitle: "Популярные марки",
  presetHint: "Нажмите, чтобы подставить марку в расчёт",
  presets: [
    { label: "Ст3", field: "steelMark", value: "Ст 3" },
    { label: "20", field: "steelMark", value: "20" },
    { label: "45", field: "steelMark", value: "45" },
    { label: "09Г2С", field: "steelMark", value: "09Г2С" },
  ],
  seoDescription: "Онлайн расчёт веса и длины металлопроката. Поддерживаемые стандарты: ГОСТ 380-2005, ГОСТ 1050-88.\nМарки: Ст3сп, Ст20, Ст45, 09Г2С."
};
