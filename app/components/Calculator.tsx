"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SEO_DATA, DEFAULT_SEO } from "./data/seoData";
import type { NavLink } from "./data/seoData";
import { METAL_TO_ASSORTMENTS, ASSORTMENT_SLUG_TO_NAME, METAL_SLUG_TO_NAME, getSeoData } from "../lib/seo-engine";
import { CHANNEL_KG_PER_M } from "./data";

import { cn, fmtNum, toNum, UiSelect, InputField } from "./ui";
import {
  METALS,
  METAL_DATA,
  BEAM_TYPES,
  BEAM_NUMBERS_BY_TYPE,
  STEEL_GRADES,
  STAINLESS_GRADES,
  ALUMINUM_GRADES,
  COPPER_GRADES,
  BRASS_GRADES,
  BRONZE_GRADES,
  TITAN_GRADES,
  ELBOW_EXECUTIONS,
  ELBOW_SIZES,
  Metal,
} from "./data";
import type { ElbowExecution, ElbowSize } from "./data";
import { getOffers } from "./offersConfig";
import { calculateResult, calcPlateArea } from "./calc";
import type { CalcInputs } from "./calc";
import AssortmentScheme from "./schemes";
import { OffersPanel } from "./OffersPanel";
import { useRouter, useSearchParams } from "next/navigation";

console.log("[BUNDLE] Calculator.tsx LOADED");

type Mode = "weight" | "length";

interface CalculatorProps {
  initialMetal?: Metal;
  initialAssortment?: string;
  initialSlug?: string;
  seoTitle?: string;
  seoTitleSuffix?: string;
  showHistory?: boolean;
  isMainPage?: boolean;
}

