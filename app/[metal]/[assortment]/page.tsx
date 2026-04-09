import { Metadata } from "next";
import { getSeoData, METAL_TO_ASSORTMENTS } from "../../lib/seo-engine";
import { Calculator } from "../../components/Calculator";
import { Suspense } from "react";
import { Metal } from "../../components/data";
import Link from "next/link";

// Для статического экспорта генерируем все возможные комбинации (70+ страниц)
export function generateStaticParams() {
  const params: { metal: string, assortment: string }[] = [];
  
  for (const [metal, assortments] of Object.entries(METAL_TO_ASSORTMENTS)) {
    for (const assortment of assortments) {
      params.push({ metal, assortment });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ metal: string, assortment: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { title, description } = getSeoData(resolvedParams.metal, resolvedParams.assortment);
  const canonicalUrl = `https://metall-calculator.ru/${resolvedParams.metal}/${resolvedParams.assortment}/`;
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "Metall Calculator — Калькулятор металла",
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export default async function SeoPage({ params }: { params: Promise<{ metal: string, assortment: string }> }) {
  const resolvedParams = await params;
  const { h1, metalName, assortmentName, h1_suffix, instructionParams } = getSeoData(resolvedParams.metal, resolvedParams.assortment);

  return (
    <main className="min-h-screen bg-[#F3F4F6] font-sans flex flex-col">
      
      {/* Контент страницы */}
      <div className="flex-1 w-full flex flex-col items-center pt-10 pb-12 px-4 max-w-[1400px] mx-auto">
        
        {/* 2. Строгий и незаметный SEO Заголовок (Стиль: Минимализм) */}
        <div className="max-w-4xl w-full flex flex-col items-start mb-6 px-1 md:px-0">
          {/* Хлебные крошки для контекста */}
          <div className="flex items-center space-x-2 text-xs md:text-sm font-medium text-zinc-400 mb-2">
            <Link href="/" className="cursor-pointer hover:text-zinc-600 transition-colors">Главная</Link>
            <span>/</span>
            <span>{metalName}</span>
            <span>/</span>
            <span className="text-zinc-600">{assortmentName}</span>
          </div>
          
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-800 tracking-tight">
            Калькулятор веса {h1_suffix}
          </h1>
        </div>

        {/* 3. Сам Калькулятор */}
        <div className="w-full flex justify-center mb-16">
          <Suspense fallback={
            <div className="w-full max-w-4xl h-[400px] flex items-center justify-center bg-white rounded-3xl shadow-sm ring-1 ring-zinc-100 text-zinc-500">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p>Загрузка калькулятора...</p>
              </div>
            </div>
          }>
            <Calculator 
              key={`${resolvedParams.metal}-${resolvedParams.assortment}`}
              initialMetal={metalName as Metal} 
              initialAssortment={assortmentName} 
            />
          </Suspense>
        </div>

        {/* 4. SEO Инструкция (Как рассчитать) */}
        <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-3xl shadow-sm ring-1 ring-zinc-100 mb-12">
           <h2 className="text-xl md:text-2xl font-bold text-zinc-800 mb-4">Как рассчитать вес {h1_suffix}?</h2>
           <ol className="list-decimal list-outside ml-5 space-y-2 text-zinc-600 text-sm md:text-base">
             <li>Убедитесь, что в калькуляторе выбран правильный металл: <strong className="text-zinc-900">{metalName}</strong>.</li>
             <li>В поле "Тип изделия" должен быть указан сортамент: <strong className="text-zinc-900">{assortmentName}</strong>.</li>
             <li>Выберите марку сплава из выпадающего списка (если применимо).</li>
             <li>Укажите необходимые параметры: <strong>{instructionParams}</strong>.</li>
             <li>Калькулятор автоматически вычислит итоговый вес в правой части экрана. Без формул и таблиц!</li>
           </ol>
        </div>

        {/* 5. Перелинковка (Смотрите также) */}
        <div className="w-full max-w-4xl text-center border-t border-zinc-200/60 pt-10">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Смотрите также</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
             <Link href="/" className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4 transition-colors">
               Главная
             </Link>
             <Link href="/sitemap/" className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4 transition-colors">
               Карта сайта
             </Link>
          </div>
        </div>

      </div>
      {/* 6. JSON-LD Микроразметка (Хлебные крошки) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://metall-calculator.ru/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": metalName,
                "item": `https://metall-calculator.ru/${resolvedParams.metal}/`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": assortmentName
              }
            ]
          })
        }}
      />
    </main>
  );
}
