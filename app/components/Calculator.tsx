"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn, fmtNum, toNum, UiSelect, InputField } from "./ui";
import { METALS, METAL_DATA } from "./data";
import { calculateResult } from "./calc";
import AssortmentScheme from "./schemes";

export default function Calculator() {
  const [metal, setMetal] = useState("Чёрный");
  const [assortment, setAssortment] = useState("");
  const [mode, setMode] = useState<"weight" | "length">("weight");

  const [steelMark, setSteelMark] = useState("Ст 3");
  const [beamType, setBeamType] = useState("Нормальный (Б)");
  
  const [d, setD] = useState("10");
  const [t, setT] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const [len, setLen] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [qty, setQty] = useState("");

  const [result, setResult] = useState(0);

  useEffect(() => { setAssortment(""); setResult(0); }, [metal]);
  useEffect(() => { setResult(0); }, [mode, assortment]);

  const availableAssortments = useMemo(() => METAL_DATA[metal] || [], [metal]);

  const handleCalculate = () => {
    if (!assortment) return;
    const inputs = {
      qty: toNum(qty) || 1,
      len: toNum(len),
      weight: toNum(weightInput),
      d: toNum(d) / 1000,
      a: toNum(a) / 1000,
      b: toNum(b) / 1000,
      t: toNum(t) / 1000,
    };
    const res = calculateResult(mode, metal, assortment, inputs);
    setResult(res);
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
                Калькулятор<span className="text-blue-600"> металла</span>
              </h1>
              <div className="flex bg-zinc-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setMode("weight")}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-[9px] transition-all cursor-pointer", // <---
                    mode === "weight" ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Вес
                </button>
                <button
                  onClick={() => setMode("length")}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-[9px] transition-all cursor-pointer", // <---
                    mode === "length" ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Длина
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <UiSelect label="Металл" value={metal} onChange={setMetal} options={METALS} placeholder="Выберите металл" />
              <UiSelect label="Сортамент" value={assortment} onChange={setAssortment} options={availableAssortments} placeholder="Выберите сортамент" />
            </div>

            <div className="h-px w-full bg-zinc-100 my-2" />

            <div className="space-y-4 min-h-[220px]">
              <AnimatePresence mode="wait">
                {!assortment ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full items-center justify-center pt-10 text-zinc-400 text-sm">
                    ← Выберите тип изделия
                  </motion.div>
                ) : (
                  <motion.div key={assortment} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {assortment !== "Арматура" && (
                        <UiSelect label="Марка / Сплав" value={steelMark} onChange={setSteelMark} options={["Ст 3", "09Г2С", "AISI 304", "Д16Т"]} />
                      )}
                      {assortment === "Балка/двутавр" && (
                         <UiSelect label="Тип балки" value={beamType} onChange={setBeamType} options={["Нормальный (Б)", "Широкополочный (Ш)", "Колонный (К)"]} />
                      )}
                    </div>

                    {assortment === "Арматура" && (
                      <div className="grid grid-cols-2 gap-4">
                        <UiSelect
                          label="Диаметр (мм)"
                          value={d}
                          onChange={setD}
                          options={["6","8","10","12","14","16","20","25","32","36"]}
                        />
                      </div>
                    )}

                    {assortment === "Балка/двутавр" && (
                      <div className="grid grid-cols-3 gap-4">
                         <InputField label="Высота H" value={a} onChange={setA} suffix="мм" />
                         <InputField label="Ширина B" value={b} onChange={setB} suffix="мм" />
                         <InputField label="Толщина t" value={t} onChange={setT} suffix="мм" />
                      </div>
                    )}

                    {assortment === "Квадрат" && (
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Сторона a" value={a} onChange={setA} suffix="мм" />
                      </div>
                    )}

                    {(assortment === "Лист/плита" || assortment === "Лента") && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InputField label="Толщина t" value={t} onChange={setT} suffix="мм" />
                        <InputField label="Ширина a" value={a} onChange={setA} suffix="мм" />
                        {assortment === "Лист/плита" && <InputField label="Длина b" value={b} onChange={setB} suffix="мм" />}
                      </div>
                    )}

                    {assortment === "Труба профильная" && (
                      <div className="grid grid-cols-3 gap-4">
                        <InputField label="Ширина A" value={a} onChange={setA} suffix="мм" />
                        <InputField label="Высота B" value={b} onChange={setB} suffix="мм" />
                        <InputField label="Стенка t" value={t} onChange={setT} suffix="мм" />
                      </div>
                    )}

                    {(assortment === "Труба круглая" || assortment === "Круг/пруток") && (
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Диаметр D" value={d} onChange={setD} suffix="мм" />
                        {assortment === "Труба круглая" && <InputField label="Стенка t" value={t} onChange={setT} suffix="мм" />}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {mode === "weight" ? (
                        <>
                          {assortment !== "Лист/плита" && <InputField label="Длина L" value={len} onChange={setLen} suffix="м" />}
                        </>
                      ) : (
                        <InputField label="Общий Вес" value={weightInput} onChange={setWeightInput} suffix="кг" />
                      )}
                      <InputField label="Количество" value={qty} onChange={setQty} suffix="шт" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!assortment}
              className={cn(
                "relative w-full overflow-hidden rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98]",
                !assortment 
                  ? "bg-zinc-300 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 shadow-blue-600/30 hover:bg-blue-700 cursor-pointer" // <---
              )}
            >
              {mode === "weight" ? "Рассчитать вес" : "Рассчитать длину"}
            </button>
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="w-full md:w-[320px] bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-100 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex-1 flex items-center justify-center py-6">
              <div className="w-[260px] h-[260px] flex items-center justify-center">
                 <AssortmentScheme assortment={assortment} d={d} a={a} b={b} t={t} />
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{mode === "weight" ? "Итоговый вес" : "Итоговая длина"}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-blue-600 tracking-tight">{fmtNum(result)}</span>
                <span className="text-lg font-bold text-zinc-400">{mode === "weight" ? "кг" : "м"}</span>
              </div>
              <div className="text-xs text-zinc-400 mt-2 h-4">{assortment ? `${metal} • ${assortment}` : ""}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
