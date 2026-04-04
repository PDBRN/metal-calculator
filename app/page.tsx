import { Suspense } from "react";
import { Calculator } from "./components/Calculator";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор металла онлайн | Точный вес и длина металлопроката",
  description: "Удобный онлайн калькулятор для расчета веса, длины и площади металлопроката. Черный, нержавеющий, алюминиевый и медный прокат. Без регистрации и таблиц.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] font-sans flex flex-col">
      {/* 1. Верхний бар (место для будущего меню) */}
      <div className="h-16 w-full bg-white/60 backdrop-blur-md border-b border-zinc-200 fixed top-0 z-50 flex items-center px-4 md:px-8">
         <span className="text-zinc-400 font-medium text-sm tracking-wide">Место для меню (Top Bar)</span>
      </div>

      {/* Контент страницы */}
      <div className="flex-1 w-full flex flex-col items-center pt-20 pb-6 px-4 max-w-[1400px] mx-auto">
        
        {/* Скрытый заголовок для SEO (не портит внешний вид) */}
        <h1 className="sr-only">Калькулятор металла онлайн. Точный вес и длина металлопроката.</h1>

        {/* Калькулятор с предустановкой как у конкурентов */}
        <div className="w-full flex justify-center mb-16">
          <Suspense fallback={
            <div className="w-full max-w-4xl h-[400px] flex items-center justify-center bg-white rounded-3xl shadow-sm ring-1 ring-zinc-100 text-zinc-500">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p>Загрузка калькулятора...</p>
              </div>
            </div>
          }>
            <Calculator initialMetal="Чёрный" initialAssortment="Труба круглая" isMainPage={true} />
          </Suspense>
        </div>

        {/* Перелинковка (Смотрите также) */}
        <div className="w-full max-w-4xl text-center border-t border-zinc-200/60 pt-10 mt-auto">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Популярные направления</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
             <Link href="/sitemap/" className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4 transition-colors">
               Полный каталог расчетов (Карта сайта)
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
}