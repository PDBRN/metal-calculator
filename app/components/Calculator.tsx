"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn, fmtNum, toNum, UiSelect, InputField } from "./ui";
import {
  METALS,
  METAL_DATA,
  BEAM_TYPES,
  BEAM_NUMBERS_BY_TYPE,
  STEEL_GRADES,
} from "./data";
import { calculateResult, calcPlateArea } from "./calc";
import AssortmentScheme from "./schemes";

type Mode = "weight" | "length";

export default function Calculator() {
  // --- Верхний уровень ---
  const [metal, setMetal] = useState("Чёрный");
  const [assortment, setAssortment] = useState("");
  const [mode, setMode] = useState<Mode>("weight");

  // --- Общие поля ---
  // Используем как "Марка стали" (пока влияет только на UI, не на расчёт)
  const [steelMark, setSteelMark] = useState("Ст 3");

  // --- Балка/двутавр ---
  const [beamType, setBeamType] = useState("GOST_8239_89");
  const [beamNumber, setBeamNumber] = useState("");

  // --- Геометрия (мм в UI -> в calc переводим в метры) ---
  const [d, setD] = useState("10"); // диаметр (мм)
  const [t, setT] = useState(""); // толщина/стенка (мм)
  const [a, setA] = useState(""); // a (мм)
  const [b, setB] = useState(""); // b (мм)

  // --- Ввод расчёта ---
  const [len, setLen] = useState(""); // L (м)
  const [weightInput, setWeightInput] = useState(""); // кг (для режима length)
  const [qty, setQty] = useState("1"); // шт

  // --- Результат ---
  const [result, setResult] = useState(0);

  const [area, setArea] = useState(0);

  // Список сортамента по металлу
  const availableAssortments = useMemo(() => METAL_DATA[metal] || [], [metal]);

  // Опции балки (номера) по типу
  const beamNumbersOptions = useMemo(() => {
    const list = BEAM_NUMBERS_BY_TYPE[beamType] || [];
    // ВАЖНО: для балок номера не всегда числа, поэтому сортируем как строки
    return [...list].sort((x, y) => x.localeCompare(y, "ru"));
  }, [beamType]);

  // --- Сбросы при смене контекста ---
  useEffect(() => {
    setAssortment("");
    setResult(0);
  }, [metal]);

  useEffect(() => {
    setResult(0);

    // Когда выбрали балку — подставим номер по умолчанию
    if (assortment === "Балка/двутавр") {
      const first = beamNumbersOptions[0] || "";
      setBeamNumber(first);
      if (!qty) setQty("1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, assortment]);

  // Если изменился тип балки — обновляем номер балки на первый доступный
  useEffect(() => {
    if (assortment !== "Балка/двутавр") return;
    const first = beamNumbersOptions[0] || "";
    setBeamNumber(first);
  }, [beamType, beamNumbersOptions, assortment]);

  // --- Расчет ---
  const handleCalculate = () => {
    if (!assortment) return;

    const inputs = {
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
    };

    const res = calculateResult(mode, metal, assortment, inputs as any);
    setResult(res);

    if (assortment === "Лист/плита") {
      const plateArea = calcPlateArea(inputs.a, inputs.b, inputs.qty ?? 1);
      setArea(plateArea);
    } else {
      setArea(0);
  }
  };

  // --- Рендер блоков полей по сортаменту ---
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
                onChange={setBeamType}
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

              <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
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

              <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
            </div>
          </div>
        )}

        {/* ---- КВАДРАТ (стальной) ---- */}
        {assortment === "Квадрат" && (
          <div className="space-y-4">
            <UiSelect
              label="Марка стали"
              value={steelMark}
              onChange={setSteelMark}
              options={STEEL_GRADES as unknown as string[]}
            />

            {/* 1 ряд: сторона a (вторая ячейка пустая на десктопе) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Сторона a" value={a} onChange={setA} suffix="мм" />
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
              <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
            </div>
          </div>
        )}

        {assortment === "Круг/пруток" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
      className="sm:col-span-1"
    />
    <div className="hidden sm:block" />
  </div>
)}


{/* ---- ЛЕНТА ---- */}
{assortment === "Лента" && (
  <div className="space-y-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Толщина t" value={t} onChange={setT} suffix="мм" />
      <InputField label="Ширина a" value={a} onChange={setA} suffix="мм" />
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
      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
    </div>
  </div>
)}


        {/* ---- ЛИСТ/ПЛИТА ---- */}
        {assortment === "Лист/плита" && (
  <div className="space-y-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Толщина t" value={t} onChange={setT} suffix="мм" />
      <InputField label="Ширина a" value={a} onChange={setA} suffix="мм" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Длина b" value={b} onChange={setB} suffix="мм" />
      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
    </div>
  </div>
)}


 {/* ---- ТРУБА ПРОФИЛЬНАЯ ---- */}
{assortment === "Труба профильная" && (
  <div className="space-y-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Ширина A" value={a} onChange={setA} suffix="мм" />
      <InputField label="Высота B" value={b} onChange={setB} suffix="мм" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Стенка t" value={t} onChange={setT} suffix="мм" />
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
      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
    </div>
  </div>
)}



        {/* ---- ТРУБА КРУГЛАЯ ---- */}
{assortment === "Труба круглая" && (
  <div className="space-y-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Внешний диаметр D" value={d} onChange={setD} suffix="мм" />
      <InputField label="Толщина стенки t" value={t} onChange={setT} suffix="мм" />
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
      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
    </div>
  </div>
)}

{/* ---- КРУГ/ПРУТОК (оставляем отдельно как было) ---- */}
{assortment === "Круг/пруток" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <InputField label="Диаметр D" value={d} onChange={setD} suffix="мм" />
    <div className="hidden sm:block" />
  </div>
)}

{/* ---- УГОЛОК ---- */}
{assortment === "Уголок" && (
  <div className="space-y-4">
    <UiSelect
      label="Марка стали"
      value={steelMark}
      onChange={setSteelMark}
      options={STEEL_GRADES as unknown as string[]}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Ширина полки a" value={a} onChange={setA} suffix="мм" />
      <InputField label="Высота полки b" value={b} onChange={setB} suffix="мм" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Толщина полки t" value={t} onChange={setT} suffix="мм" />
      <div className="hidden sm:block" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />
      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
    </div>
  </div>
)}



        {/* ---- Общий ввод (кроме арматуры, балки и квадрата) ---- */}
        {assortment !== "Арматура" &&
          assortment !== "Балка/двутавр" &&
          assortment !== "Квадрат" &&
          assortment !== "Лента" &&
          assortment !== "Лист/плита" &&
          assortment !== "Труба круглая" &&
          assortment !== "Труба профильная" &&
          assortment !== "Уголок" && (
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
              <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
            </div>
          )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4 text-zinc-900 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-200/50 ring-1 ring-zinc-100"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            {/* Заголовок + режим */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
                Калькулятор<span className="text-blue-600"> металла</span>
              </h1>

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
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-[9px] transition-all cursor-pointer",
                    mode === "length"
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                      : "text-zinc-500 hover:text-zinc-700"
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
                onChange={setMetal}
                options={METALS}
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
          <div className="order-last md:order-none w-full md:w-[320px] bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-100 p-4 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-center py-4 md:py-6">
              <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] flex items-center justify-center">
                <AssortmentScheme
                  assortment={assortment}
                  d={d}
                  a={a}
                  b={assortment === "Лента" ? len : b}
                  t={t}
                />
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {mode === "weight" ? "Итоговый вес" : "Итоговая длина"}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                  {fmtNum(result)}
                </span>
                <span className="text-lg font-bold text-zinc-400">{mode === "weight" ? "кг" : "м"}</span>
              </div>

              {assortment === "Лист/плита" && mode === "weight" && (
  <div className="text-sm text-zinc-500">
    Площадь: <span className="font-semibold text-zinc-800">{area ? area.toFixed(2) : 0}</span> м²
  </div>
)}


              <div className="text-xs text-zinc-400 mt-2 h-4">
                {assortment ? `${metal} • ${assortment}` : ""}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
