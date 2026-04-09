"use client";

import { useState, Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSeoData, METAL_TO_ASSORTMENTS, METAL_SLUG_TO_NAME, ASSORTMENT_SLUG_TO_NAME } from "../lib/seo-engine";
import { Calculator } from "../components/Calculator";
import { cn } from "../components/ui";

export default function Test1Page() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex flex-col relative overflow-x-hidden">

      {/* 1. PREMIUM_NAV_BAR */}
      <header className="h-20 w-full bg-white/70 backdrop-blur-2xl border-b border-zinc-200/50 sticky top-0 z-[60] flex items-center px-6 md:px-12 justify-between">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase">Metall<span className="text-blue-600">Calculator</span></span>
          </div>

          <div className="flex items-center gap-10">
             <nav className="hidden lg:flex items-center gap-10">
               {['Справочник', 'ГОСТы', 'О сервисе', 'Контакты'].map((item) => (
                 <a key={item} href="#" className="text-[10px] font-black text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">{item}</a>
               ))}
             </nav>
             <button className="lg:hidden p-3 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN_SECTION */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-12 pb-24 flex flex-col items-center px-4 md:px-8">

        {/* ACTION_BAR */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
           <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[10px] font-black uppercase tracking-widest">v1.2 Stable</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                 ПЕЧАТЬ
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600 hover:border-red-400 hover:text-red-600 transition-all shadow-sm">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.01.707.293l5.414 5.414a1 1.01.293.707V19a2 2 0 01-2 2z" /></svg>
                 PDF КП
              </button>
           </div>
        </div>

        {/* 3. CALCULATOR_CARD */}
        <section className="w-full max-w-4xl mb-24">
          <Suspense fallback={<div className="h-[600px] bg-white rounded-[3rem] animate-pulse flex items-center justify-center text-zinc-400">Загрузка данных...</div>}>
            <Calculator initialMetal="Чёрный" initialAssortment="Арматура" showHistory={true} />
          </Suspense>
        </section>

        {/* 4. PREMIUM_SEO_GUIDE (APPLE_STYLE) */}
        <article className="w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden p-8 md:p-16">

          <header className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tighter">Расчет веса арматуры: формулы и ГОСТы</h2>
            <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-2xl">
              Справочная информация для вычисления удельного веса стального проката. Опираемся на актуальные стандарты для точного проектирования ЖБИ.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ЛЕВАЯ КОЛОНКА */}
            <div className="space-y-12">
              <section>
                <h3 className="text-lg font-black text-zinc-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center text-sm font-bold">1</span>
                  Доступные ГОСТы
                </h3>
                <ul className="space-y-4">
                   {[
                     {g: "ГОСТ 34028-2016", d: "Прокат арматурный для железобетонных конструкций."},
                     {g: "ГОСТ 5781-82", d: "Сталь горячекатаная для армирования ЖБК."},
                     {g: "ГОСТ 52544-2006", d: "Прокат свариваемый периодического профиля (А500С и В500С)."}
                   ].map((item, i) => (
                     <li key={i} className="flex flex-col border-l-2 border-zinc-100 pl-4 py-1">
                       <span className="text-sm font-black text-zinc-900">{item.g}</span>
                       <span className="text-xs text-zinc-500 font-medium">{item.d}</span>
                     </li>
                   ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-black text-zinc-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center text-sm font-bold">2</span>
                  Формула расчёта
                </h3>
                <div className="bg-blue-600 text-white p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-blue-500/20">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                   <p className="text-blue-200 text-[10px] mb-3 font-black tracking-[0.2em] uppercase">Теоретический вес</p>
                   <p className="text-2xl md:text-3xl font-mono font-bold tracking-tighter mb-6 relative z-10">M = (<span className="text-blue-200">π×D²</span>/4)×ρ×L</p>
                   <div className="flex flex-col gap-2 text-[10px] uppercase font-bold tracking-widest text-blue-100/80 relative z-10">
                     <div className="flex items-center gap-3"><span className="w-6 text-white text-xs">D</span> номинальный диаметр (м)</div>
                     <div className="flex items-center gap-3"><span className="w-6 text-white text-xs">ρ</span> плотность 7850 кг/м³</div>
                     <div className="flex items-center gap-3"><span className="w-6 text-white text-xs">L</span> длина проката (м)</div>
                   </div>
                </div>
              </section>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div>
              <section>
                <h3 className="text-lg font-black text-zinc-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-8 h-8 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center text-sm font-bold">3</span>
                  Таблица масс (ГОСТ 5781)
                </h3>
                <div className="bg-zinc-50 rounded-3xl border border-zinc-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="p-4 font-black text-[9px] text-zinc-400 uppercase tracking-widest">Ø (мм)</th>
                        <th className="p-4 font-black text-[9px] text-zinc-400 uppercase tracking-widest">Площадь (см²)</th>
                        <th className="p-4 font-black text-[9px] text-zinc-400 uppercase tracking-widest">1 п.м. (кг)</th>
                        <th className="p-4 font-black text-[9px] text-zinc-400 uppercase tracking-widest hidden sm:table-cell">Метров в 1т</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        [8, 0.503, 0.395, 2531.6],
                        [10, 0.785, 0.617, 1620.7],
                        [12, 1.131, 0.888, 1126.1],
                        [14, 1.540, 1.210, 826.4],
                        [16, 2.011, 1.580, 632.9],
                        [18, 2.545, 2.000, 500.0]
                      ].map(([d, area, w, m], i) => (
                        <tr key={d} className="border-b border-zinc-100 last:border-0 hover:bg-white transition-colors">
                          <td className="p-4 font-black text-zinc-900">{d}</td>
                          <td className="p-4 text-zinc-500 font-semibold">{area}</td>
                          <td className="p-4 text-zinc-800 font-bold bg-blue-50/30">{w}</td>
                          <td className="p-4 text-zinc-400 font-semibold hidden sm:table-cell">{m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

          </div>

          {/* 5. МИНИМАЛИСТИЧНЫЙ FAQ */}
          <section className="mt-20 pt-16 border-t border-zinc-100 w-full">
            <h3 className="text-xl font-black text-zinc-900 mb-10 uppercase tracking-widest text-center md:text-left italic">
              Вопросы эксперту
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {[
                {
                  q: "Как перевести метры арматуры в тонны?",
                  a: "Для быстрого перевода используйте формулу: Вес = Длина × Вес 1 погонного метра (из нашей таблицы выше). Например, 100 метров 12-й арматуры весят 88.8 кг."
                },
                {
                  q: "Насколько точен этот расчет?",
                  a: "Калькулятор выдает теоретический вес по ГОСТ. Погрешность реального проката обычно составляет ±3-5% и зависит от завода-изготовителя."
                },
                {
                  q: "Что такое периодический профиль?",
                  a: "Это рифленая поверхность арматуры (классы А400, А500С), которая обеспечивает максимальное сцепление с бетоном в монолитных конструкциях."
                },
                {
                  q: "Почему плотность стали 7850 кг/м³?",
                  a: "Это средний стандарт плотности углеродистых сталей марок Ст3, Ст35, Ст45. Именно это значение используется во всех инженерных справочниках для расчетов."
                }
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex items-start gap-4 mb-3">
                     <span className="text-blue-600 font-black text-sm select-none">?</span>
                     <h4 className="text-sm font-black text-zinc-900 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                       {item.q}
                     </h4>
                  </div>
                  <p className="text-zinc-500 text-[11px] leading-relaxed font-medium pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>

      {/* 5. CHAT_WIDGET */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-5">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-zinc-100 overflow-hidden flex flex-col"
            >
               <div className="bg-zinc-900 p-8 flex flex-col gap-10">
                  <div className="flex items-center gap-10">
                     <div className="w-12 h-12 rounded-2xl bg-zinc-800 overflow-hidden border border-zinc-700">
                        <img src="https://ui-avatars.com/api/?name=Support&background=333&color=fff" alt="Support" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <div className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">Служба экспертов</div>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           <div className="text-emerald-500 text-[10px] font-black uppercase">Live Support</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 p-8 bg-zinc-50/50 overflow-y-auto space-y-6">
                  <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none shadow-sm text-xs text-zinc-600 leading-relaxed font-bold border border-zinc-100">
                    Напишите нам для уточнения цен на металлопрокат с учетом доставки. Отвечаем за 2 минуты.
                  </div>
               </div>
               <div className="p-6 bg-white border-t border-zinc-100 flex gap-3">
                  <input type="text" placeholder="Ваше сообщение..." className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-300 font-bold" />
                  <button className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg></button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setChatOpen(!chatOpen)} className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl bg-zinc-900 text-white hover:bg-blue-600 transition-all active:scale-90 group">
           {chatOpen ? <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
        </button>
      </div>

      {/* 6. FOOTER */}
      <footer className="w-full bg-white border-t border-zinc-200/50 py-24 px-6 md:px-12">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8 md:col-span-2">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <span className="text-sm font-black text-zinc-900 tracking-tighter uppercase italic">Metall Calculator</span>
               </div>
               <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm italic">Профессиональное инженерное ПО для расчета параметров металлопроката в режиме реального времени. v1.2 Release.</p>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest italic">Стандарты</h4>
               <ul className="space-y-4">
                  {['ГОСТ 34028-2016', 'ГОСТ 5781-82', 'ГОСТ 52544-2006'].map(g => (
                    <li key={g}><a href="#" className="text-[11px] text-zinc-400 hover:text-blue-600 transition-colors uppercase font-black tracking-widest">{g}</a></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest italic">Навигация</h4>
               <ul className="space-y-4">
                  <li><Link href="/" className="text-[11px] text-zinc-400 hover:text-blue-600 transition-colors uppercase font-black tracking-widest">Главная</Link></li>
                  <li><Link href="/sitemap/" className="text-[11px] text-zinc-400 hover:text-blue-600 transition-colors uppercase font-black tracking-widest">Карта сайта</Link></li>
                  <li><a href="#" className="text-[11px] text-zinc-400 hover:text-blue-600 transition-colors uppercase font-black tracking-widest">О сервисе</a></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}
