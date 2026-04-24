import Link from "next/link";
import { METAL_SLUG_TO_NAME, ASSORTMENT_SLUG_TO_NAME, getSeoData, METAL_TO_ASSORTMENTS, IS_SUBPAGE } from "../lib/seo-engine";

// Принудительная статическая генерация страницы карты сайта
export const dynamic = "force-static";

export default function SitemapPage() {
  const metals = Object.entries(METAL_SLUG_TO_NAME);

  // Собираем все саб-страницы для отдельного блока внизу
  const subpages: { metalSlug: string, assortmentSlug: string }[] = [];
  metals.forEach(([metalSlug]) => {
    const assortments = METAL_TO_ASSORTMENTS[metalSlug] || [];
    assortments.forEach(assortmentSlug => {
      if (IS_SUBPAGE && IS_SUBPAGE[assortmentSlug]) {
        subpages.push({ metalSlug, assortmentSlug });
      }
    });
  });

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col items-center py-16 px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-8 tracking-tight">
          Карта сайта
        </h1>
        
        <div className="flex flex-col space-y-2 mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4 w-fit">
            Главная
          </Link>
        </div>

        <div className="space-y-12">
          {metals.map(([metalSlug, metalName]) => {
            const availableAssortments = (METAL_TO_ASSORTMENTS[metalSlug] || []).filter(
              (slug) => !IS_SUBPAGE || !IS_SUBPAGE[slug]
            );
            
            if (availableAssortments.length === 0) return null;

            return (
              <div key={metalSlug} className="border-t border-zinc-100 pt-8 first:border-0 first:pt-0">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 bg-zinc-50 py-2 px-4 rounded-xl inline-block border border-zinc-100">
                  {metalName}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pl-4">
                  {availableAssortments.map((assortmentSlug) => {
                    const { h1_suffix } = getSeoData(metalSlug, assortmentSlug);
                    
                    return (
                      <li key={assortmentSlug} className="flex items-center before:content-['•'] before:text-zinc-300 before:mr-3">
                        <Link 
                          href={`/${metalSlug}/${assortmentSlug}/`}
                          className="text-blue-600 hover:text-blue-800 hover:underline decoration-blue-200 underline-offset-4 text-sm md:text-base transition-colors"
                        >
                          Калькулятор веса {h1_suffix}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Блок для саб-страниц (ГОСТы и Размеры) */}
        {subpages.length > 0 && (
          <div className="mt-16 pt-10 border-t border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900 mb-8">
              Популярные расчеты (ГОСТы и размеры)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Object.entries(
                subpages.reduce((acc, sp) => {
                  const baseSlug = Object.keys(ASSORTMENT_SLUG_TO_NAME).find(
                    key => ASSORTMENT_SLUG_TO_NAME[key] === ASSORTMENT_SLUG_TO_NAME[sp.assortmentSlug] && !IS_SUBPAGE[key]
                  ) || sp.assortmentSlug;
                  
                  const baseName = ASSORTMENT_SLUG_TO_NAME[baseSlug] || "Разное";
                  if (!acc[baseName]) acc[baseName] = [];
                  acc[baseName].push(sp);
                  return acc;
                }, {} as Record<string, typeof subpages>)
              ).map(([baseName, items]) => (
                <div key={baseName} className="flex flex-col">
                  <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-4">{baseName}</h3>
                  <ul className="flex flex-col space-y-3">
                    {items.map(({ metalSlug, assortmentSlug }) => {
                      return (
                        <li key={`${metalSlug}-${assortmentSlug}`} className="flex items-start">
                          <Link 
                            href={`/${metalSlug}/${assortmentSlug}/`}
                            className="text-zinc-500 hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 text-sm transition-colors leading-snug"
                          >
                            {IS_SUBPAGE[assortmentSlug]}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