export function Calculator({ initialMetal, initialAssortment, initialSlug, seoTitle, seoTitleSuffix, showHistory = false, isMainPage = false }: CalculatorProps = {}) {
  console.log("[CALC] Render Calculator");
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Верхний уровень ---
  const [metal, setMetal] = useState<Metal>(initialMetal || "Чёрный");
  const [assortment, setAssortment] = useState(initialAssortment || "");
  const [mode, setMode] = useState<Mode>("weight");

  // Синхронизация пропсов при софт-навигации (Next.js Link)
  useEffect(() => {
    if (initialMetal) setMetal(initialMetal);
    if (initialAssortment) setAssortment(initialAssortment);
  }, [initialMetal, initialAssortment]);

  // Синхронизация с URL при первом входе
  useEffect(() => {
    console.log("[CALC] Client Mount - Syncing Params");
    const metalParam = searchParams.get("metal") as Metal;
    const assortmentParam = searchParams.get("assortment");
    const modeParam = searchParams.get("mode") as Mode;

    if (isMetal(metalParam)) {
      console.log("[CALC] Set metal from param:", metalParam);
      setMetal(metalParam);
    }
    if (assortmentParam) {
      console.log("[CALC] Set assortment from param:", assortmentParam);
      setAssortment(assortmentParam);
    }
    if (modeParam === "weight" || modeParam === "length") {
      console.log("[CALC] Set mode from param:", modeParam);
      setMode(modeParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Общие поля ---
  // Используем как "Марка стали" (пока влияет только на UI, не на расчёт)
  const [steelMark, setSteelMark] = useState("Ст 3");

  // --- Балка/двутавр ---
  const [beamType, setBeamType] = useState(() => {
    if (initialSlug?.replace('beam-', '') === 'gost-26020') return 'GOST_26020_83';
    return 'GOST_8239_89';
  });
  const [beamNumber, setBeamNumber] = useState(() => {
    if (initialSlug?.startsWith('beam-') && !initialSlug.includes('gost')) return initialSlug.replace('beam-', '');
    return "";
  });

  // --- Швеллер ---
  const [channelNumber, setChannelNumber] = useState(() => {
    if (initialSlug?.startsWith('channel-') && !initialSlug.includes('gost')) return initialSlug.replace('channel-', '').toUpperCase().replace('P', 'П').replace('U', 'У');
    return "20П";
  });

  // --- Отвод ---
  const [elbowExecution, setElbowExecution] = useState<ElbowExecution>("Исполнение 1");
  const [elbowSize, setElbowSize] = useState<ElbowSize>(ELBOW_SIZES[0]);


  // --- Геометрия (мм в UI -> в calc переводим в метры) ---
  const [d, setD] = useState(() => {
    if (initialSlug?.startsWith('rebar-') && !initialSlug.includes('gost')) return initialSlug.replace('rebar-', '');
    if (initialSlug?.startsWith('pipe-round-') && !initialSlug.includes('gost')) return initialSlug.replace('pipe-round-', '');
    return "10";
  });
  const [t, setT] = useState(() => {
    if (initialSlug?.startsWith('sheet-') && !initialSlug.includes('gost')) return initialSlug.replace('sheet-', '');
    return "";
  });
  const [a, setA] = useState(() => {
    if (initialSlug?.startsWith('pipe-profile-') && !initialSlug.includes('gost')) return initialSlug.replace('pipe-profile-', '').split('x')[0];
    if (initialSlug?.startsWith('angle-') && !initialSlug.includes('gost')) return initialSlug.replace('angle-', '').split('x')[0];
    return "";
  });
  const [b, setB] = useState(() => {
    if (initialSlug?.startsWith('pipe-profile-') && !initialSlug.includes('gost')) return initialSlug.replace('pipe-profile-', '').split('x')[1];
    if (initialSlug?.startsWith('angle-') && !initialSlug.includes('gost')) return initialSlug.replace('angle-', '').split('x')[1];
    return "";
  });

  // --- Ввод расчёта ---
  const [len, setLen] = useState(""); // L (м)
  const [weightInput, setWeightInput] = useState(""); // кг (для режима length)
  const [qty, setQty] = useState("1"); // шт

  // --- Результат ---
  const [result, setResult] = useState(0);

  const [area, setArea] = useState(0);

  // Переключение правой панели: чертеж или история
  const [rightPanel, setRightPanel] = useState<"scheme" | "history">("scheme");

  // Динамические данные для СЕО блока (пресеты)
  const seoMetadata = useMemo(() => {
    if (metal === "Нержавейка") return SEO_DATA["Нержавейка"];
    return SEO_DATA[assortment] || DEFAULT_SEO;
  }, [metal, assortment]);

  // Динамические ссылки "Смотрите также"
  // Главная страница — кросс-металловые ссылки (статичные)
  // Внутренние страницы — другие сортаменты того же металла
  const MAIN_PAGE_LINKS: NavLink[] = [
    { name: "Калькулятор веса стального металлопроката", href: "/black/pipe-round/" },
    { name: "Калькулятор веса нержавеющего проката", href: "/stainless/sheet/" },
    { name: "Калькулятор веса алюминиевого проката", href: "/aluminum/sheet/" },
    { name: "Калькулятор веса медного проката", href: "/copper/pipe-round/" },
    { name: "Калькулятор веса латунного проката", href: "/brass/circle/" },
    { name: "Калькулятор веса бронзового проката", href: "/bronze/circle/" },
    { name: "Калькулятор веса титанового проката", href: "/titanium/sheet/" },
  ];

  const seeAlsoLinks = useMemo((): NavLink[] => {
    if (isMainPage) return MAIN_PAGE_LINKS;

    // Находим slug текущего металла
    const metalSlug = Object.entries(METAL_SLUG_TO_NAME).find(([, name]) => name === metal)?.[0];
    if (!metalSlug) return MAIN_PAGE_LINKS;

    // Находим slug текущего сортамента
    const currentAssortmentSlug = Object.entries(ASSORTMENT_SLUG_TO_NAME).find(([, name]) => name === assortment)?.[0];

    // Все сортаменты этого металла, кроме текущего
    const assortments = METAL_TO_ASSORTMENTS[metalSlug] || [];
    return assortments
      .filter(slug => slug !== currentAssortmentSlug)
      .map(slug => {
        const { h1_suffix } = getSeoData(metalSlug, slug);
        return {
          name: `Калькулятор веса ${h1_suffix}`,
          href: `/${metalSlug}/${slug}/`
        };
      });
  }, [metal, assortment, isMainPage]);

  // Статичная история для примера
  const history = [
    { metal: "Чёрный", item: "Труба 40x20x2", weight: "125.4 кг", date: "14:20" },
    { metal: "Нержавейка", item: "AISI 304 3мм", weight: "48.2 кг", date: "13:45" },
    { metal: "Алюминий", item: "Уголок 50х50х5", weight: "12.8 кг", date: "12:10" },
    { metal: "Чёрный", item: "A500C 12мм", weight: "342 кг", date: "Вчера" },
    { metal: "Медь", item: "Пруток 20мм", weight: "5.4 кг", date: "2 дн. назад" },
  ];

  // Список сортамента по металлу
  const availableAssortments = useMemo(() => METAL_DATA[metal] || [], [metal]);

  // Опции балки (номера) по типу
  const beamNumbersOptions = useMemo(() => {
    const list = BEAM_NUMBERS_BY_TYPE[beamType] || [];
    // ВАЖНО: для балок номера не всегда числа, поэтому сортируем как строки
    return [...list].sort((x, y) => x.localeCompare(y, "ru"));
  }, [beamType]);

  // Адаптер для UiSelect, чтобы избежать as any
  const metalOptions = [...METALS];

  function isMetal(v: string): v is Metal {
    return (METALS as readonly string[]).includes(v);
  }

  const handleMetalChange = (v: string) => {
    if (isMetal(v)) {
      setMetal(v);
      setAssortment(""); // Сбрасываем сортамент только при ручном выборе
    }
  };

  useEffect(() => {
    setResult(0);

    // Сброс марки / сплава
    if (metal === "Нержавейка") {
      setSteelMark(STAINLESS_GRADES[0]);
    } else if (metal === "Чёрный") {
      setSteelMark(STEEL_GRADES[0]);
    } else if (metal === "Алюминий") {
      setSteelMark(ALUMINUM_GRADES[0]);
    } else if (metal === "Медь") {
      setSteelMark(COPPER_GRADES[0]);
    } else if (metal === "Латунь") {
      setSteelMark(BRASS_GRADES[0]);
    } else if (metal === "Бронза") {
      setSteelMark(BRONZE_GRADES[0]);
    } else if (metal === "Титан") {
      setSteelMark(TITAN_GRADES[0]);
    } else {
      // Для цветных пока нет списков марок, или можно добавить заглушки
      setSteelMark("");
    }
  }, [metal]);

  useEffect(() => {
    setResult(0);

    // Когда выбрали балку — подставим номер по умолчанию
    if (assortment === "Балка/двутавр") {
      setBeamNumber(prev => prev ? prev : (beamNumbersOptions[0] || ""));
      if (!qty) setQty("1");
    }

    // Когда выбрали отвод
    if (assortment === "Отвод") {
      setElbowExecution("Исполнение 1");
      setElbowSize(ELBOW_SIZES[0]);
      setMode("weight"); // Отводы считаются только по весу (шт)
      if (!qty) setQty("1");
    }

    // Когда выбрали лист/плиту
    if (assortment === "Лист/плита") {
      setMode("weight");
      if (!qty) setQty("1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, assortment]);

  // Синхронизация при выборе сортамента

  // Обновление URL при изменении параметров
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams(searchParams.toString());

    if (metal) newParams.set("metal", metal);
    if (assortment) newParams.set("assortment", assortment);
    if (mode) newParams.set("mode", mode);

    // Только если что-то реально изменилось
    if (newParams.toString() !== currentParams.toString()) {
      const queryString = newParams.toString();
      const url = queryString ? `?${queryString}` : "";
      router.replace(url, { scroll: false });
    }
  }, [metal, assortment, mode, router, searchParams]);

  // --- Расчет ---
  const handleCalculate = () => {
    if (!assortment) return;

    const inputs: CalcInputs = {
      qty: toNum(qty) || 1,
      len: toNum(len),
      weight: toNum(weightInput),

      // мм -> м
      d: toNum(d) / 1000,
      a: toNum(a) / 1000,
      b: toNum(b) / 1000,
      t: toNum(t) / 1000,

      // Балка
      steelMark,
      beamType,
      beamNumber,
      channelNumber,
      elbowExecution,
      elbowSize,
    };

    const res = calculateResult(mode, metal, assortment, inputs);
    setResult(res);

    if (assortment === "Лист/плита") {
      const plateArea = calcPlateArea(inputs.a, inputs.b, inputs.qty ?? 1);
      setArea(plateArea);
    } else {
      setArea(0);
    }
  };

  // --- Рендер блоков полей по сортаменту ---
  // Определяем список марок для текущего металла
  let markOptions: string[] = [];
  let markLabel = "Марка стали";
  let showMark = false;

  useEffect(() => {
    if (metal && assortment) {
      // Предзагрузка предложений в фоновом режиме в кэш
      getOffers(metal, assortment).catch(() => {});
    }
  }, [metal, assortment]);

  if (metal === "Чёрный") {
    markOptions = [...STEEL_GRADES];
    markLabel = "Марка стали";
    showMark = true;
  } else if (metal === "Нержавейка") {
    markOptions = [...STAINLESS_GRADES];
    markLabel = "Марка стали";
    showMark = true;
  } else if (metal === "Алюминий") {
    markOptions = [...ALUMINUM_GRADES];
    markLabel = "Марка сплава";
    showMark = true;
  } else if (metal === "Медь") {
    markOptions = [...COPPER_GRADES];
    markLabel = "Марка меди";
    showMark = true;
  } else if (metal === "Латунь") {
    markOptions = [...BRASS_GRADES];
    markLabel = "Марка латуни";
    showMark = true;
  } else if (metal === "Бронза") {
    markOptions = [...BRONZE_GRADES];
    markLabel = "Марка бронзы";
    showMark = true;
  } else if (metal === "Титан") {
    markOptions = [...TITAN_GRADES];
    markLabel = "Марка титана";
    showMark = true;
  }

  const validationErrors = useMemo(() => {
    const errors: Record<string, { active: boolean; message: string }> = {};
    const dT = toNum(d);
    const tT = toNum(t);
    const aT = toNum(a);
    const bT = toNum(b);

    if (assortment === "Труба круглая") {
      if (tT > 0 && dT > 0 && tT >= dT / 2) {
        errors.d = { active: true, message: "" };
        errors.t = { active: true, message: "Толщина стенки слишком велика для такого диаметра" };
      }
    }

    if (assortment === "Труба профильная") {
      if (tT > 0) {
        if (aT > 0 && tT >= aT / 2) {
          errors.a = { active: true, message: "" };
          errors.t = { active: true, message: "Стенка t не может быть ≥ A/2" };
        }
        if (bT > 0 && tT >= bT / 2) {
          errors.b = { active: true, message: "" };
          errors.t = { active: true, message: "Стенка t не может быть ≥ B/2" };
        }
      }
    }

    return errors;
  }, [assortment, d, t, a, b]);

  const renderAssortmentFields = () => {
    if (!assortment) {
      return (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full items-center justify-center pt-10 text-zinc-400 text-sm"
        >
          ← Выберите тип изделия
        </motion.div>
      );
    }

    return (
      <motion.div
        key={assortment}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {/* ---- БАЛКА/ДВУТАВР ---- */}
        {assortment === "Балка/двутавр" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UiSelect
                label="Тип балки"
                value={beamType}
                onChange={(val) => {
                  setBeamType(val);
                  const list = BEAM_NUMBERS_BY_TYPE[val] || [];
                  const sorted = [...list].sort((x, y) => x.localeCompare(y, "ru"));
                  setBeamNumber(sorted[0] || "");
                }}
                options={BEAM_TYPES}
              />

              <UiSelect
                label="Номер балки"
                value={beamNumber}
                onChange={setBeamNumber}
                options={beamNumbersOptions}
              />

              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}

              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- АРМАТУРА ---- */}
        {assortment === "Арматура" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1 ряд (на sm+): Диаметр слева, справа пусто */}
              <UiSelect
                label="Диаметр (мм)"
                value={d}
                onChange={setD}
                options={["6", "8", "10", "12", "14", "16", "20", "25", "32", "36"]}
                error={validationErrors.d?.active}
                errorText={validationErrors.d?.message}
              />
              <div className="hidden sm:block" />

              {/* 2 ряд: слева Длина/Вес, справа Количество */}
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}

              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- КВАДРАТ (стальной) ---- */}
        {assortment === "Квадрат" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            {/* 1 ряд: сторона a (вторая ячейка пустая на десктопе) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Сторона a"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
              <div className="hidden sm:block" />
            </div>

            {/* 2 ряд: длина/вес + количество (рядом) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- КРУГ/ПРУТОК ---- */}
        {assortment === "Круг/пруток" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Диаметр D"
                value={d}
                onChange={setD}
                suffix="мм"
                error={validationErrors.d?.active}
                errorText={validationErrors.d?.message}
              />
              <div className="hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}


        {/* ---- ЛЕНТА ---- */}
        {assortment === "Лента" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Толщина t"
                value={t}
                onChange={setT}
                suffix="мм"
                error={validationErrors.t?.active}
                errorText={validationErrors.t?.message}
              />
              <InputField
                label="Ширина a"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}


        {/* ---- ЛИСТ/ПЛИТА ---- */}
        {assortment === "Лист/плита" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Толщина t"
                value={t}
                onChange={setT}
                suffix="мм"
                error={validationErrors.t?.active}
                errorText={validationErrors.t?.message}
              />
              <InputField
                label="Ширина a"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Длина b"
                value={b}
                onChange={setB}
                suffix="мм"
                error={validationErrors.b?.active}
                errorText={validationErrors.b?.message}
              />
              <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
            </div>
          </div>
        )}


        {/* ---- ТРУБА ПРОФИЛЬНАЯ ---- */}
        {assortment === "Труба профильная" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Ширина A"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
              <InputField
                label="Высота B"
                value={b}
                onChange={setB}
                suffix="мм"
                error={validationErrors.b?.active}
                errorText={validationErrors.b?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Стенка t"
                value={t}
                onChange={setT}
                suffix="мм"
                error={validationErrors.t?.active}
                errorText={validationErrors.t?.message}
              />
              <div className="hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}



        {/* ---- ТРУБА КРУГЛАЯ ---- */}
        {assortment === "Труба круглая" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Внешний диаметр D"
                value={d}
                onChange={setD}
                suffix="мм"
                error={validationErrors.d?.active}
                errorText={validationErrors.d?.message}
              />
              <InputField
                label="Толщина стенки t"
                value={t}
                onChange={setT}
                suffix="мм"
                error={validationErrors.t?.active}
                errorText={validationErrors.t?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}



        {/* ---- УГОЛОК ---- */}
        {assortment === "Уголок" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Ширина полки a"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
              <InputField
                label="Высота полки b"
                value={b}
                onChange={setB}
                suffix="мм"
                error={validationErrors.b?.active}
                errorText={validationErrors.b?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Толщина полки t"
                value={t}
                onChange={setT}
                suffix="мм"
                error={validationErrors.t?.active}
                errorText={validationErrors.t?.message}
              />
              <div className="hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- ОТВОД ---- */}
        {assortment === "Отвод" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <UiSelect
                label="Исполнение"
                value={elbowExecution}
                onChange={(v) => setElbowExecution(v as ElbowExecution)}
                options={[...ELBOW_EXECUTIONS]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UiSelect
                label="Размер"
                value={elbowSize}
                onChange={(v) => setElbowSize(v as ElbowSize)}
                options={[...ELBOW_SIZES]}
              />

              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- ШВЕЛЛЕР ---- */}
        {assortment === "Швеллер" && (
          <div className="space-y-4">
            <UiSelect
              label="Номер швеллера"
              value={channelNumber}
              onChange={setChannelNumber}
              options={Object.keys(CHANNEL_KG_PER_M)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}

        {/* ---- ШЕСТИГРАННИК ---- */}
        {assortment === "Шестигранник" && (
          <div className="space-y-4">
            {showMark && (
              <UiSelect
                label={markLabel}
                value={steelMark}
                onChange={setSteelMark}
                options={markOptions}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Номер шестигранника a"
                value={a}
                onChange={setA}
                suffix="мм"
                error={validationErrors.a?.active}
                errorText={validationErrors.a?.message}
              />
              <div className="hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "weight" ? (
                <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          </div>
        )}


        {/* ---- Общий ввод (кроме арматуры, балки и квадрата) ---- */}
        {assortment !== "Арматура" &&
          assortment !== "Балка/двутавр" &&
          assortment !== "Квадрат" &&
          assortment !== "Лента" &&
          assortment !== "Лист/плита" &&
          assortment !== "Круг/пруток" &&
          assortment !== "Труба круглая" &&
          assortment !== "Труба профильная" &&
          assortment !== "Уголок" &&
          assortment !== "Швеллер" &&
          assortment !== "Шестигранник" &&
          assortment !== "Отвод" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {mode === "weight" ? (
                <>
                  {assortment !== "Лист/плита" && (
                    <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
                  )}
                </>
              ) : (
                <InputField
                  label="Общий вес"
                  value={weightInput}
                  onChange={setWeightInput}
                  suffix="кг"
                />
              )}
              {/* <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" /> */}
            </div>
          )}
      </motion.div>
    );
  };


  return (
    <div className="w-full flex justify-center text-zinc-900 font-sans">
      <div className="w-full max-w-4xl flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "w-full bg-white shadow-2xl shadow-zinc-200/50 ring-1 ring-zinc-100 transition-all duration-300 relative",
            result > 0 ? "rounded-t-3xl rounded-b-none" : "rounded-3xl"
          )}
        >
        <div className={cn(
          "flex flex-col md:flex-row h-full overflow-hidden",
          result > 0 ? "rounded-t-3xl rounded-b-none" : "rounded-3xl"
        )}>
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            {/* Заголовок + режим */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">
                Калькулятор<span className="text-blue-600"> металла</span>
              </h2>

              <div className="flex bg-zinc-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setMode("weight")}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-[9px] transition-all cursor-pointer",
                    mode === "weight"
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Вес
                </button>
                <button
                  onClick={() => setMode("length")}
                  disabled={assortment === "Отвод" || assortment === "Лист/плита"}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-[9px] transition-all cursor-pointer",
                    mode === "length"
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                      : "text-zinc-500 hover:text-zinc-700",
                    (assortment === "Отвод" || assortment === "Лист/плита") &&
                    "opacity-50 cursor-not-allowed hover:text-zinc-500"
                  )}
                >
                  Длина
                </button>
              </div>
            </div>

            {/* Металл / Сортамент */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UiSelect
                label="Металл"
                value={metal}
                onChange={handleMetalChange}
                options={metalOptions}
                placeholder="Выберите металл"
              />
              <UiSelect
                label="Сортамент"
                value={assortment}
                onChange={setAssortment}
                options={availableAssortments}
                placeholder="Выберите сортамент"
              />
            </div>

            <div className="h-px w-full bg-zinc-100 my-2" />

            {/* Поля сортамента */}
            <div className="space-y-4 min-h-[260px]">
              <AnimatePresence mode="wait">{renderAssortmentFields()}</AnimatePresence>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleCalculate}
              disabled={!assortment}
              className={cn(
                "relative w-full overflow-hidden rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98]",
                !assortment
                  ? "bg-zinc-300 cursor-not-allowed shadow-none"
                  : "bg-blue-600 shadow-blue-600/30 hover:bg-blue-700 cursor-pointer"
              )}
            >
              {mode === "weight" ? "Рассчитать вес" : "Рассчитать длину"}
            </button>
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className={cn(
            "order-last md:order-none w-full md:w-[340px] bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-100 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative h-[560px]",
            rightPanel === "history" && "bg-white text-zinc-900 shadow-sm"
          )}>
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none opacity-50" />

            {/* КОНТЕНТ (СТАТИЧНАЯ ВЫСОТА) */}
            <div className="relative z-10 flex-1 flex flex-col pt-2 h-[320px] overflow-hidden">
                <AnimatePresence mode="wait">
                  {rightPanel === "scheme" ? (
                    <motion.div
                      key="scheme"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                       <AssortmentScheme
                         assortment={assortment}
                         d={
                           assortment === "Швеллер" ? channelNumber :
                             assortment === "Отвод" ? elbowSize :
                               assortment === "Балка/двутавр" ? beamNumber :
                                 d
                         }
                         a={a}
                         b={assortment === "Лента" ? len : b}
                         t={t}
                         beamType={assortment === "Балка/двутавр" ? beamType : undefined}
                       />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.1 }}
                      className="w-full h-full flex flex-col"
                    >
                       <div className="flex items-center justify-between mb-4 pt-1 px-1">
                          <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest leading-none">История</h4>
                          <span className="text-[8px] font-black text-zinc-300">5 ЗАПИСЕЙ</span>
                       </div>
                       <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-none">
                          {history.map((log, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white border border-zinc-100 hover:border-blue-100 transition-all shadow-sm cursor-pointer group active:scale-[0.98]">
                               <div className="flex justify-between items-start mb-0.5">
                                  <span className="text-[8px] font-black text-blue-500/40 uppercase tracking-widest">{log.metal}</span>
                                  <span className="text-[8px] text-zinc-300">{log.date}</span>
                               </div>
                               <div className="text-[11px] font-bold text-zinc-900 group-hover:text-blue-600 truncate">{log.item}</div>
                               <div className="text-[10px] font-black text-zinc-400 mt-1">{log.weight}</div>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <div className="relative z-10 space-y-1 mt-auto pt-6 border-t border-zinc-100/60">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">
                {mode === "weight" ? "Вес итог" : "Длина итог"}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tighter leading-none">
                  {Object.values(validationErrors).some(e => e.active) ? "—" : fmtNum(result)}
                </span>
                <span className="text-sm font-bold text-zinc-300 tracking-tighter uppercase">{mode === "weight" ? "кг" : "м"}</span>
              </div>

              <div className="text-[9px] font-bold text-zinc-400/80 mt-1 h-3 uppercase tracking-[0.1em]">
                {assortment ? `${metal} • ${assortment}` : ""}
              </div>
            </div>
          </div>
        </div>

        {/* КОМПАКТНАЯ ЗАКЛАДКА "ИСТОРИЯ" — только на test1 (вынесено из-под overflow-hidden) */}
        {showHistory && (
          <button 
            onClick={() => setRightPanel(rightPanel === "scheme" ? "history" : "scheme")}
            className={cn(
              "absolute -right-[31px] top-0 h-24 w-8 border border-zinc-200 border-l-0 flex flex-col items-center justify-center transition-all group z-30 shadow-sm",
              rightPanel === "history" 
                ? "bg-blue-600 border-blue-600 rounded-r-xl rounded-tl-none shadow-lg ring-2 ring-blue-500/10" 
                : "bg-zinc-100 rounded-br-xl rounded-tr-xl hover:bg-zinc-50 hover:translate-x-[2px]"
            )}
          >
            {/* Подсветка сбоку (слева внутри кнопки) */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-0.5 transition-colors",
              rightPanel === "history" ? "bg-white/40" : "bg-blue-500/20 group-hover:bg-blue-500"
            )} />
            
            <div className={cn(
              "font-black uppercase tracking-[0.1em] transition-colors text-[9px] [writing-mode:vertical-lr] rotate-180 flex items-center justify-center h-full w-full",
              rightPanel === "history" ? "text-white" : "text-zinc-500 group-hover:text-zinc-900"
            )}>
              {rightPanel === "history" ? "Чертеж" : "История"}
            </div>
          </button>
        )}

        </motion.div>

        {/* Блок предложений — СРАЗУ под калькулятором */}
        {result > 0 && (
          <div className="w-full">
            <OffersPanel metal={metal} assortment={assortment} />
          </div>
        )}

        {/* БЛОК СЕО: СМОТРИТЕ ТАКЖЕ + УМНЫЕ ПРЕСЕТЫ */}
        <div className="w-full mt-16 mb-6 px-6 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-900">
            {/* Левая колонка: См. также */}
            <motion.div
              key={`nav-${assortment}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-6 flex items-center gap-3">
                Смотрите также
                <div className="h-px flex-1 bg-zinc-100" />
              </h3>
              <ul className="space-y-3">
                {seeAlsoLinks.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href}
                      className="text-[12px] font-medium text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 rounded-full bg-zinc-300 group-hover:bg-blue-500 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Правая колонка: Умные пресеты */}
            <motion.div
              key={`presets-${assortment}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-6 flex items-center gap-3">
                {seoMetadata.presetTitle}
                <div className="h-px flex-1 bg-zinc-100" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {seoMetadata.presets.map((preset, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (preset.field === "steelMark") setSteelMark(preset.value);
                      else if (preset.field === "d") setD(preset.value);
                      else if (preset.field === "beamNumber") {
                        if (preset.beamType) setBeamType(preset.beamType);
                        setBeamNumber(preset.value);
                      }
                      else if (preset.field === "channelNumber") setChannelNumber(preset.value);
                      else if (preset.field === "elbowSize") setElbowSize(preset.value as ElbowSize);
                    }}
                    className="px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-[11px] font-black text-zinc-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                    title={`${seoMetadata.presetHint}: ${preset.label}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="text-[9px] font-bold text-zinc-300 mt-4 uppercase tracking-wider">
                * {seoMetadata.presetHint}
              </p>
            </motion.div>
          </div>

          {/* SEO-описание (видимый, легальный текст с ключевыми словами) */}
          <p className="text-[11px] text-zinc-400 leading-relaxed mt-8 max-w-2xl">
            {seoMetadata.seoDescription.split('\n').map((line, i) => (
              <span key={i}>{line}{i < seoMetadata.seoDescription.split('\n').length - 1 && <br />}</span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

// Удалено внутреннее обертывание в Suspense, оно перенесено в page.tsx
