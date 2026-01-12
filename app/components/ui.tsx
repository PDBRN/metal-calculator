"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Утилиты ---

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование числа для вывода
export function fmtNum(n: number) {
  if (!Number.isFinite(n) || n === 0) return "0";
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 3 });
}

// Парсинг строки в число
export function toNum(s: string) {
  const v = (s ?? "").toString().replace(/\s+/g, "").replace(",", ".");
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

// --- Компоненты ---

function ChevronDown({ open }: { open: boolean }) {
  return (
    <motion.svg animate={{ rotate: open ? 180 : 0 }} className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function UiSelect({
  label, value, onChange, options, placeholder = "Выберите", className,
}: {
  label?: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative group", className)} ref={wrapRef}>
      {label && <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border bg-zinc-50/50 px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-100",
          "border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "cursor-pointer", // <--- ДОБАВИЛ СЮДА
          open && "border-blue-500 ring-2 ring-blue-500/20 bg-white",
          !value ? "text-zinc-400" : "text-zinc-900"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-xl ring-1 ring-black/5"
          >
            <div className="max-h-60 overflow-auto py-1 custom-scrollbar">
              {options.length > 0 ? (
                options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-xs sm:text-sm transition-colors cursor-pointer", // <--- И СЮДА
                      opt === value ? "bg-blue-50 text-blue-600 font-medium" : "text-zinc-700 hover:bg-zinc-50"
                    )}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-xs text-zinc-400">Нет доступных опций</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InputField({
  label, value, onChange, suffix, placeholder = "0"
}: {
  label: string; value: string; onChange: (v: string) => void; suffix: string; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 ml-1">{label}</label>
      <div className="relative group">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none transition-all placeholder:text-zinc-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 group-hover:border-zinc-300"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">{suffix}</span>
      </div>
    </div>
  );
}