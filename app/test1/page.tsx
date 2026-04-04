"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator } from "../components/Calculator";
import { cn } from "../components/ui";

export default function Test1Page() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* 1. ЗАПОЛНЕННЫЙ TOP BAR (Навигация справа) */}
      <header className="h-20 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 sticky top-0 z-[60] flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-12 w-full justify-between">
          <div className="flex items-center gap-2 shrink-0">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <span className="text-xl font-black text-zinc-900 tracking-tighter">METAL<span className="text-blue-600">PRO</span></span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['Каталог цен', 'База ГОСТ', 'О компании', 'Доставка'].map((item) => (
              <a key={item} href="#" className="text-[11px] font-black text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">{item}</a>
            ))}
          </nav>
          
          <div className="lg:hidden">
             <button className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
          </div>
        </div>
      </header>

      {/* 2. ОСНОВНОЙ КОНТЕНТ */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto pt-10 pb-20 flex flex-col items-center">
        
        {/* Кнопки экспорта над дизайном */}
        <div className="w-full max-w-4xl flex justify-end gap-3 mb-6 px-4">
           <button 
             className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold text-zinc-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
             title="Печать текущего расчета"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              ПЕЧАТЬ
           </button>
           <button 
             className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[11px] font-bold text-zinc-600 hover:border-red-400 hover:text-red-600 transition-all shadow-sm hover:shadow-md"
             title="Сохранить в PDF"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PDF КП
           </button>
        </div>


        {/* Калькулятор с интегрированной историей (теперь внутри компонента) */}
        <Suspense fallback={<div className="h-[560px] flex items-center justify-center text-zinc-400">Загрузка калькулятора...</div>}>
          <Calculator initialMetal="Чёрный" initialAssortment="Арматура" />
        </Suspense>
      </div>

      {/* 4. ЧАТ-КОНСУЛЬТАЦИЯ (Справа внизу) */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        
        <AnimatePresence>
          {chatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="w-80 h-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col shadow-blue-500/10"
            >
               <div className="bg-zinc-900 p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden border border-zinc-600">
                           <img src="https://ui-avatars.com/api/?name=Stal+Support&background=333&color=fff" alt="Support" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                     </div>
                     <div>
                        <div className="text-white text-xs font-bold uppercase tracking-widest">Консультант</div>
                        <div className="text-emerald-500 text-[10px] font-bold">В сети, ответит быстро</div>
                     </div>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-tight">Поможем подобрать металл или оформить заказ с доставкой.</p>
               </div>
               <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-zinc-50/50">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-zinc-600 border border-zinc-100 max-w-[85%]">
                     Здравствуйте! 👋 Какой металл планируете заказывать? Мы сейчас отгружаем арматуру по спеццене.
                  </div>
               </div>
               <div className="p-4 bg-white border-t border-zinc-100 flex gap-2">
                  <input type="text" placeholder="Задайте вопрос..." className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                  <button className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 group relative",
            chatOpen ? "bg-zinc-100 text-zinc-900" : "bg-blue-600 text-white shadow-blue-500/40"
          )}
        >
           {chatOpen ? (
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
           ) : (
             <>
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">1</div>
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </>
           )}
        </button>
      </div>

      {/* 5. ФУТЕР С ТЕХ. ИНФОЙ */}
      <footer className="w-full bg-white border-t border-zinc-200/60 py-12 px-6">
         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
               <h4 className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em]">Технические ГОСТы</h4>
               <ul className="space-y-2">
                  {['ГОСТ 5781-82 (Арматура)', 'ГОСТ 10704-91 (Трубы)', 'ГОСТ 8509-93 (Уголок)'].map(g => (
                    <li key={g}><a href="#" className="text-[11px] text-zinc-400 hover:text-blue-600 transition-colors uppercase font-bold">{g}</a></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em]">Популярные марки</h4>
               <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  {['Ст3сп', '09Г2С', 'Ст45', '40Х', 'AISI 304'].map(m => (
                    <span key={m} className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500 uppercase tracking-widest">{m}</span>
                  ))}
               </div>
            </div>
            <div className="space-y-4">
               <h4 className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em]">Помощь в расчете</h4>
               <p className="text-xs text-zinc-400 leading-relaxed font-medium">Если вы не нашли нужный сортамент, наш инженер может рассчитать нестандартное изделие по вашим чертежам.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
