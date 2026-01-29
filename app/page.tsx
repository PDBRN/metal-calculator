import dynamic from "next/dynamic";

console.log("[BUNDLE] page.tsx LOADED");

const Calculator = dynamic(() => import("./components/Calculator").then(mod => mod.Calculator), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white text-zinc-500 font-sans p-4 text-center">
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p>Загрузка калькулятора...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <main>
      <Calculator />
    </main>
  );
}